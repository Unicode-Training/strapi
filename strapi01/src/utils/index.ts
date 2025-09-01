export const getService = (name: string) => {
  return strapi.plugin("users-permissions").service(name);
};
