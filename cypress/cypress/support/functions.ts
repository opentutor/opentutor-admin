export function cySetup(cy) {
  cy.server();
  cy.viewport(1280, 720);
}

export function cyMockGraphQL(cy, query, data) {
  cy.route2({
    method: "POST",
    url: "**/graphql",
  },
    (req) => {
      const g = JSON.parse(req.body);
      const q = g.query.replace(/\s+/g, ' ').replace("\n", "").trim();
      if (q.indexOf(`{ ${query}`) !== -1) {
        req.reply({
          body: {
            data: data,
            errors: null,
          },
          headers: {
            "Content-Type": "application/json",
          },
        })
      }
    }
  ).as(query);
}

export function cyLoginGoogle(cy) {
  cyMockGraphQL(cy, "loginGoogle", {
    loginGoogle: {
      name: "Kayla",
      email: "kayla@opentutor.com"
    },
  })
  cy.route("**/config", { GOOGLE_CLIENT_ID: "test" });
  cy.setCookie("accessToken", "accessToken");
}