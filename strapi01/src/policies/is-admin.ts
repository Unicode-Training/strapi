/**
 * is-admin policy
 */
export default (policyContext, config, { strapi }) => {
  // Add your own logic here.
  strapi.log.info("In is-admin policy.");

  const canDoSomething = false;

  if (canDoSomething) {
    return true;
  }
  const context = strapi.requestContext.get();
  context.throw(403, "Không có quyền", {
    details: {
      message: "Thông báo gì đó",
    },
  });
};
