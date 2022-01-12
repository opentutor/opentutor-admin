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
      resolve: "gatsby-plugin-material-ui",
    },
    {
      resolve: "gatsby-plugin-react-helmet",
    },
    {
      resolve: "gatsby-plugin-use-query-params",
    },
    {
      resolve: "gatsby-plugin-eslint",
      options: {
        test: /\.js$|\.jsx$|\.ts$|\.tsx$/,
        exclude: /(node_modules|.cache|public|static)/,
        stages: ["develop"],
        options: {
          emitWarning: true,
          failOnError: false,
        },
      },
    },
  ],
};
