export function cySetup(cy) {
  cy.server();
  cy.viewport(1280, 720);
}

export interface MockGraphQLQuery {
  (req: any, grapqlBody: any): void;
}

export interface MockGraphQLArgs {
  mocks: MockGraphQLQuery[];
  alias?: string;
}


// can't find way to import Cypress's StaticResponse interface
// so just define it  here
export interface StaticResponse {
  /**
   * Serve a fixture as the response body.
   */
  fixture?: string;
  /**
   * Serve a static string/JSON object as the response body.
   */
  body?: string | object | object[];
  /**
   * HTTP headers to accompany the response.
   * @default {}
   */
  headers?: { [key: string]: string };
  /**
   * The HTTP status code to send.
   * @default 200
   */
  statusCode?: number;
  /**
   * If 'forceNetworkError' is truthy, Cypress will destroy the browser connection
   * and send no response. Useful for simulating a server that is not reachable.
   * Must not be set in combination with other options.
   */
  forceNetworkError?: boolean;
  /**
   * Milliseconds to delay before the response is sent.
   */
  delayMs?: number;
  /**
   * Kilobits per second to send 'body'.
   */
  throttleKbps?: number;
}

/**
 * Maybe cypress will fix in future release,
 * but as of 6.0, most `cy.intercept` calls
 * will trigger an abort because no default CORS headers
 */
export function staticResponse(s: StaticResponse): StaticResponse {
  return {
    ...{
      headers: {
        "access-control-allow-origin": window.location.origin,
        "Access-Control-Allow-Credentials": "true",
      },
      ...s,
    },
  };
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

export function cyMockGraphQL(cy, args: MockGraphQLArgs): void {
  const r = cy.intercept(
    {
      method: "POST",
      url: "**/graphql",
    },
    (req) => {
      const g = req.body;
      for (const m of args.mocks) {
        m(req, g);
      }
    }
  );
  if (args.alias) {
    r.as(args.alias);
  }
}

export function cyLogin(cy, userRole = "author"): MockGraphQLQuery {
  cy.intercept("**/config", { GOOGLE_CLIENT_ID: "test" });
  cy.setCookie("accessToken", "accessToken");
  return cyMockByQueryName("login", {
    login: {
      user: {
        id: "kayla",
        name: "Kayla",
        email: "kayla@opentutor.com",
        userRole
      },
      accessToken: 'accessToken'
    },
  });
}
