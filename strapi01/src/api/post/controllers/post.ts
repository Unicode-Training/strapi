/**
 * post controller
 */

import { factories } from "@strapi/strapi";
import { Context } from "koa";
export default factories.createCoreController("api::post.post", {
  async find(ctx: Context) {
    // const { data, meta } = await super.find(ctx);
    // meta.message = "Ok";
    // return {
    //   data,
    //   meta,
    // };
    return strapi.service("api::post.post").find(ctx.query);
  },
  export(ctx: Context) {
    const body = ctx.request.body;
    console.log(body);

    return "Export Excel";
  },
});
