
export const lesson = {
  lessonId: "q1",
  name: "lesson",
  intro: "introduction",
  question: "question",
  image: null,
  conclusion: ["conclusion"],
  expectations: [
    {
      expectation: "expectation 1",
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
  createdBy: 'opentutor',
  createdByName: 'OpenTutor',
}

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
}