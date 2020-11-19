/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import {
  cySetup,
  cyLoginGoogle,
  cyLoginGoogle2,
  cyMockGraphQL,
  cyMockGraphQL2,
  cyMockByQueryName,
  MockGraphQLQuery,
} from "../support/functions";

// function cyMockLessons(cy) {
//   cyMockGraphQL(cy, "lessons", {
//     lessons: {
//       edges: [
//         {
//           cursor: "cursor 1",
//           node: {
//             lessonId: "lesson1",
//             name: "lesson 1",
//             createdByName: "teacher 1",
//             userPermissions: {
//               edit: true,
//               view: true,
//             },
//             updatedAt: "1/1/20000, 12:00:00 AM",
//           },
//         },
//         {
//           cursor: "cursor 2",
//           node: {
//             lessonId: "lesson2",
//             name: "lesson 2",
//             createdByName: "teacher 2",
//             userPermissions: {
//               edit: true,
//               view: true,
//             },
//             updatedAt: "1/1/20000, 12:00:00 AM",
//           },
//         },
//       ],
//       pageInfo: {
//         hasNextPage: false,
//         endCursor: "cursor 2",
//       },
//     },
//   });
// }

function cyMockLessons2(): MockGraphQLQuery {
  return cyMockByQueryName("lessons", {
    lessons: {
      edges: [
        {
          cursor: "cursor 1",
          node: {
            lessonId: "lesson1",
            name: "lesson 1",
            createdByName: "teacher 1",
            userPermissions: {
              edit: true,
              view: true,
            },
            updatedAt: "1/1/20000, 12:00:00 AM",
          },
        },
        {
          cursor: "cursor 2",
          node: {
            lessonId: "lesson2",
            name: "lesson 2",
            createdByName: "teacher 2",
            userPermissions: {
              edit: true,
              view: true,
            },
            updatedAt: "1/1/20000, 12:00:00 AM",
          },
        },
      ],
      pageInfo: {
        hasNextPage: false,
        endCursor: "cursor 2",
      },
    },
  });
}

