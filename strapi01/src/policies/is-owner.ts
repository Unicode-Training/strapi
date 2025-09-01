export default async (policyContext, config, { strapi }) => {
  const { state, params } = policyContext;
  const user = state.user;

  if (!user) {
    return false;
  }

  const categoryId = params.id;
  const category = await strapi.db.query("api::category.category").findOne({
    where: {
      documentId: categoryId,
      user: user.id,
    },
  });

  if (category) {
    return true;
  }

  return false;
};
