function snapname(n) {
  return `screenshots-grade-session-list-${n}`;
}

describe("screenshots - grade session list", () => {
  beforeEach(() => {
    cy.viewport(1280, 720);
  });

  it("displays sessions with 'show graded' disabled by default'", () => {
    cy.server();
    cy.route({
      method: "POST",
      url: "**/graphql",
      status: 200,
      response: {
        data: {
          sessions: {
            edges: [
              {
                cursor: "cursor 1",
                node: {
                  lesson: {
                    name: "lesson 1",
                  },
                  sessionId: "session 1",
                  classifierGrade: 1,
                  graderGrade: 1,
                  createdAt: "1/1/20000, 12:00:00 AM",
                },
              },
              {
                cursor: "cursor 2",
                node: {
                  lesson: {
                    name: "lesson 2",
                  },
                  sessionId: "session 2",
                  classifierGrade: 0.5,
                  graderGrade: null,
                  createdAt: "1/1/20000, 12:00:00 AM",
                },
              },
            ],
            pageInfo: {
              hasNextPage: false,
              endCursor: "cursor 2 ",
            },
          },
        },
        errors: null,
      },
      delay: 10,
      headers: {
        "Content-Type": "application/json",
      },
    }).as("sessionsList");
    cy.visit("/sessions");
    cy.wait("@sessionsList");
    cy.matchImageSnapshot(
      snapname("displays-sessions-show-graded-disabled-default")
    );
  });

  it("displays ungraded sessions when 'show graded' enabled", () => {
    cy.server();
    cy.route({
      method: "POST",
      url: "**/graphql",
      status: 200,
      response: {
        data: {
          sessions: {
            edges: [
              {
                cursor: "cursor 1",
                node: {
                  lesson: {
                    name: "lesson 1",
                  },
                  sessionId: "session 1",
                  classifierGrade: 1,
                  graderGrade: 1,
                  createdAt: "1/1/20000, 12:00:00 AM",
                },
              },
              {
                cursor: "cursor 2",
                node: {
                  lesson: {
                    name: "lesson 2",
                  },
                  sessionId: "session 2",
                  classifierGrade: 0.5,
                  graderGrade: null,
                  createdAt: "1/1/20000, 12:00:00 AM",
                },
              },
            ],
            pageInfo: {
              hasNextPage: false,
              endCursor: "cursor 2 ",
            },
          },
        },
        errors: null,
      },
      delay: 10,
      headers: {
        "Content-Type": "application/json",
      },
    }).as("sessionsList");
    cy.visit("/sessions");
    cy.get("#toggle").check();
    cy.wait("@sessionsList");
    cy.matchImageSnapshot(snapname("displays-sessions-show-graded-enabled"));
  });
});
