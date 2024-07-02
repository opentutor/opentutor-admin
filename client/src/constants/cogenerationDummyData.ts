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
