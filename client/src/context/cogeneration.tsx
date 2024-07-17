/*
This software is Copyright ©️ 2024 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import React, { createContext, useState, useCallback } from "react";
import {
  DistractorStrategy,
  distractorPrompt,
  distractorSystemPrompt,
  generatedDistractors,
  generatedQuestions,
  questionPrompt,
  questionSystemPrompt,
} from "constants/cogenerationDummyData";
import { SelectChangeEvent } from "@mui/material";

interface LogPair {
  title: string;
  type: string;
  call: string;
  response: string;
}
interface PromptPair {
  title: string;
  type: string;
  prompt: string;
  systemPrompt: string;
}

interface ConceptPair {
  concept: string;
  hints: string[];
}

interface GenState {
  universalContext: string;
  jsonOutput: string;
  logPairs: LogPair[];
  prompts: PromptPair[];
  questionStrategy: string;
  questionAnswerPairs: string[][];
  questionChosen: number | null;
  showQuestions: boolean;
  showDistractors: boolean;
  distractors: string[];
  lessonTitle: string;
  lessonIntro: string;
  lessonObjective: string;
  essentialQuestion: string;
  conclusion: string;
  concepts: ConceptPair[];
}

type CogenerationContextType = {
  generationData: GenState;
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
  handleConceptChange:(val: string, idx: number) => void;
  handleHintChange: (val: string, indexOfConcept: number, indexOfHint: number) => void;
};

const CogenerationContext = createContext<CogenerationContextType | undefined>(
  undefined
);

const CogenerationProvider = (props: {
  children?: React.ReactNode;
}): JSX.Element => {
  const [generationData, setGenerationData] = useState<GenState>({
    universalContext: "",
    jsonOutput: "",
    logPairs: [],
    prompts: [],
    questionStrategy: "verification",
    questionAnswerPairs: [
      ["", ""],
      ["", ""],
      ["", ""],
    ],
    questionChosen: null,
    showQuestions: false,
    showDistractors: false,
    distractors: [""],
    lessonTitle: "",
    lessonIntro: "", 
    lessonObjective: "",
    essentialQuestion: "",
    conclusion: "",
    concepts:[],
  });

  const handleContextChange = useCallback((val: string) => {
    setGenerationData((prev) => ({ ...prev, universalContext: val }));
  }, []);

  const handleDistractorChange = useCallback((val: string, idx: number) => {
    setGenerationData((prev) => {
      const newDistractors = [...prev.distractors];
      newDistractors[idx] = val;
      return { ...prev, distractors: newDistractors };
    });
  }, []);

  const handleRemoveDistractor = useCallback((index: number) => {
    setGenerationData((prev) => {
      const newDistractors = prev.distractors.filter((_, idx) => idx !== index);
      return { ...prev, distractors: newDistractors };
    });
  }, []);

  const handleGenerateDistractors = useCallback(
    (strategy: DistractorStrategy) => {
      setGenerationData((prev) => {
        const count =
          prev.logPairs.filter((entry) => entry.type === "distractor").length +
          1;
        const newDistractors = generatedDistractors[strategy];
        const newLogs = [
          ...prev.logPairs,
          {
            title: `Generate Distractors Call #${count}`,
            type: "distractor",
            call: "Call Details",
            response: "Response Details",
          },
        ];
        const newPrompts = [
          ...prev.prompts,
          {
            title: `Distractor Generation #${count}`,
            type: "distractor",
            prompt: distractorPrompt,
            systemPrompt: distractorSystemPrompt,
          },
        ];

        const jsonOutput = prev.jsonOutput
          ? JSON.parse(prev.jsonOutput)
          : { questions: {}, distractors: {} };
        const newDistractorJsonOutput = {
          ...jsonOutput.distractors,
          [strategy]: [
            ...(jsonOutput.distractors?.[strategy] || []),
            ...newDistractors,
          ],
        };

        const newJsonOutput = {
          ...jsonOutput,
          distractors: newDistractorJsonOutput,
        };
        return {
          ...prev,
          distractors: newDistractors,
          showDistractors: true,
          logPairs: newLogs,
          prompts: newPrompts,
          jsonOutput: JSON.stringify(newJsonOutput, null, 2),
        };
      });
    },
    []
  );

  const handleQuestionChange = useCallback((val: string, idx: number) => {
    setGenerationData((prev) => {
      const newQuestionAnswerPairs = [...prev.questionAnswerPairs];
      newQuestionAnswerPairs[idx][0] = val;
      return { ...prev, questionAnswerPairs: newQuestionAnswerPairs };
    });
  }, []);

  const handleRemoveQuestion = useCallback((index: number | null) => {
    if (index !== null) {
      setGenerationData((prev) => {
        const newQuestions = prev.questionAnswerPairs.filter(
          (_, idx) => idx !== index
        );
        if (prev.questionChosen === index) {
          if (newQuestions.length > 0) {
            const newIndex = index === 0 ? 0 : index - 1;
            return {
              ...prev,
              questionChosen: newIndex,
              questionAnswerPairs: newQuestions,
            };
          } else {
            return {
              ...prev,
              questionChosen: null,
              questionAnswerPairs: newQuestions,
            };
          }
        } else {
          return { ...prev, questionAnswerPairs: newQuestions };
        }
      });
    }
  }, []);

  const handleGenerateQuestions = useCallback((strategy: string) => {
    setGenerationData((prev) => {
      const count =
        prev.logPairs.filter((entry) => entry.type === "question").length + 1;
      const newLogs = [
        ...prev.logPairs,
        {
          title: `Generate Questions Call #${count}`,
          type: "question",
          call: "Call Details",
          response: "Response Details",
        },
      ];
      const newPrompts = [
        ...prev.prompts,
        {
          title: `Q&A Generation #${count}`,
          type: "question",
          prompt: questionPrompt,
          systemPrompt: questionSystemPrompt,
        },
      ];

      const jsonOutput = prev.jsonOutput
        ? JSON.parse(prev.jsonOutput)
        : { questions: {}, distractors: {} };
      const newQuestions = {
        ...jsonOutput.questions,
        [strategy]: [
          ...(jsonOutput.questions?.[strategy] || []),
          generatedQuestions,
        ],
      };

      const newJsonOutput = {
        ...jsonOutput,
        questions: newQuestions,
      };
      return {
        ...prev,
        questionAnswerPairs: generatedQuestions,
        showQuestions: true,
        logPairs: newLogs,
        prompts: newPrompts,
        jsonOutput: JSON.stringify(newJsonOutput, null, 2),
      };
    });
  }, []);

  const handleAnswerChange = useCallback((val: string, idx: number) => {
    setGenerationData((prev) => {
      const newQuestionAnswerPairs = prev.questionAnswerPairs;
      newQuestionAnswerPairs[idx][1] = val;
      return { ...prev, questionAnswerPairs: newQuestionAnswerPairs };
    });
  }, []);

  const handleQuestionStrategy = useCallback((event: SelectChangeEvent) => {
    setGenerationData((prev) => {
      return { ...prev, questionStrategy: event.target.value as string };
    });
  }, []);

  const handleQuestionChosen = useCallback((val: number | null) => {
    setGenerationData((prev) => {
      return { ...prev, questionChosen: val };
    });
  }, []);

  const handleTitleChange = useCallback((val: string) => {
    setGenerationData((prev) => {
      const newTitle = val;
      return { ...prev, lessonTitle: newTitle};
    });
  }, []);

  const handleIntroChange = useCallback((val: string) => {
    setGenerationData((prev) => {
      const newIntro = val;
      return { ...prev, lessonIntro: newIntro};
    });
  }, []);

  const handleObjectiveChange = useCallback((val: string) => {
    setGenerationData((prev) => {
      const newObjective = val;
      return { ...prev, lessonObjective: newObjective};
    });
  }, []);
  
  const handleEssentialQuestionChange = useCallback((val: string) => {
    setGenerationData((prev) => {
      const newQuestion = val;
      return { ...prev, essentialQuestion: newQuestion};
    });
  }, []);

  const handleConclusionChange = useCallback((val: string) => {
    setGenerationData((prev) => {
      const newConclusion = val;
      return { ...prev, conclusion: newConclusion};
    });
  }, []);
  
  
  const handleConceptChange = useCallback((val: string, index: number) => {
    setGenerationData((prev) => {
      const newConceptList = prev.concepts;
      newConceptList[index].concept = val;
      return { ...prev, concepts: newConceptList};
    });
  }, []);

  const handleHintChange = useCallback((val: string, indexOfConcept: number, indexOfHint: number) => {
    setGenerationData((prev) => {
      const newConceptList = prev.concepts;
      newConceptList[indexOfConcept].hints[indexOfHint] = val;
      return { ...prev, concepts: newConceptList};
    });
  }, []);
  

  return (
    <CogenerationContext.Provider
      value={{
        generationData,
        handleContextChange,
        handleDistractorChange,
        handleRemoveDistractor,
        handleGenerateDistractors,
        handleQuestionChange,
        handleRemoveQuestion,
        handleGenerateQuestions,
        handleAnswerChange,
        handleQuestionStrategy,
        handleQuestionChosen,
        handleTitleChange,
        handleIntroChange,
        handleObjectiveChange,
        handleEssentialQuestionChange,
        handleConclusionChange,
        handleConceptChange,
        handleHintChange,
      }}
    >
      {props.children}
    </CogenerationContext.Provider>
  );
};

export default CogenerationContext;
export { CogenerationProvider };
