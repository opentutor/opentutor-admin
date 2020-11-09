/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
// function snapname(n) {
//   return `screenshots-lesson-edit-${n}`;
// }

// describe("screenshots - lesson edit", () => {
//   beforeEach(() => {
//     cy.viewport(1280, 720);
//   });

//   it("displays lesson form on load", () => {
//     cy.server();
//     cy.route({
//       method: "POST",
//       url: "**/graphql",
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
//                 features: {},
//               },
//             ],
//             features: {},
//             lastTrainedAt: "",
//             isTrainable: true,
//           },
//         },
//         errors: null,
//       },
//       headers: {
//         "Content-Type": "application/json",
//       },
//     }).as("getLesson");
//     cy.visit("/lessons/edit?lessonId=lesson");
//     cy.wait("@getLesson");
//     cy.matchImageSnapshot(snapname("displays-lesson-form-on-load"));
//   });

//   it("displays save button enabled after edits", () => {
//     cy.server();
//     cy.route({
//       method: "POST",
//       url: "**/graphql",
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
//             lastTrainedAt: "",
//             isTrainable: true,
//           },
//         },
//         errors: null,
//       },
//       headers: {
//         "Content-Type": "application/json",
//       },
//     }).as("getLesson");
//     cy.visit("/lessons/edit?lessonId=lesson");
//     cy.wait("@getLesson");
//     cy.get("#intro").fill("Hello World");
//     cy.matchImageSnapshot(snapname("displays-save-button-enabled-after-edits"));
//   });
// });
