/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
function snapname(n) {
  return `screenshots-lesson-list-${n}`;
}

describe("screenshots - lesson list", () => {
  beforeEach(() => {
    cy.viewport(1280, 720);
  });

  it("displays a list of lessons", () => {
    cy.server();
    cy.route({
      method: "POST",
      url: "**/graphql",
      status: 200,
      response: {
        data: {
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
        },
        errors: null,
      },
      headers: {
        "Content-Type": "application/json",
      },
    }).as("lessonsList");
    cy.visit("/lessons");
    cy.wait("@lessonsList");
    cy.matchImageSnapshot(snapname("displays-a-list-of-lessons"));
  });
});
