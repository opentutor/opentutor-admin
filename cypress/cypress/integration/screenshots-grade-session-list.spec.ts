/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import {
  cySetup,
  cyLogin,
  cyMockGraphQL,
  cyMockByQueryName
} from "../support/functions";

function snapname(n) {
  return `screenshots-grade-session-list-${n}`;
}

describe("screenshots - grade session list", () => {
  it("displays sessions with 'show graded' disabled by default'", () => {
    cySetup(cy);
    cyMockGraphQL(cy, {
      mocks: [cyLogin(cy, true), cyMockByQueryName("sessions", {
        me: {
          sessions: {
            edges: [{
              cursor: "cursor 2",
              node: {
                lesson: {
                  name: "lesson 2",
                },
                sessionId: "session 2",
                classifierGrade: 0.5,
                graderGrade: null,
                createdAt: "1/1/2000, 12:00:00 AM",
              },
            },],
            pageInfo: {
              hasNextPage: false,
              endCursor: "cursor 2 ",
            },
          },
        }
      })],
    });
    cy.visit("/sessions");
    cy.wait("@login");
    cy.wait("@sessions");
    cy.matchImageSnapshot(
      snapname("displays-sessions-show-graded-disabled-default")
    );
  });

  it("displays ungraded sessions when 'show graded' enabled", () => {
    cySetup(cy);
    cyMockGraphQL(cy, {
      mocks: [cyLogin(cy, true), cyMockByQueryName("sessions", {
        me: {
          sessions: {
            edges: [{
              cursor: "cursor 1",
              node: {
                lesson: {
                  name: "lesson 1",
                },
                sessionId: "session 1",
                classifierGrade: 1,
                graderGrade: 1,
                createdAt: "1/1/2000, 12:00:00 AM",
              },
            }, {
              cursor: "cursor 2",
              node: {
                lesson: {
                  name: "lesson 2",
                },
                sessionId: "session 2",
                classifierGrade: 0.5,
                graderGrade: null,
                createdAt: "1/1/2000, 12:00:00 AM",
              },
            },],
            pageInfo: {
              hasNextPage: false,
              endCursor: "cursor 2 ",
            },
          },
        }
      })],
    });
    cy.visit("/sessions");
    cy.wait("@login");
    cy.wait("@sessions");
    cy.get("#toggle-graded").check();
    cy.matchImageSnapshot(snapname("displays-sessions-show-graded-enabled"));
  });
});