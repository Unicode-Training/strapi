/**
 * demo service
 */

export default () => ({
  async something() {
    // const params: any = {
    //   status: "published",
    //   sort: ["createdAt:desc"],
    //   fields: [
    //     "Title",
    //     "Slug",
    //     "Content",
    //     "Type",
    //     "createdAt",
    //     "updatedAt",
    //     "publishedAt",
    //   ],
    //   filters: {
    //     id: {
    //       $gt: 33,
    //     },
    //   },
    //   populate: {
    //     Thumbnail: {
    //       fields: ["url"],
    //     },
    //     categories: {
    //       fields: ["Name", "Slug"],
    //     },
    //   },
    //   limit: 3,
    //   start: 0,
    // };
    // const data = await strapi.documents("api::post.post").findMany(params);
    // const count = await strapi.documents("api::post.post").count(params);
    // return {
    //   data,
    //   count,
    // };
    // return strapi.db.connection.raw(
    //   "SELECT * FROM posts WHERE published_at IS NOT NULL AND id > :id",
    //   {
    //     id: 33,
    //   }
    // );
    return strapi.db.connection
      .table("posts")
      .select("title", "slug", "content")
      .where("id", ">", 33);
  },
  findOne(id: string) {
    return strapi.documents("api::post.post").findFirst({
      filters: {
        id: {
          $eq: id,
        },
      },
      status: "published",
      populate: {
        Thumbnail: {
          fields: ["url"],
        },
        categories: {
          fields: ["Name", "Slug"],
        },
      },
      // fields: ["Title", "Slug", "Content"],
      sort: [
        {
          id: "desc",
        },
      ],
    });
  },

  create(body: any) {
    return strapi.documents("api::post.post").create({
      data: body,
      status: "published",
      fields: ["Title", "Slug", "Content", "createdAt", "updatedAt"],
      populate: {
        categories: {
          fields: ["Name", "Slug"],
        },
      },
    });
  },

  update(id: string, body: any) {
    return strapi.documents("api::post.post").update({
      documentId: id,
      data: body,
      status: "published",
    });
  },

  delete(id: string) {
    return strapi.documents("api::post.post").delete({
      documentId: id,
      fields: ["Title", "Slug", "Content", "createdAt", "updatedAt"],
      status: "published",
      populate: {
        categories: {
          fields: ["Name", "Slug"],
        },
      },
    });
  },

  publish(id: string) {
    return strapi.documents("api::post.post").discardDraft({
      documentId: id,
    });
  },
});
