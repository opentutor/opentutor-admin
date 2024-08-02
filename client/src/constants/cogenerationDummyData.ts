/*
This software is Copyright ©️ 2024 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/

import { SelectChangeEvent } from "@mui/material";

export const generatedQuestions = [
  [
    "What is a large language model (LLM) known for?",
    "Achieving general-purpose language understanding and generation",
  ],
  [
    "How do LLMs acquire their abilities?",
    "By learning statistical relationships from text documents during a computationally intensive self-supervised and semi-supervised training process",
  ],
  ["What type of neural networks are LLMs?", "Artificial neural networks"],
];

export type DistractorStrategy =
  | "random"
  | "opposites"
  | "falseAssumption"
  | "baselineAssumption";

interface ConceptPair {
  concept: string;
  hints: string[];
}

export const generatedDistractors: Record<DistractorStrategy, string[]> = {
  random: [
    "By memorizing all possible language patterns",
    "Using reinforcement learning to acquire language abilities",
    "Convolutional neural networks",
  ],
  opposites: [
    "Failing to achieve general-purpose language understanding and generation",
    "Limited in scope language understanding and generation",
    "Struggling to achieve general-purpose language understanding and generation",
  ],
  falseAssumption: [
    "Faster computation speed",
    "Improved image recognition accuracy",
    "Enhanced gaming experience",
  ],
  baselineAssumption: [
    "Generating random text",
    "Translating languages accurately",
    "Recognizing images and videos",
  ],
};

export const distractorPrompt =
  "I will provide you with a question and a list of correct answers.\nYou must use this data to generate 'distractors' - incorrect answers that could be plausibly mistaken for correct answers by a human.\nYou must also generate topics relevant topics to each question answer pair,\nYou must also generate what is misundertood for each distractor in order,\nyou must also generate relevant topics for each question and answer pair,\nYou msut also generate related topics for each distractor in order,\nYou must misconceptions (justifcation of why the user would get the answer wrong, should be very short and concise like 5 words max) for each distractor in order\nAt last, you must generate feedback to the each distractor for the question and answer pair, the feedback must not include the correct answer.\nHere is the question: {question}\nHere is the list of answers: {answers}";
export const distractorSystemPrompt =
  "You are a system assisting a human in coming up with {n_questions} questions, and answers pairs (therefore the question list must be equal to the corrects list) with optional learning objectives for given data.\nYour response must be in JSON.\nFormat your response like this:\n{\n\t'question': [\n\t\t'question_1',\n\t\t'question_2',\n\t\t'question_3'\n\t\t...\n\t]\n}\nPlease only response in JSON. Validate that your response is in JSON. Do not include any JSON markdown, only JSON data.";

export const questionPrompt =
  "You are to look at this data and come up with a question and an answer, and a optional learning objective related to this data.\nHere is the data: {data}";
export const questionSystemPrompt =
  'You are a system assisting a human in coming up with {n_questions} questions, and answers pairs (therefore the question list must be equal to the corrects list) with optional learning objectives for given data.\nYour response must be in JSON.\nFormat your response like this:\n{\n\t"question": [\n\t\t"question_1",\n\t\t"question_2",\n\t\t"question_3"\n\t\t...\n\t]\n}\nPlease only response in JSON. Validate that your response is in JSON. Do not include any JSON markdown, only JSON data.';

export const lessonTitle = "Leading an Impossible Mission";

export const lessonIntro =
  "You take over a mission, but you estimate that it is under-resourced and too far behind schedule to succeed.";

export const lessonObjective =
  "By the end of this lesson, students should be able to understand the concept of mathematical proportionality, identify proportional sequences, and solve problems involving ratios and proportions.";

export const lessonEssentialQuestion =
  "Consider the project management triangle. What options could you suggest to get the mission to a higher quality outcome?";

export const lessonConclusion =
  "If you are leading an impossible mission, check how you can adjust the parameters to succeed. Three ways you can do this are changing the resources, the schedule, or the scope.";

export const lessonConcepts: ConceptPair[] = [
  {
    concept:
      "You can request more resources like crew or materials to catch up.",
    hints: [
      "Can you explain how increasing resources might help in accomplishing a mission that initially seems impossible?",
      "How might you adjust the scope or timeline of a mission to make it more achievable?",
      "What role does communication play in managing an 'impossible' mission?",
    ],
  },
  {
    concept: "You can request to extend the schedule.",
    hints: [
      "Can you think of any situations in the lesson where extending the schedule might be a possible solution?",
      "What is the Project Management Triangle and how does it relate to the concept of extending the schedule?",
      "What steps might you need to take to request an extension?",
    ],
  },
  {
    concept:
      "You can talk to your supervisors about how to reduce or focus the mission scope.",
    hints: [
      "What do you think the Project Management Triangle is trying to tell us about mission constraints?",
      "What should you do next after verifying the risk?",
      "What are some ways you can suggest to relax the mission constraints when talking to your supervisor?",
    ],
  },
];
export const newLessonConcept: ConceptPair = 
  {
    concept: "",
    hints: ["","",""]
  }
export const lessonSystemPrompt =
  "You are a tutor who is designing a lesson on the topic of {topic}. You have been given some content for your students to learn, and you want to design a lesson that will guide students in critically exploring the topic and ultimately being able to express their understanding of underlying key concepts. \n\nUsing this content and an identified lesson planning objective, you are building a lesson that can be formatted according to a provided JSON template.";

export const lessonHumanPrompt =
  "Here is my content for my lesson : {content}\n\nIf I have a partner text, it will be listed here: {partner}\n\nYour lesson should have the following elements: a lesson title, an introduction, a learning objective, an essential question, three key concepts with three hints per key concepts, and a conclusion. \n\nHere is my preferred response format : {format} \n\nOnly respond with valid JSON.";

export const lessonParseSystemPrompt =
  "You are a teacher's aid, and have been tasked with helping to make a lesson. You will use the lesson content that is provided and the directions you receive to build one stage of the lesson. {format";

export const lessonParseHumanPrompt =
  "Can you please identify 1, 2, 3, 4, or 5 key concepts from the following text. The number of key concepts should be the result of a best fit approach for the lesson content. These concepts should be short phrases. Here is the content for the lesson: {content}. {step}";

export const lessonParseSystem2Prompt =
  "You are a teacher's aid and have been tasked with helping to make a lesson. You have just identified 1 to 5 key concepts and are waiting for more directions on what is the next step for the lesson. When you respond, you will want to use the following format: {format}";

export const lessonParseHuman2Prompt =
  "Great! Based on the following key concepts, {step}. Please create a JSON dictionary where the first key is 'concepts' and the value is a sub dictionary with a key 'key_concept_N', and the value of that dictionary is another subdictionary with the following keys: 'concept', 'keywords related to concept', 'concept posed as a question', 'ideal answer based on the text'. As a reminder the content of the lesson is: {content}";

export const lessonTabooSystemPrompt =
  "You are a team of two players, playing a game called 'taboo', and you want to win. In this game you receive a card with a concept on it. Your partner cannot see the card but has to guess the concept on your card based on hints you provide. The rules of the game are simple: on the card you will see the concept as a statement, and a list of 'taboo' keywords. You must ask 10 hint questions that guide your teammate to the concept on the card. You lose the game if any of the following happen: 1. you use a keyword in hint\n 2. you use any word more than three times across all hints'\n 3. any of your questions do not relate to the target concept.";

export const lessonTabooHumanPrompt =
  "The card you drew has the following on it.\nConcept: {concept}\nTaboo Words: {step}\nAs you begin to formulate your questions, you realize that you have prior knowledge on the concept. Some of that prior knowledge could be summarized as the following: {content}\n\n Remember the rules of the game and be mindful to follow the rules as you generate the phrasing of your questions. Try to keep track of words you've used in previous questions so as not to repeat yourself! {format}";

export const lessonSimulationSystemPrompt =
  "You are a socratic teacher and a single student who is being tutored. The teacher just taught a lesson, and the student is trying to understand an important concept from the lesson. The teacher doesn't want to tell the student the concept outright. Rather the teacher want to prompt the student with a variety of different question types that will make the student figure out the answer as a result of the conversation the student and the teacher might have around these questions. \n\n The teacher, Socrates, and the student, Zahra, are going to have a conversation, and record all the questions that Socrates asks. \n\nYour class conversation should run until Socrates has asked 10 questions.";

export const lessonSimulationHumanPrompt =
  "Here is the key concept I want to understand from the lesson: {concept} \n\nSome keywords that might be helpful to keep in mind are: {step}\n\nBased on the lesson I just finished, can you help me understand the concept. \n\nHere is the lesson I just finished: '{content}' {format}";

export const lessonSlotsSystemPrompt =
  "You are a teacher planning a lesson that includes a socratic seminar. You are about to teach a lesson and after you deliver the content you are going to lead a socratic seminar discussion.  You don't want to tell the student the concept outright. Rather you want to prompt the student with a variety of different question types that will make the student figure out the answer as a result of the conversation the student and the teacher might have around these questions. \n\nUse the following question types as a starting point: [[\\'recall\\', [\\'example_1\\', \\'What does the lesson say on the topic of X?\\'], [\\'example_2\\', \\'What is a similar idea to X in the lesson?\\'], [\\'example_3\\', \\'Where does the idea X fit into this concept?\\']], [\\'explanatory\\', [\\'example_1\\', \\'What does it mean in the lesson when it says X?\\'],[\\'example_2\\', \\'How does idea X fit into concept Y?\\'],[\\'example_3\\', \\'When is concept Y influenced by idea X?\\']],[\\'justification\\', [\\'example_1\\', \\'Why is X important to Y?\\'],[\\'example_2\\', \\'Could we demonstrate why X is necessary?\\'],[\\'example_3\\', \\'It could be said that idea X is Y,what do you think about that ? \\\\']],[\\'evaluating\\', [\\'example_1\\', \\'If we removed X, could Y still work?\\'],[\\'example_2\\', \\'Which of the following X,Y,Z has the greatest impact on K?\\'],[\\'example_3\\', \\'How useful is X?\\']],[\\'analyzing\\', [\\'example_1\\', \\'How do ideas X and Y relate to each other?\\'],[\\'example_2\\', \\'Is there an order to these elements; which comes first X or Y?\\'],[\\'example_3\\', \\'When we break down idea X, what are the component pieces?\\']],[\\'predicting\\', [\\'example_1\\', \\'What would happen if we did X?\\'],[\\'example_2\\', \\'How could we get a better result of Y?\\'],[\\'example_3\\', \\'Do you think that Y could work as good as X in this context?\\']], [\\'synthesizing\\', [\\'example_1\\', \\'What are some applications of X?\\'], [\\'example_2\\', \\'Are there other X that might benefit from Y?\\'], [\\'example_3\\', \\'What is the purpose of X?\\']], [\\'connecting\\', [\\'example_1\\', \\'How are ideas X and Y similar?\\'], [\\'example_2\\', \\'Consider how Y (from knowledge outside of the lesson) might be a good example of what we\\\\'re looking at here.\\\\']]]\\n\\nYou must also add new question_types, or examples, or permutations of questions as the conversation progresses.Your class conversation should run until Socrates has asked 10 questions.";

export const lessonSlotsHumanPrompt =
  "Here is the key concept I want to understand from the lesson: {concept} \n\nSome keywords that might be helpful to keep in mind are: {step}\n\nBased on the lesson I just finished, can you help me understand the concept. \n\nHere is the lesson I just finished: '{content}' {format}";

export const lessonGenericSystemPrompt =
  "You are a teacher's aid and have been tasked with helping to make a lesson. You will be given a concept for the lesson and some content for the lesson, you will then generate 10 hints that can be used to help students to learn. Please think step by step.";

export const lessonGenericHumanPrompt =
  "Here is the key concept I want to understand from the lesson: {concept} \n\nSome keywords that might be helpful to keep in mind are: {step}\n\nBased on the lesson I just finished, can you help me understand the concept. \n\nHere is the lesson I just finished: '{content}' {format}";

export const lessonHintFilterSystemPrompt =
  "You are a teacher's aid and have been tasked with helping to make a lesson. You have just generated a pool of possible hints for the following concept {concept} of the lesson and are waiting for more directions on what is the next step for building the lesson. When you respond, you will want to use the following format: {format}";

export const lessonHintFilterHumanPrompt =
  "Please take the following list of hint questions you generated {step} and select three of them as final hints. Select one for each of the following criteria: 1. A broad question that cues the students towards the answer, 2. A question that poses a situation, case or circumstance which demonstrates the concept in some way, 3. A question which is a paraphrase of the ideal answer without blatantly revealing the answer.\n\nIf no hint seems to match a particular criterion, then select the best fit. Once you have selected a hint for one criterion, you may not select it for another criterion. After you have gone through the selection process, be sure to summarize in the following format:\n {format}";

export const lessonHintMockPrompt =
  "Here is the key concept I want to understand from the lesson: 'Shakespeare uses chiastic structure to emphasize the mortality of mankind as expressed in Mercutio's death.'\n\nBased on the lesson I just finished, can you help me understand the concept.\n\nHere is the lesson I just finished:\n\nLesson context: 'In the story Romeo and Juliet, we see Mercutio was just stabbed by Tybalt. Romeo at first doesn't think that it can be that bad, but Mercutio, in his witty manner, expresses regret at the fact that life has brought him to this point where he is dying.'\n\nLesson content:'ROMEO: Courage, man; the hurt cannot be much. MERCUTIO: No, 'tis not so deep as a well, nor so wide as a church-door; but 'tis enough,'twill serve: ask for me to-morrow, and you shall find me a grave man. I am peppered, I warrant, for this world. A plague o' both your houses! 'Zounds, a dog, a rat, a mouse, a cat, to scratch a man to death! a braggart, a rogue, a villain, that fights by the book of arithmetic! Why the devil came you between us? I was hurt under your arm. ROMEO: I thought all for the best. MERCUTIO: Help me into some house, Benvolio, Or I shall faint. A plague o' both your houses! They have made worms' meat of me: I have it, And soundly too: your houses!";

export const lessonPatchSystemPrompt =
  "You are a coder and have just received some faulty JSON. Your job is to take the faulty JSON and return it in functional JSON while maintaining the contents of the JSON.";

export const lessonPatchHumanPrompt =
  "Here is the faulty JSON. Please reformat and return the contents in properly formatted JSON. If the JSON is fine, then echo the JSON back. \n\n {response}";

export interface LogPair {
  title: string;
  type: string;
  call: string;
  response: string;
}
export interface MCQPromptPair {
  title: string;
  type: string;
  prompt: string;
  systemPrompt: string;
}

export interface LessonPromptSet {
  title: string;
  type: string;
  systemPrompt: string;
  humanPrompt: string;
  parseSystemPrompt: string;
  parseHumanPrompt: string;
  parseSystem2: string;
  parseHuman2: string;
  tabooSystemPrompt: string;
  tabooHumanPrompt: string;
  simulationSystemPrompt: string;
  simulationHumanPrompt: string;
  slotsSystemPrompt: string;
  slotsHumanPrompt: string;
  genericSystemPrompt: string;
  genericHumanPrompt: string;
  hintFilterSystemPrompt: string;
  hintFilterHumanPrompt: string;
  hintMockPrompt: string;
  patchSystemPrompt: string;
  patchHumanPrompt: string;
}

interface ConceptPair {
  concept: string;
  hints: string[];
}

export interface GenState {
  genRecipe: string;
  universalContext: string;
  enablePromptsLog: boolean;
  jsonOutput: string;
  logPairs: LogPair[];
  MCQPrompts: MCQPromptPair[];
  lessonPrompts: LessonPromptSet[];
  questionStrategy: string;
  questionAnswerPairs: string[][];
  questionChosen: number | null;
  showQuestions: boolean;
  showDistractors: boolean;
  showLesson: boolean;
  distractors: string[];
  lessonTitle: string;
  lessonIntro: string;
  lessonObjective: string;
  essentialQuestion: string;
  conclusion: string;
  concepts: ConceptPair[];
}

export type CogenerationContextType = {
  generationData: GenState;
  handleRecipeChange: (val: string) => void;
  handleContextChange: (val: string) => void;
  handleDistractorChange: (val: string, idx: number) => void;
  handleRemoveDistractor: (index: number) => void;
  handleGenerateDistractors: (strategy: DistractorStrategy) => void;
  handleQuestionChange: (val: string, idx: number) => void;
  handleRemoveQuestion: (index: number | null) => void;
  handleGenerateQuestions: (strategy: string) => void;
  handleAnswerChange: (val: string, idx: number) => void;
  handleQuestionStrategy: (event: SelectChangeEvent) => void;
  handleQuestionChosen: (val: number | null) => void;
  handleTitleChange: (val: string) => void;
  handleIntroChange: (val: string) => void;
  handleObjectiveChange: (val: string) => void;
  handleEssentialQuestionChange: (val: string) => void;
  handleConclusionChange: (val: string) => void;
  handleConceptChange: (val: string, idx: number) => void;
  handleHintChange: (
    val: string,
    indexOfConcept: number,
    indexOfHint: number
  ) => void;
  handleGenerateLesson: () => void;
  handleAddConcept: () => void;
  handleRemoveConcept: (index: number | null) => void;
};

export const inputFields = [
  {
    dataCy: "title-input",
    label: "Lesson Title Input",
    placeholder: "Insert additional input to generate the lesson title",
  },
  {
    dataCy: "introduction-input",
    label: "Introduction Input",
    placeholder:
      "Insert additional input to generate the lesson's introduction",
  },
  {
    dataCy: "objective-input",
    label: "Lesson Objective Input",
    placeholder: "Insert additional input to generate the lesson's objective",
  },
  {
    dataCy: "essential-question-input",
    label: "Essential Question Input",
    placeholder: "Insert additional input to generate the essential question",
  },
  {
    dataCy: "concept-hint-input",
    label: "Key Concept & Hint Input",
    placeholder:
      "Insert additional input to generate the lesson's key concepts and hints",
  },
  {
    dataCy: "conclusion-input",
    label: "Conclusion Input",
    placeholder: "Insert additional input to generate the lesson's conclusion",
  },
];

export const generatedLesson: Array<{
  dataCy: string;
  label: string;
  placeholder: string;
  valueKey: keyof GenState;
  onChange: keyof CogenerationContextType;
}> = [
  {
    dataCy: "edit-title",
    label: "Title",
    placeholder: "Add/edit the desired lesson title",
    valueKey: "lessonTitle",
    onChange: "handleTitleChange",
  },
  {
    dataCy: "edit-intro",
    label: "Introduction",
    placeholder: "Add/edit the desired lesson introduction",
    valueKey: "lessonIntro",
    onChange: "handleIntroChange",
  },
  {
    dataCy: "edit-objective",
    label: "Learning Objective",
    placeholder: "Add/edit the desired learning objective",
    valueKey: "lessonObjective",
    onChange: "handleObjectiveChange",
  },
  {
    dataCy: "edit-essential-question",
    label: "Essential Question",
    placeholder: "Add/edit the desired essential question",
    valueKey: "essentialQuestion",
    onChange: "handleEssentialQuestionChange",
  },
];
