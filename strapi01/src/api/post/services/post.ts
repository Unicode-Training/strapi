/**
 * post service
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreService("api::post.post", {
  find(args: any): any {
    //Logic
    return super.find(args);
    //Gọi trực tiếp database
  },

  something(query: any) {
    return query;
  },
});
