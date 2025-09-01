module.exports = (plugin) => {
  plugin.controllers.email.something = async (ctx) => {
    // console.log(strapi.service("plugin::email.email"));
    return strapi.service("plugin::email.email").something();
  };

  const rawService = plugin.services.email();
  plugin.services.email = () => {
    return {
      ...rawService,
      something: () => {
        return "Hello world";
      },
    };
  };

  const contentApiRoutes = plugin.routes["content-api"]({ strapi });

  contentApiRoutes.routes.push({
    method: "GET",
    path: "/email/something",
    handler: "email.something",
    config: {
      auth: false,
      prefix: "",
    },
  });

  plugin.routes["content-api"] = () => contentApiRoutes;
  return plugin;
};
