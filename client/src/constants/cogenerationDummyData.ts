/*
This software is Copyright ©️ 2024 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/

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
