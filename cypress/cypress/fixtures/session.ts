/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/

export const session = {
  username: "username1",
  sessionId: "session1",
  createdAt: "1/1/2001",
  lesson: {
    name: "lesson 1",
  },
  graderGrade: null,
  question: {
    text: "question?",
    expectations: [
      { expectationId: "0", text: "expected text 1" },
      { expectationId: "1", text: "expected text 2" },
    ],
  },
  userResponses: [
    {
      text: "answer 1",
      expectationScores: [
        {
          expectationId: "0",
          classifierGrade: "Good",
          graderGrade: "",
        },
        {
          expectationId: "1",
          classifierGrade: "Bad",
          graderGrade: "",
        },
      ],
    },
    {
      text: "answer 2",
      expectationScores: [
        {
          expectationId: "0",
          classifierGrade: "Bad",
          graderGrade: "",
        },
        {
          expectationId: "1",
          classifierGrade: "Good",
          graderGrade: "",
        },
      ],
    },
  ],
};

export const sessions = {
  edges: [
    {
      cursor: "cursor 1",
      node: {
        lesson: {
          lessonId: "lesson1",
          name: "lesson 1",
        },
        lessonCreatedBy: "teacher 1",
        sessionId: "session1",
        classifierGrade: 1,
        graderGrade: 1,
        createdAt: "1/1/20000, 12:00:00 AM",
        username: "user 1",
        lastGradedByName: "Grader",
        lastGradedAt: "1/2/20000, 12:00:00 AM",
      },
    },
    {
      cursor: "cursor 2",
      node: {
        lesson: {
          lessonId: "lesson2",
          name: "lesson 2",
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
};
