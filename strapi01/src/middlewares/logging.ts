/**
 * `logging` middleware
 */

import type { Core } from "@strapi/strapi";

export default (config, { strapi }: { strapi: Core.Strapi }) => {
  // Add your own logic here.
  return async (ctx, next) => {
    strapi.log.info("In logging middleware.");
    // ctx.throw(401, "Unauthorized");
    await next();
  };
};