describe("lessons screen", () => {
  it("displays lesson table with headers", () => {
    cySetup(cy);
    // cyLoginGoogle(cy);
    // cyMockLessons(cy);
    cyMockGraphQL2(cy, {
      mocks: [cyLoginGoogle2(cy), cyMockLessons2()],
    });
    cy.visit("/lessons");
    cy.wait("@loginGoogle");
    cy.wait("@lessons");
    cy.get("#column-header");
    cy.get("#column-header #name").contains("Lesson");
    cy.get("#column-header #launch").contains("Launch");
    cy.get("#column-header #grade").contains("Grade");
    cy.get("#column-header #updatedAt").contains("Date");
    cy.get("#column-header #createdByName").contains("Created By");
    cy.get("#column-header #delete").contains("Delete");
  });

  it("displays a list of lessons", () => {
    cySetup(cy);
    // cyLoginGoogle(cy);
    // cyMockLessons(cy);
    cyMockGraphQL2(cy, {
      mocks: [cyLoginGoogle2(cy), cyMockLessons2()],
    });
    cy.visit("/lessons");
    cy.wait("@loginGoogle");
    cy.wait("@lessons");
    cy.get("#lessons").children().should("have.length", 2);
    cy.get("#lesson-0 #name").contains("lesson 1");
    cy.get("#lesson-0 #launch button").should("not.be.disabled");
    cy.get("#lesson-0 #grade button").should("not.be.disabled");
    cy.get("#lesson-0 #date").contains("1/1/20000, 12:00:00 AM");
    cy.get("#lesson-0 #creator").contains("teacher 1");
    cy.get("#lesson-0 #delete button").should("not.be.disabled");
    cy.get("#lesson-1 #name").contains("lesson 2");
    cy.get("#lesson-1 #launch button").should("not.be.disabled");
    cy.get("#lesson-1 #grade button").should("not.be.disabled");
    cy.get("#lesson-1 #date").contains("1/1/20000, 12:00:00 AM");
    cy.get("#lesson-1 #creator").contains("teacher 2");
    cy.get("#lesson-1 #delete button").should("not.be.disabled");
  });

  it("opens edit for a lesson", () => {
    cySetup(cy);
    // cyLoginGoogle(cy);
    // cyMockLessons(cy);
    cyMockGraphQL2(cy, {
      mocks: [cyLoginGoogle2(cy), cyMockLessons2()],
    });
    cy.visit("/lessons");
    cy.wait("@loginGoogle");
    cy.wait("@lessons");
    cy.get("#lesson-0 #name a").trigger("mouseover").click();
    cy.location("pathname").should("contain", "/lessons/edit");
    cy.location("search").should("eq", "?lessonId=lesson1");
  });

  it("opens grade for a lesson", () => {
    cySetup(cy);
    // cyLoginGoogle(cy);
    // cyMockLessons(cy);
    cyMockGraphQL2(cy, {
      mocks: [cyLoginGoogle2(cy), cyMockLessons2()],
    });
    cy.visit("/lessons");
    cy.wait("@loginGoogle");
    cy.wait("@lessons");
    cy.get("#lesson-0 #grade").trigger("mouseover").click();
    cy.location("pathname").should("contain", "/sessions");
    cy.location("search").should("eq", "?lessonId=lesson1");
  });

  it("launches a lesson", () => {
    cySetup(cy);
    // cyLoginGoogle(cy);
    // cyMockLessons(cy);
    cyMockGraphQL2(cy, {
      mocks: [cyLoginGoogle2(cy), cyMockLessons2()],
    });
    cy.visit("/lessons");
    cy.wait("@loginGoogle");
    cy.wait("@lessons");
    cy.get("#lesson-0 #launch button").trigger("mouseover").click();
    cy.location("pathname").should("contain", "/tutor");
    cy.location("search").should("contain", "lesson=lesson1");
    cy.location("search").should("contain", "guest=Kayla");
    cy.location("search").should("contain", "admin=true");
  });

  it("clicks on create lesson and opens to an edit page for new lesson", () => {
    cySetup(cy);
    // cyLoginGoogle(cy);
    // cyMockLessons(cy);
    cyMockGraphQL2(cy, {
      mocks: [cyLoginGoogle2(cy), cyMockLessons2()],
    });
    cy.visit("/lessons");
    cy.wait("@loginGoogle");
    cy.wait("@lessons");
    cy.get("#create-button").trigger("mouseover").click();
    cy.location("pathname").should("contain", "/lessons/edit");
  });

  it("disables edit, grade, and delete if user does not have edit permissions", () => {
    cySetup(cy);
    // cyLoginGoogle(cy);
    // cyMockGraphQL(cy, "lessons", {
    //   lessons: {
    //     edges: [
    //       {
    //         cursor: "cursor 1",
    //         node: {
    //           lessonId: "lesson1",
    //           name: "lesson 1",
    //           updatedAt: "1/1/20000, 12:00:00 AM",
    //           createdByName: "teacher 1",
    //           userPermissions: {
    //             edit: false,
    //             view: true,
    //           },
    //         },
    //       },
    //     ],
    //     pageInfo: {
    //       hasNextPage: false,
    //       endCursor: "cursor 2",
    //     },
    //   },
    // });
    cyMockGraphQL2(cy, {
      mocks: [
        cyLoginGoogle2(cy),
        cyMockByQueryName("lessons", {
          lessons: {
            edges: [
              {
                cursor: "cursor 1",
                node: {
                  lessonId: "lesson1",
                  name: "lesson 1",
                  updatedAt: "1/1/20000, 12:00:00 AM",
                  createdByName: "teacher 1",
                  userPermissions: {
                    edit: false,
                    view: true,
                  },
                },
              },
            ],
            pageInfo: {
              hasNextPage: false,
              endCursor: "cursor 2",
            },
          },
        }),
      ],
    });
    cy.visit("/lessons");
    cy.wait("@loginGoogle");
    cy.wait("@lessons");
    cy.get("#lesson-0 #delete button").should("be.disabled");
    cy.get("#lesson-0 #grade button").should("be.disabled");
    cy.get("#lesson-0 #name").should("not.have.class", "a");
  });
});
