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
  lessonTitle,
  lessonIntro,
  lessonObjective,
  lessonEssentialQuestion,
  lessonConclusion,
  lessonConcepts,
  lessonSystemPrompt,
  lessonHumanPrompt,
  lessonParseSystemPrompt,
  lessonParseHumanPrompt,
  lessonParseSystem2Prompt,
  lessonParseHuman2Prompt,
  lessonTabooSystemPrompt,
  lessonTabooHumanPrompt,
  lessonSimulationSystemPrompt,
  lessonSimulationHumanPrompt,
  lessonSlotsSystemPrompt,
  lessonSlotsHumanPrompt,
  lessonGenericSystemPrompt,
  lessonGenericHumanPrompt,
  lessonHintFilterSystemPrompt,
  lessonHintFilterHumanPrompt,
  lessonHintMockPrompt,
  lessonPatchSystemPrompt,
  lessonPatchHumanPrompt,
  CogenerationContextType,
  GenState,
  newLessonConcept,
} from "constants/cogenerationDummyData";
import { SelectChangeEvent } from "@mui/material";

const CogenerationContext = createContext<CogenerationContextType | undefined>(
  undefined
);

const CogenerationProvider = (props: {
  children?: React.ReactNode;
}): JSX.Element => {
  const [generationData, setGenerationData] = useState<GenState>({
    genRecipe: "multipleChoice",
    universalContext: "",
    jsonOutput: "",
    enablePromptsLog: false,
    logPairs: [],
    MCQPrompts: [],
    lessonPrompts: [],
    questionStrategy: "verification",
    questionAnswerPairs: [
      ["", ""],
      ["", ""],
      ["", ""],
    ],
    questionChosen: null,
    showQuestions: false,
    showDistractors: false,
    showLesson: false,
    distractors: [""],
    lessonTitle: "",
    lessonIntro: "",
    lessonObjective: "",
    essentialQuestion: "",
    conclusion: "",
    concepts: [],
  });

  const handleRecipeChange = useCallback((val: string) => {
    setGenerationData((prev) => ({ ...prev, genRecipe: val }));
  }, []);

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
          ...prev.MCQPrompts,
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
          MCQPrompts: newPrompts,
          jsonOutput: JSON.stringify(newJsonOutput, null, 2),
          enablePromptsLog: true,
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
  
        let newQuestionChosen = prev.questionChosen;
        if (prev.questionChosen === index) {
          newQuestionChosen = newQuestions.length > 0 ? (index === 0 ? 0 : index - 1) : null;
        } else if (prev.questionChosen !== null && prev.questionChosen > index) {
          newQuestionChosen = prev.questionChosen - 1;
        }
        return {
          ...prev,
          questionChosen: newQuestionChosen,
          questionAnswerPairs: newQuestions,
        };
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
        ...prev.MCQPrompts,
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
        MCQPrompts: newPrompts,
        jsonOutput: JSON.stringify(newJsonOutput, null, 2),
        enablePromptsLog: true,
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
      return { ...prev, lessonTitle: newTitle };
    });
  }, []);

  const handleIntroChange = useCallback((val: string) => {
    setGenerationData((prev) => {
      const newIntro = val;
      return { ...prev, lessonIntro: newIntro };
    });
  }, []);

  const handleObjectiveChange = useCallback((val: string) => {
    setGenerationData((prev) => {
      const newObjective = val;
      return { ...prev, lessonObjective: newObjective };
    });
  }, []);

  const handleEssentialQuestionChange = useCallback((val: string) => {
    setGenerationData((prev) => {
      const newQuestion = val;
      return { ...prev, essentialQuestion: newQuestion };
    });
  }, []);

  const handleConclusionChange = useCallback((val: string) => {
    setGenerationData((prev) => {
      const newConclusion = val;
      return { ...prev, conclusion: newConclusion };
    });
  }, []);

  const handleConceptChange = useCallback((val: string, index: number) => {
    setGenerationData((prev) => {
      const newConceptList = prev.concepts;
      newConceptList[index].concept = val;
      return { ...prev, concepts: newConceptList };
    });
  }, []);

  const handleHintChange = useCallback(
    (val: string, indexOfConcept: number, indexOfHint: number) => {
      setGenerationData((prev) => {
        const newConceptList = prev.concepts;
        newConceptList[indexOfConcept].hints[indexOfHint] = val;
        return { ...prev, concepts: newConceptList };
      });
    },
    []
  );

  const handleRemoveConcept = useCallback((index: number | null) => {
    if (index !== null) {
      setGenerationData((prev) => {
        const newConceptList = prev.concepts.filter(
          (_, idx) => idx !== index
        );
        return {
          ...prev,
          concepts: newConceptList,
        };
      });
    }
  }, []);
  const handleGenerateLesson = useCallback(() => {
    setGenerationData((prev) => {
      const newLessonTitle = lessonTitle;
      const newLessonIntro = lessonIntro;
      const newLessonObjective = lessonObjective;
      const newEssentialQuestion = lessonEssentialQuestion;
      const newConclusion = lessonConclusion;
      const newConceptList = lessonConcepts;

      const newLogs = [
        ...prev.logPairs,
        {
          title: `Generate Lesson Call`,
          type: "lesson",
          call: "Call Details",
          response: "Response Details",
        },
      ];
      const newPrompts = [
        ...prev.lessonPrompts,
        {
          title: `Lesson Generation`,
          type: "lesson",
          systemPrompt: lessonSystemPrompt,
          humanPrompt: lessonHumanPrompt,
          parseSystemPrompt: lessonParseSystemPrompt,
          parseHumanPrompt: lessonParseHumanPrompt,
          parseSystem2: lessonParseSystem2Prompt,
          parseHuman2: lessonParseHuman2Prompt,
          tabooSystemPrompt: lessonTabooSystemPrompt,
          tabooHumanPrompt: lessonTabooHumanPrompt,
          simulationSystemPrompt: lessonSimulationSystemPrompt,
          simulationHumanPrompt: lessonSimulationHumanPrompt,
          slotsSystemPrompt: lessonSlotsSystemPrompt,
          slotsHumanPrompt: lessonSlotsHumanPrompt,
          genericSystemPrompt: lessonGenericSystemPrompt,
          genericHumanPrompt: lessonGenericHumanPrompt,
          hintFilterSystemPrompt: lessonHintFilterSystemPrompt,
          hintFilterHumanPrompt: lessonHintFilterHumanPrompt,
          hintMockPrompt: lessonHintMockPrompt,
          patchSystemPrompt: lessonPatchSystemPrompt,
          patchHumanPrompt: lessonPatchHumanPrompt,
        },
      ];

      const jsonOutput = prev.jsonOutput
        ? JSON.parse(prev.jsonOutput)
        : {
            lesson_id: "",
            model: "",
            temp: "",
            lesson_name: "",
            learning_objective: "",
            introduction: "",
            essential_question: "",
            key_concepts: {
              concept_1: {
                concept: "",
                keywords: "",
              },
              concept_2: {
                concept: "",
                keywords: "",
              },
              concept_3: {
                concept: "",
                keywords: "",
              },
            },
            hints: {
              concept_1: {
                concept: "",
                hint_1: "",
                hint_2: "",
                hint_3: "",
              },
              concept_2: {
                concept: "",
                hint_1: "",
                hint_2: "",
                hint_3: "",
              },
              concept_3: {
                concept: "",
                hint_1: "",
                hint_2: "",
                hint_3: "",
              },
            },
            conclusion: "",
          };
      const newJsonOutput = {
        ...jsonOutput,
        lesson_id: "3d728b3a-d320-41e5-9091-d40d097e997b",
        model: "gpt-4",
        temp: "0.3",
        lesson_name: lessonTitle,
        learning_objective: lessonObjective,
        introduction: lessonIntro,
        essential_question: lessonEssentialQuestion,
        key_concepts: {
          concept_1: {
            concept: lessonConcepts[0].concept,
            keywords: "team, sailors, crew, manpower, hands, staff",
          },
          concept_2: {
            concept: lessonConcepts[1].concept,
            keywords: "schedule, extension, deadline, date, time",
          },
          concept_3: {
            concept: lessonConcepts[2].concept,
            keywords: "reduce, adjust, change, shrink, eliminate",
          },
        },
        hints: {
          concept_1: {
            concept: lessonConcepts[0].concept,
            hint_1: lessonConcepts[0].hints[0],
            hint_2: lessonConcepts[0].hints[1],
            hint_3: lessonConcepts[0].hints[2],
          },
          concept_2: {
            concept: lessonConcepts[1].concept,
            hint_1: lessonConcepts[1].hints[0],
            hint_2: lessonConcepts[1].hints[1],
            hint_3: lessonConcepts[1].hints[2],
          },
          concept_3: {
            concept: lessonConcepts[2].concept,
            hint_1: lessonConcepts[2].hints[0],
            hint_2: lessonConcepts[2].hints[1],
            hint_3: lessonConcepts[2].hints[2],
          },
        },
        conclusion: lessonConclusion,
      };
      return {
        ...prev,
        lessonTitle: newLessonTitle,
        lessonIntro: newLessonIntro,
        lessonObjective: newLessonObjective,
        essentialQuestion: newEssentialQuestion,
        conclusion: newConclusion,
        concepts: newConceptList,
        logPairs: newLogs,
        lessonPrompts: newPrompts,
        jsonOutput: JSON.stringify(newJsonOutput, null, 2),
        showLesson: true,
        enablePromptsLog: true,
      };
    });
  }, []);

  const handleAddConcept = useCallback(() => {
    setGenerationData((prev) => {
      const newConcepts = [...prev.concepts, newLessonConcept];
      return {
        ...prev,
        concepts: newConcepts
      };
    });
  }, []);

  return (
    <CogenerationContext.Provider
      value={{
        generationData,
        handleRecipeChange,
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
        handleGenerateLesson,
        handleAddConcept,
        handleRemoveConcept,
      }}
    >
      {props.children}
    </CogenerationContext.Provider>
  );
};

export default CogenerationContext;
export { CogenerationProvider };
