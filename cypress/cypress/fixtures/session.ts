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
      { text: "expected text 1" },
      { text: "expected text 2" },
    ],
  },
  userResponses: [
    {
      text: "answer 1",
      expectationScores: [
        {
          classifierGrade: "Good",
          graderGrade: "",
        },
        {
          classifierGrade: "Bad",
          graderGrade: "",
        },
      ],
    },
    {
      text: "answer 2",
      expectationScores: [
        {
          classifierGrade: "Bad",
          graderGrade: "",
        },
        {
          classifierGrade: "Good",
          graderGrade: "",
        },
      ],
    },
  ],
}

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
}