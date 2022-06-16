const path = require("path");

const gatsbyRequiredRules = path.join(
  process.cwd(),
  "node_modules",
  "gatsby",
  "dist",
  "utils",
  "eslint-rules"
);

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
    
        extensions: ["js", "jsx", "ts", "tsx"],
        exclude: ["node_modules", ".cache", "public"],
        stages: ["develop"],

        emitWarning: true,
        failOnError: false,
        
      },
    },
  ],
};
