module.exports = {
  pathPrefix: `/admin`,
  siteMetadata: {
    title: `Open Tutor Grading`,
    description: ``,
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
      resolve: "gatsby-plugin-sitemap",
    },
    {
      resolve: "gatsby-plugin-typescript",
    },
    {
      resolve: "@iostindex/gatsby-plugin-material-ui",
    },
  ],
};
