module.exports = {
  pathPrefix: `/admin`,
  flags: {
    DEV_SSR: true,
  },
  siteMetadata: {
    title: `Open Tutor Grading`,
    description: ``,
    siteUrl: "https://admin.opentutor.info",
  },
  plugins: [
    {
      resolve: `gatsby-plugin-env-variables`,
      options: {
        allowList: ["GRAPHQL_ENDPOINT", "CLASSIFIER_ENTRYPOINT"],
      },
    },
    {
      resolve: "gatsby-plugin-offline",
    },
    {
      resolve: "gatsby-plugin-typescript",
    },
    {
      resolve: "@iostindex/gatsby-plugin-material-ui",
    },
    {
      resolve: "gatsby-plugin-sitemap",
    },
  ],
};
