export default ({ env }) => ({
  email: {
    config: {
      provider: "strapi-provider-email-smtp",
      providerOptions: {
        host: "smtp.gmail.com", //SMTP Host
        port: 465, //SMTP Port
        secure: true,
        username: "hoangan.web@gmail.com",
        password: "djqs antc dvui rftm",
        rejectUnauthorized: true,
        requireTLS: true,
        connectionTimeout: 1,
      },
    },
    settings: {
      defaultFrom: "Unicode Academy<hoangan.web@gmail.com>",
      defaultReplyTo: "hoangan.web@gmail.com",
    },
  },
  "users-permissions": {
    config: {
      auth: {
        secret: env("JWT_SECRET"),
        expiresIn: env("JWT_EXPIRES_IN"),
      },
      refreshToken: {
        secret: env("JWT_REFRESH_SECRET"),
        expiresIn: env("JWT_REFRESH_EXPIRES_IN"),
      },
      register: {
        allowedFields: ["Fullname"],
      },
    },
  },
  graphql: {
    endpoint: "/graphql",
    shadowCRUD: true,
    enable: true,
    subscriptions: false,
    maxLimit: -1,
    apolloServer: {},
  },
});
