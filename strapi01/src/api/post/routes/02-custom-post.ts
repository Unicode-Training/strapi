import { Context } from "koa";
export default {
  routes: [
    // {
    //   method: "GET",
    //   path: "/demo/:id/:slug",
    //   handler: (ctx: Context) => {
    //     console.log(ctx.params);
    //     return "Demo Custom Route";
    //   },
    //   config: {
    //     auth: false,
    //   },
    // },
    {
      method: "POST",
      path: "/test/posts/custom/export",
      handler: "post.export",
      config: {
        policies: ["global::is-admin"],
      },
    },
    {
      method: "GET",
      path: "/test/posts/custom/demo",
      handler: "demo.find",
      config: {
        middlewares: ["api::post.demo", "global::interceptor"],
      },
    },
    {
      method: "GET",
      path: "/test/posts/custom/demo/:id",
      handler: "demo.findOne",
    },
    {
      method: "POST",
      path: "/test/posts/custom/demo",
      handler: "demo.create",
    },
    {
      method: "PUT",
      path: "/test/posts/custom/demo/:id",
      handler: "demo.update",
    },
    {
      method: "DELETE",
      path: "/test/posts/custom/demo/:id",
      handler: "demo.delete",
    },
    {
      method: "PUT",
      path: "/test/posts/custom/demo/:id/publish",
      handler: "demo.publish",
    },
  ],
};
