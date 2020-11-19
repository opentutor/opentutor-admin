/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import { cySetup, cyLoginGoogle, cyMockGraphQL, cyMockByQueryName } from "../support/functions";

function snapname(n) {
  return `screenshots-lesson-list-${n}`;
}

describe("screenshots - lesson list", () => {
  it("displays a list of lessons", () => {
    cySetup(cy);
    cyMockGraphQL(cy, {
      mocks: [cyLoginGoogle(cy), cyMockByQueryName("lessons", {
        lessons: {
          edges: [
            {
              cursor: "cursor 1",
              node: {
                lessonId: "lesson1",
                name: "lesson 1",
                updatedAt: "1/1/20000, 12:00:00 AM",
              },
            },
            {
              cursor: "cursor 2",
              node: {
                lessonId: "lesson2",
                name: "lesson 2",
                updatedAt: "1/1/20000, 12:00:00 AM",
              },
            },
          ],
          pageInfo: {
            hasNextPage: false,
            endCursor: "cursor 2 ",
          },
        },
      })],
    });
    cy.visit("/lessons");
    cy.wait("@loginGoogle");
    cy.wait("@lessons");
    cy.matchImageSnapshot(snapname("displays-a-list-of-lessons"));
  });
});
