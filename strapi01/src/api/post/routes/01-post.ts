/**
 * post router
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreRouter("api::post.post", {
  prefix: "/test",
  config: {
    findOne: {
      policies: ["api::post.is-post"],
    },
  },
});
