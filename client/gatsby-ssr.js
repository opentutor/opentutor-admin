/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/browser-apis/
 */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const wrapWithProvider = require("./wrap-with-provider");
const wrapRootElement = wrapWithProvider;
module.exports = wrapRootElement;
