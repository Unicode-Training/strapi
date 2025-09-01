import { Context } from "koa";
import { validateYupSchema, yup } from "@strapi/utils";
const createDemoSchema = yup.object().shape({
  Title: yup
    .string()
    .required("Title is required")
    .min(5, "Title must be at least 5 characters"),
  Content: yup.string().required("Content is required"),
});
export default {
  async find(ctx: Context) {
    return strapi.service("api::post.demo").something();
    // return strapi.service("api::post.post").something(ctx.query);
    // const contentType = strapi.contentType("api::post.post");
    // await strapi.contentAPI.validate.query(ctx.query, contentType, {
    //   auth: ctx.state.auth,
    // });
    // const query = await strapi.contentAPI.sanitize.query(
    //   ctx.query,
    //   contentType,
    //   {
    //     auth: ctx.state.auth,
    //   }
    // );
    // console.log(query);

    // const data = {
    //   name: "Hoàng An",
    //   password: "123456",
    // };

    // const output = await strapi.contentAPI.sanitize.output(data, contentType, {
    //   auth: ctx.state.auth,
    // });
    // return output;
  },
  findOne(ctx: Context) {
    const { id } = ctx.params;
    return strapi.service("api::post.demo").findOne(id);
  },
  // async create(ctx: Context) {
  //   const contentType = strapi.contentType("api::post.post");
  //   await strapi.contentAPI.validate.input(ctx.request.body, contentType, {
  //     auth: ctx.state.auth,
  //   });
  //   const body = await strapi.contentAPI.sanitize.input(
  //     ctx.request.body,
  //     contentType,
  //     {
  //       auth: ctx.state.auth,
  //     }
  //   );

  //   try {
  //     const dataFromBody = await validateYupSchema(createDemoSchema)(body);
  //     return dataFromBody;
  //   } catch (error) {
  //     const errors = Object.fromEntries(
  //       error.details.errors.map((item: any) => {
  //         return [item.path[0], item.message];
  //       })
  //     );

  //     return ctx.throw(400, "Invalid data", {
  //       details: errors,
  //     });
  //   }
  // },

  async create(ctx: Context) {
    const body = ctx.request.body;
    return strapi.service("api::post.demo").create(body);
  },

  async update(ctx: Context) {
    const id = ctx.params.id;
    const body = ctx.request.body;
    return strapi.service("api::post.demo").update(id, body);
  },

  async delete(ctx: Context) {
    const id = ctx.params.id;
    return strapi.service("api::post.demo").delete(id);
  },

  async publish(ctx: Context) {
    const id = ctx.params.id;
    return strapi.service("api::post.demo").publish(id);
  },
};
