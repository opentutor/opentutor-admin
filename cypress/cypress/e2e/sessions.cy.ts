/*
This software is Copyright ©️ 2024 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import { lesson, lessons } from "../fixtures/lesson";
import { sessions, session, filterSessionsByLesson } from "../fixtures/session";
import { sessions1 } from "../fixtures/sessions1";
import { sessions2 } from "../fixtures/sessions2";
import {
  cySetup,
  cyMockDefault,
  mockGQL,
  cyMockModelStatus,
} from "../support/functions";

describe("sessions screen", () => {
  describe("permissions", () => {
    it("cannot view sessions list if not logged in", () => {
      cySetup(cy);
      cy.visit("/sessions");
      cy.contains("Please login to view sessions.");
    });

    it("disables edit and grade if user does not have edit permissions", () => {
      cySetup(cy);
      cyMockDefault(cy, {
        gqlQueries: [mockGQL("FetchSessions", { me: { sessions } })],
      });
      cy.visit("/sessions");
      cy.get("[data-cy=session-0]")
        .find("[data-cy=grade-button]")
        .should("be.disabled");
      cy.get("[data-cy=session-1]")
        .find("[data-cy=grade-button]")
        .should("be.disabled");
    });

    it("enables edit if user is admin", () => {
      cySetup(cy);
      cyMockDefault(cy, {
        gqlQueries: [mockGQL("FetchSessions", { me: { sessions } })],
        userRole: "admin",
      });
      cy.visit("/sessions");
      cy.get("[data-cy=session-0]")
        .find("[data-cy=grade-button]")
        .should("not.be.disabled");
      cy.get("[data-cy=session-1]")
        .find("[data-cy=grade-button]")
        .should("not.be.disabled");
    });

    it("enables edit if user is contentManager", () => {
      cySetup(cy);
      cyMockDefault(cy, {
        gqlQueries: [mockGQL("FetchSessions", { me: { sessions } })],
        userRole: "contentManager",
      });
      cy.visit("/sessions");
      cy.wait("@Login");
      cy.wait("@FetchSessions");
      cy.get("[data-cy=session-0]")
        .find("[data-cy=grade-button]")
        .should("not.be.disabled");
      cy.get("[data-cy=session-1]")
        .find("[data-cy=grade-button]")
        .should("not.be.disabled");
    });

    it("enables edit if user created lesson", () => {
      cySetup(cy);
      cyMockDefault(cy, {
        gqlQueries: [
          mockGQL("FetchSessions", {
            me: {
              sessions: {
                edges: [
                  {
                    cursor: "cursor 1",
                    node: {
                      lesson: {
                        lessonId: "lesson1",
                        name: "lesson 1",
                        createdBy: "kayla",
                      },
                      lessonCreatedBy: "teacher 1",
                      sessionId: "session1",
                      classifierGrade: 1,
                      graderGrade: 1,
                      createdAt: "1/1/20000, 12:00:00 AM",
                      username: "user 1",
                    },
                  },
                  {
                    cursor: "cursor 2",
                    node: {
                      lesson: {
                        lessonId: "lesson2",
                        name: "lesson 2",
                        createdBy: "kayla",
                      },
                      lessonCreatedBy: "teacher 2",
                      sessionId: "session2",
                      classifierGrade: 0.5,
                      graderGrade: null,
                      createdAt: "1/1/20000, 12:00:00 AM",
                      username: "user 2",
                    },
                  },
                ],
                pageInfo: {
                  hasNextPage: false,
                  endCursor: "cursor 2 ",
                },
              },
            },
          }),
        ],
      });
      cy.visit("/sessions");
      cy.get("[data-cy=session-0]")
        .find("[data-cy=grade-button]")
        .should("not.be.disabled");
      cy.get("[data-cy=session-1]")
        .find("[data-cy=grade-button]")
        .should("not.be.disabled");
    });
  });

  it("displays session table with headers", () => {
    cySetup(cy);
    cyMockDefault(cy, {
      gqlQueries: [mockGQL("FetchSessions", { me: { sessions } })],
      userRole: "admin",
    });
    cy.visit("/sessions");
    cy.get("[data-cy=column-header]");
    cy.get("[data-cy=column-header]")
      .find("[data-cy=lessonName]")
      .contains("Lesson");
    cy.get("[data-cy=column-header]")
      .find("[data-cy=graderGrade]")
      .contains("Instructor Grade");
    cy.get("[data-cy=column-header]")
      .find("[data-cy=classifierGrade]")
      .contains("Classifier Grade");
    cy.get("[data-cy=column-header]")
      .find("[data-cy=lastGradedAt]")
      .contains("Last Graded At");
    cy.get("[data-cy=column-header]")
      .find("[data-cy=username]")
      .contains("Username");
    cy.get("[data-cy=column-header]")
      .find("[data-cy=lessonCreatedBy]")
      .contains("Created By");
    cy.get("[data-cy=column-header]")
      .find("[data-cy=username]")
      .contains("Username");
  });

  it("test next page button remains in state after grading", () => {
    cySetup(cy);
    cyMockDefault(cy, {
      gqlQueries: [mockGQL("FetchSessions", { me: { sessions: sessions1 } })],
      userRole: "admin",
    });
    cy.visit("/sessions");
    cy.get("[data-cy=sessions]").children().should("have.length", 50);
    cyMockDefault(cy, {
      gqlQueries: [mockGQL("FetchSessions", { me: { sessions: sessions2 } })],
      userRole: "admin",
    });
    cy.get("[data-cy=next-page]").trigger("mouseover").click();
    cy.get("[data-cy=sessions]").children().should("have.length", 50);
    cyMockDefault(cy, {
      gqlQueries: [mockGQL("FetchSession", { me: { session: session } })],
      userRole: "admin",
    });
    cy.get("[data-cy=session-1]")
      .find("[data-cy=grade-button]")
      .trigger("mouseover")
      .click();
    cy.wait(4000);
    cy.get("[data-cy=title]").contains("Grade Session");
    cy.get("[data-cy=doneButton").trigger("mouseover").click();
    cyMockDefault(cy, {
      gqlQueries: [mockGQL("FetchSessions", { me: { sessions: sessions2 } })],
      userRole: "admin",
    });
    cy.wait(4000);
    cy.location().should((loc) => {
      expect(loc.search).to.include("cursor");
    });
  });

  it("test cursor does not get sent on first page of sessions", () => {
    cySetup(cy);
    cyMockDefault(cy, {
      gqlQueries: [mockGQL("FetchSessions", { me: { sessions: sessions1 } })],
      userRole: "admin",
    });
    cy.visit("/sessions");
    cy.get("[data-cy=sessions]").children().should("have.length", 50);
    cyMockDefault(cy, {
      gqlQueries: [mockGQL("FetchSession", { me: { session: session } })],
      userRole: "admin",
    });
    cy.get("[data-cy=session-1]")
      .find("[data-cy=grade-button]")
      .trigger("mouseover")
      .click();
    cy.wait(4000);
    cy.get("[data-cy=title]").contains("Grade Session");
    cy.get("[data-cy=doneButton").trigger("mouseover").click();
    cyMockDefault(cy, {
      gqlQueries: [mockGQL("FetchSessions", { me: { sessions: sessions1 } })],
      userRole: "admin",
    });
    cy.wait(4000);
    cy.location().should((loc) => {
      expect(loc.search).to.not.include("cursor");
    });
  });

  it("displays a list of sessions", () => {
    cySetup(cy);
    cyMockDefault(cy, {
      gqlQueries: [mockGQL("FetchSessions", { me: { sessions } })],
      userRole: "admin",
    });
    cy.visit("/sessions");
    cy.get("[data-cy=sessions]").children().should("have.length", 2);
    cy.get("[data-cy=session-0]").find("[data-cy=lesson]").contains("lesson 1");
    cy.get("[data-cy=session-0]")
      .find("[data-cy=instructor-grade]")
      .contains("100");
    cy.get("[data-cy=session-0]")
      .find("[data-cy=classifier-grade]")
      .contains("100");
    cy.get("[data-cy=session-0]")
      .find("[data-cy=date]")
      .contains("1/1/20000, 12:00:00 AM");
    cy.get("[data-cy=session-0]")
      .find("[data-cy=creator]")
      .contains("teacher 1");
    cy.get("[data-cy=session-0]").find("[data-cy=username]").contains("user 1");
    cy.get("[data-cy=session-0]")
      .find("[data-cy=last-graded-at]")
      .contains("1/2/20000, 12:00:00 AM");
    cy.get("[data-cy=session-1]").find("[data-cy=lesson]").contains("lesson 2");
    cy.get("[data-cy=session-1]")
      .find("[data-cy=instructor-grade]")
      .contains("N/A");
    cy.get("[data-cy=session-1]")
      .find("[data-cy=classifier-grade]")
      .contains("50");
    cy.get("[data-cy=session-1]")
      .find("[data-cy=creator]")
      .contains("teacher 2");
    cy.get("[data-cy=session-1]").find("[data-cy=username]").contains("user 2");
    // Tooltips
    cy.get("[data-cy=session-0]")
      .find("[data-cy=grade-button]")
      .trigger("mouseover");
    cy.contains("Grade");
  });

  it("opens edit for a session", () => {
    cySetup(cy);
    cyMockDefault(cy, {
      gqlQueries: [mockGQL("FetchSessions", { me: { sessions } })],
      userRole: "admin",
    });
    cy.visit("/sessions");
    cy.get("[data-cy=session-0]")
      .find("[data-cy=lesson]")
      .find("[data-cy=lesson-link]")
      .trigger("mouseover")
      .click();
    cy.location("pathname").should("contain", "/lessons/edit");
    cy.location("search").should("contain", "?lessonId=lesson1");
  });

  it("opens grade for a session", () => {
    cySetup(cy);
    cyMockDefault(cy, {
      gqlQueries: [mockGQL("FetchSessions", { me: { sessions } })],
      userRole: "admin",
    });
    cy.visit("/sessions");
    cy.get("[data-cy=session-0]")
      .find("[data-cy=grade-button]")
      .trigger("mouseover")
      .click();
    cy.location("pathname").should("contain", "/sessions/session");
    cy.location("search").should("contain", "?sessionId=session1");
  });

  it("displays an option to view already graded sessions", () => {
    cySetup(cy);
    cyMockDefault(cy, {
      gqlQueries: [mockGQL("FetchSessions", { me: { sessions } })],
      userRole: "admin",
    });
    cy.visit("/sessions");
    cy.get("[data-cy=toggle-graded]").should("not.be.checked");
    cy.get("[data-cy=toggle-graded]").trigger("mouseover").click();
  });

  it("context cursor is set to next cursor when next page is clicked", () => {
    cySetup(cy);
    cyMockDefault(cy, {
      gqlQueries: [
        mockGQL("FetchSessions", { me: { sessions: sessions1 } }),
        mockGQL("FetchSession", { me: { session: session } }),
        mockGQL("FetchLessons", { me: { lessons } }),
      ],
      userRole: "admin",
    });
    cy.visit("/sessions");
    cy.wait("@FetchSessions");
    cy.get("[data-cy=next-page]").trigger("mouseover").click();
    cy.wait("@FetchSessions");
    cy.get("[data-cy=sessions]").children().should("have.length", 50);
    // click grade, then done
    cy.get("[data-cy=session-0]")
      .find("[data-cy=grade-button]")
      .trigger("mouseover")
      .click();
    cy.get("[data-cy=doneButton]").trigger("mouseover").click();
    cy.wait("@FetchSessions").then((interception) => {
      expect(interception.request.body.variables.cursor).to.contain(
        "next__W3siJGRhdGUiO"
      ); // partial cursor
    });
    cy.get("[data-cy=sessions]").children().should("have.length", 50);
  });
});

describe("filtering", () => {
  it("can filter sessions by lesson", () => {
    cySetup(cy);
    cyMockDefault(cy, {
      gqlQueries: [
        mockGQL("FetchSessions", [
          {
            me: { sessions: sessions1 },
          },
        ]),
        mockGQL("FetchLessons", [{ me: { lessons: lessons } }]),
      ],
      userRole: "admin",
    });
    cy.visit("/sessions");
    cy.wait("@FetchSessions");
    cy.get("[data-cy=sessions]").children().should("have.length", 50);
    cyMockDefault(cy, {
      gqlQueries: [
        mockGQL("FetchSessions", [
          {
            me: {
              sessions: filterSessionsByLesson(
                sessions1,
                "86c5e117-464b-4deb-b5f2-2b441bcf98ee"
              ),
            },
          },
        ]),
      ],
      userRole: "admin",
    });
    cy.get("[data-cy=lesson-filter]").trigger("mouseover").click();
    cy.get("[data-cy=lesson-filter]").type("lesson 1");
    cy.get("[data-cy=lesson-filter]").type("{uparrow}{enter}");
    cy.wait("@FetchSessions").then((interception) => {
      expect(interception.request.body.variables.filter).to.include("lesson1");
      expect(interception.request.body.variables.filter).to.include("lessonId");
    });
    cy.get("[data-cy=sessions]").children().should("have.length", 1);
    cy.get("[data-cy=session-0]")
      .find("[data-cy=lesson]")
      .contains("Lesson Name 1");
  });

  it("selecting grade from lessons page filters sessions page and fills in lesson filter", () => {
    cySetup(cy);
    cyMockDefault(cy, {
      gqlQueries: [
        mockGQL("FetchSessions", {
          me: {
            sessions: filterSessionsByLesson(
              sessions1,
              "86c5e117-464b-4deb-b5f2-2b441bcf98ee"
            ),
          },
        }),
        mockGQL("FetchLessons", { me: { lessons } }),
      ],
      userRole: "admin",
    });
    cy.visit("/lessons");
    cy.get("[data-cy=lesson-0]")
      .find("[data-cy=grade-button]")
      .trigger("mouseover")
      .click();
    cy.get("[data-cy=sessions]").children().should("have.length", 1);
    cy.get("[data-cy=session-0]")
      .find("[data-cy=lesson]")
      .contains("Lesson Name 1");
    cy.get("[data-cy=lesson-filter]").within(() => {
      cy.get("input").should("have.value", "lesson 1");
    });
  });

  it("selecting grade from edit lesson page filters sessions page and fills in lesson filter", () => {
    cySetup(cy);
    cyMockModelStatus(cy);
    cyMockDefault(cy, {
      gqlQueries: [
        mockGQL("FetchLesson", {
          me: {
            lesson: {
              ...lesson,
              lessonId: "lesson1",
            },
          },
        }),
        mockGQL("FetchSessions", {
          me: {
            sessions: filterSessionsByLesson(
              sessions1,
              "86c5e117-464b-4deb-b5f2-2b441bcf98ee"
            ),
          },
        }),
        mockGQL("FetchLessons", { me: { lessons } }),
      ],
      userRole: "admin",
    });
    cy.visit("/lessons/edit?lessonId=lesson1");
    cy.get("[data-cy=grade-button]").should("be.enabled");
    cy.get("[data-cy=grade-button]").trigger("mouseover").click();
    cy.get("[data-cy=sessions]").children().should("have.length", 1);
    cy.get("[data-cy=session-0]")
      .find("[data-cy=lesson]")
      .contains("Lesson Name 1");
    cy.get("[data-cy=lesson-filter]").within(() => {
      cy.get("input").should("have.value", "lesson 1");
    });
  });

  it("can filter sessions by username", () => {
    cySetup(cy);
    cyMockDefault(cy, {
      gqlQueries: [
        mockGQL("FetchSessions", [
          {
            me: { sessions: sessions1 },
          },
        ]),
        mockGQL("FetchLessons", [{ me: { lessons: lessons } }]),
      ],
      userRole: "admin",
    });
    cy.visit("/sessions");
    cy.wait("@FetchSessions");
    cy.get("[data-cy=sessions]").children().should("have.length", 50);
    cyMockDefault(cy, {
      gqlQueries: [
        mockGQL("FetchSessions", [
          {
            me: {
              sessions: filterSessionsByLesson(
                sessions1,
                "86c5e117-464b-4deb-b5f2-2b441bcf98ee"
              ),
            },
          },
        ]),
      ],
      userRole: "admin",
    });
    cy.get("[data-cy=username-filter]").trigger("mouseover").click();
    cy.get("[data-cy=username-filter]").type("Author");
    cy.get("[data-cy=username-filter]").type("{uparrow}{enter}");
    cy.wait("@FetchSessions").then((interception) => {
      expect(interception.request.body.variables.filter).to.include("Author");
      expect(interception.request.body.variables.filter).to.include("username");
    });
    cy.get("[data-cy=sessions]").children().should("have.length", 1);
    cy.get("[data-cy=session-0]")
      .find("[data-cy=lesson]")
      .contains("Lesson Name 1");
  });
});
