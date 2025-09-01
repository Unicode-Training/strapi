import { Core } from "@strapi/strapi";
import { Context } from "koa";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
} from "../../utils/jwt";
import { randomUUID } from "crypto";
import {
  isRefreshTokenValid,
  isTokenBlacklist,
  revokeRefreshToken,
  storeBlacklist,
  storeRefreshToken,
} from "../../utils/redis";
import { getService } from "../../utils";
interface AuthController {
  callback: (ctx: any) => Promise<any>;
}
interface Plugin {
  controllers: {
    auth: (context: { strapi: Core.Strapi }) => AuthController;
    [key: string]: any;
  };
  routes: any;
  services: any;
}
module.exports = async (plugin: Plugin) => {
  plugin.controllers.user.me = async (ctx: Context) => {
    const blacklstFields = [
      "password",
      "resetPasswordToken",
      "confirmationToken",
      "confirmed",
      "blocked",
      "publishedAt",
    ];
    const user = ctx.state.user;
    if (!user) {
      return ctx.unauthorized();
    }

    const fullUser = await strapi
      .documents("plugin::users-permissions.user")
      .findOne({
        documentId: user.documentId,
        populate: {
          role: {
            populate: {
              permissions: true,
            },
          },
          Avatar: true,
        },
      });
    return Object.keys(fullUser).reduce((acc, key) => {
      if (!blacklstFields.includes(key)) {
        acc[key] = fullUser[key];
      }
      return acc;
    }, {});
  };

  plugin.controllers.user.updateMe = async (ctx: Context) => {
    const auth = ctx.state.user;
    if (!auth.id) {
      return ctx.unauthorized("Unauthorized");
    }
    const data = ctx.request.body;
    const updateUser = await strapi
      .documents("plugin::users-permissions.user")
      .update({
        documentId: auth.documentId,
        data,
      });
    return ctx.send(updateUser);
  };

  const rawAuth = plugin.controllers.auth({ strapi });
  const auth = ({ strapi }) => {
    return {
      ...rawAuth,
      callback: async (ctx: Context) => {
        const provider = ctx.params.provider || "local";
        if (provider === "local") {
          const { identifier, password } = ctx.request.body;
          const user = await strapi
            .query("plugin::users-permissions.user")
            .findOne({
              where: {
                email: identifier,
              },
            });
          if (
            !user ||
            !(await strapi.plugins[
              "users-permissions"
            ].services.user.validatePassword(password, user.password))
          ) {
            return ctx.unauthorized("Invalid identifier or password");
          }

          if (!user.confirmed) {
            return ctx.unauthorized("User not confirmed");
          }

          if (user.blocked) {
            return ctx.unauthorized("User blocked");
          }

          const accessToken = generateAccessToken(user, randomUUID());
          const jti = randomUUID();
          const refreshToken = generateRefreshToken(user, jti);
          const { exp } = JSON.parse(
            Buffer.from(refreshToken.split(".")[1], "base64").toString()
          );
          await storeRefreshToken(jti, user.id, exp);
          return ctx.send({
            user,
            accessToken,
            refreshToken,
          });
        }

        try {
          //Kiểm tra email trước
          const query = ctx.query;
          const accessTokenProvider =
            query.access_token || query.code || query.oauth_token;

          const providers = await strapi
            .store({ type: "plugin", name: "users-permissions", key: "grant" })
            .get();

          const providerProfile = await getService("providers-registry").run({
            provider,
            query,
            accessToken: accessTokenProvider,
            providers,
          });
          console.log(providerProfile);

          if (providerProfile.email) {
            //Truy vấn tới database
            const existingUser = await strapi
              .query("plugin::users-permissions.user")
              .findOne({
                where: {
                  email: providerProfile.email,
                },
              });
            if (existingUser) {
              const accessToken = generateAccessToken(
                existingUser,
                randomUUID()
              );
              const jti = randomUUID();
              const refreshToken = generateRefreshToken(existingUser, jti);
              const { exp } = JSON.parse(
                Buffer.from(refreshToken.split(".")[1], "base64").toString()
              );
              await storeRefreshToken(jti, existingUser.id, exp);
              return ctx.send({
                user: existingUser,
                accessToken,
                refreshToken,
              });
            }
          }

          const user = await getService("providers").connect(
            provider,
            ctx.query
          );

          if (user.blocked) {
            return ctx.unauthorized("User blocked");
          }

          const accessToken = generateAccessToken(user, randomUUID());
          const jti = randomUUID();
          const refreshToken = generateRefreshToken(user, jti);
          const { exp } = JSON.parse(
            Buffer.from(refreshToken.split(".")[1], "base64").toString()
          );
          await storeRefreshToken(jti, user.id, exp);
          return ctx.send({
            user,
            accessToken,
            refreshToken,
          });
        } catch (error) {
          return ctx.throw(500, error.message);
        }
      },
      refresh: async (ctx: Context) => {
        const { refreshToken } = ctx.request.body;
        if (!refreshToken) {
          return ctx.unauthorized("Missing refresh token");
        }
        try {
          const payload: any = verifyRefreshToken(refreshToken);
          const valid = await isRefreshTokenValid(payload.jti);
          if (!valid) {
            return ctx.unauthorized("Invalid refresh token");
          }
          const user = await strapi
            .query("plugin::users-permissions.user")
            .findOne({
              where: { id: payload.sub },
            });
          const accessToken = generateAccessToken(user, randomUUID());
          const jti = randomUUID();
          const newRefreshToken = generateRefreshToken(user, jti);
          const { exp } = JSON.parse(
            Buffer.from(newRefreshToken.split(".")[1], "base64").toString()
          );
          await storeRefreshToken(jti, user.id, exp);
          await revokeRefreshToken(payload.jti);
          return ctx.send({
            accessToken,
            refreshToken: newRefreshToken,
          });
        } catch (error) {
          return ctx.unauthorized("Invalid refresh token");
        }
      },
      logout: async (ctx: Context) => {
        const token = ctx.request.headers.authorization?.replace("Bearer ", "");
        const payload: any = verifyAccessToken(token);
        await storeBlacklist(payload.jti, payload.id, payload.exp);
        return ctx.send({
          message: "Logout successful",
        });
      },
    };
  };

  plugin.controllers.auth = auth;

  const contentApiRoutes = plugin.routes["content-api"]({ strapi });
  contentApiRoutes.routes.push({
    method: "POST",
    path: "/auth/refresh",
    handler: "auth.refresh",
    config: {
      auth: false,
      prefix: "",
    },
  });

  contentApiRoutes.routes.push({
    method: "POST",
    path: "/auth/logout",
    handler: "auth.logout",
    config: {
      prefix: "",
    },
  });

  contentApiRoutes.routes.push({
    method: "PATCH",
    path: "/user/me",
    handler: "user.updateMe",
    config: {
      prefix: "",
    },
  });

  plugin.routes["content-api"] = () => contentApiRoutes;

  const rawJwt = plugin.services.jwt({ strapi });
  plugin.services.jwt = ({ strapi }) => {
    return {
      ...rawJwt,
      verify: async (token: string) => {
        const payload: any = verifyAccessToken(token);

        if (payload) {
          //Kiểm tra blacklist

          if (await isTokenBlacklist(payload.jti)) {
            return null;
          }
        }

        //Kiểm tra tài khoản block
        return payload;
      },
    };
  };

  return plugin;
};
