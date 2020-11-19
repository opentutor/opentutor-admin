export function cySetup(cy) {
  cy.server();
  cy.viewport(1280, 720);
}

export function cyMockGraphQL(cy, query, data) {
  cy.route2(
    {
      method: "POST",
      url: "**/graphql",
    },
    (req) => {
      const g = JSON.parse(req.body);
      const q = g.query.replace(/\s+/g, " ").replace("\n", "").trim();
      if (q.indexOf(`{ ${query}`) !== -1) {
        req.reply({
          body: {
            data: data,
            errors: null,
          },
          headers: {
            "Content-Type": "application/json",
          },
        });
      }
    }
  ).as(query);
}

export interface MockGraphQLQuery {
  (req: any, grapqlBody: any): void;
}

export interface MockGraphQLArgs {
  mocks: MockGraphQLQuery[];
  alias?: string;
}

export function cyMockByQueryName(query: string, data: any): MockGraphQLQuery {
  return (req: any, grapqlBody: any) => {
    const q = grapqlBody.query.replace(/\s+/g, " ").replace("\n", "").trim();
    if (q.indexOf(`{ ${query}`) !== -1) {
      req.reply({
        body: {
          data: data,
          errors: null,
        },
        headers: {
          "Content-Type": "application/json",
        },
      });
      req.alias = query;
    }
  };
}

export function cyMockGraphQL2(cy, args: MockGraphQLArgs): void {
  const r = cy.route2(
    {
      method: "POST",
      url: "**/graphql",
    },
    (req) => {
      const g = JSON.parse(req.body);
      for (const m of args.mocks) {
        m(req, g);
      }
    }
  );
  if (args.alias) {
    r.as(args.alias);
  }
}

export function cyLoginGoogle(cy) {
  cyMockGraphQL(cy, "loginGoogle", {
    loginGoogle: {
      name: "Kayla",
      email: "kayla@opentutor.com",
    },
  });
  cy.route("**/config", { GOOGLE_CLIENT_ID: "test" });
  cy.setCookie("accessToken", "accessToken");
}

export function cyLoginGoogle2(cy): MockGraphQLQuery {
  cy.route("**/config", { GOOGLE_CLIENT_ID: "test" });
  cy.setCookie("accessToken", "accessToken");
  return cyMockByQueryName("loginGoogle", {
    loginGoogle: {
      name: "Kayla",
      email: "kayla@opentutor.com",
    },
  });
}
