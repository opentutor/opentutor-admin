// describe("visual testing lesson", () => {
//   beforeEach(() => {
//     cy.viewport(2560, 2024);
//   });

//   it("loads existing lesson edit page", () => {
//     cy.server();
//     cy.route({
//       method: "POST",
//       url: "**/grading-api/graphql",
//       status: 200,
//       response: {
//         data: {
//           lesson: {
//             lessonId: "lesson",
//             name: "lesson",
//             intro: "intro",
//             question: "question",
//             conclusion: ["conclusion"],
//             expectations: [
//               {
//                 expectation: "expectation 1",
//                 hints: [
//                   {
//                     text: "hint 1.1",
//                   },
//                 ],
//               },
//             ],
//           },
//         },
//         errors: null,
//       },
//       delay: 10,
//       headers: {
//         "Content-Type": "application/json",
//       },
//     }).as("getLesson");
//     cy.visit("/lessons/edit?lessonId=lesson");

//     cy.wait("@getLesson");
//     cy.matchImageSnapshot();
//   });

//   it("save button appears after a change", () => {
//     cy.server();
//     cy.route({
//       method: "POST",
//       url: "**/grading-api/graphql",
//       status: 200,
//       response: {
//         data: {
//           lesson: {
//             lessonId: "lesson",
//             name: "lesson",
//             question: "question",
//             intro: "intro",
//             conclusion: ["conclusion"],
//             expectations: [
//               {
//                 expectation: "expectation 1",
//                 hints: [
//                   {
//                     text: "hint 1.1",
//                   },
//                 ],
//               },
//             ],
//           },
//         },
//         errors: null,
//       },
//       delay: 10,
//       headers: {
//         "Content-Type": "application/json",
//       },
//     }).as("getLesson");
//     cy.visit("/lessons/edit?lessonId=lesson");
//     cy.wait("@getLesson");
//     cy.get("#intro").type("Hello World");
//     cy.matchImageSnapshot();
//   });

//   it("loads list of lessons", () => {
//     cy.server();
//     cy.route({
//       method: "POST",
//       url: "**/grading-api/graphql",
//       status: 200,
//       response: {
//         data: {
//           lessons: {
//             edges: [
//               {
//                 cursor: "cursor 1",
//                 node: {
//                   lessonId: "lesson1",
//                   name: "lesson 1",
//                   updatedAt: "0",
//                 },
//               },
//               {
//                 cursor: "cursor 2",
//                 node: {
//                   lessonId: "lesson2",
//                   name: "lesson 2",
//                   updatedAt: "1",
//                 },
//               },
//             ],
//             pageInfo: {
//               hasNextPage: false,
//               endCursor: "cursor 2 ",
//             },
//           },
//         },
//         errors: null,
//       },
//       delay: 10,
//       headers: {
//         "Content-Type": "application/json",
//       },
//     }).as("lessonsList");
//     cy.visit("/lessons");
//     cy.wait("@lessonsList");
//     cy.matchImageSnapshot();
//   });
// });
