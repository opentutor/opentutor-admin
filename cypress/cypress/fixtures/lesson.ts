/*
This software is Copyright ©️ 2024 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
export const lesson = {
  lessonId: "q1",
  name: "lesson",
  intro: "introduction",
  question: "question",
  media: null,
  learningFormat: null,
  conclusion: ["conclusion"],
  expectations: [
    {
      expectation: "expectation 1",
      expectationId: "0",
      hints: [
        {
          text: "hint 1.1",
        },
      ],
      features: {
        bad: ["bad1", "bad2"],
      },
    },
  ],
  createdBy: "opentutor",
  createdByName: "OpenTutor",
};

export const videoLesson = {
  lessonId: "q1",
  name: "lesson",
  intro: "introduction",
  question: "question",
  learningFormat: null,
  media: {
    url: "https://youtube.come/?w=apple",
    type: "video",
    props: [
      { name: "start", value: "0" },
      { name: "end", value: "100" },
    ],
  },
  conclusion: ["conclusion"],
  expectations: [
    {
      expectation: "expectation 1",
      expectationId: "1",
      hints: [
        {
          text: "hint 1.1",
        },
      ],
      features: {
        bad: ["bad1", "bad2"],
      },
    },
  ],
  createdBy: "opentutor",
  createdByName: "OpenTutor",
};

export const lessons = {
  edges: [
    {
      cursor: "cursor 1",
      node: {
        lessonId: "lesson1",
        name: "lesson 1",
        createdByName: "teacher 1",
        updatedAt: "1/1/20000, 12:00:00 AM",
      },
    },
    {
      cursor: "cursor 2",
      node: {
        lessonId: "lesson2",
        name: "lesson 2",
        createdByName: "teacher 2",
        updatedAt: "1/1/20000, 12:00:00 AM",
      },
    },
  ],
  pageInfo: {
    hasNextPage: false,
    endCursor: "cursor 2",
  },
};
