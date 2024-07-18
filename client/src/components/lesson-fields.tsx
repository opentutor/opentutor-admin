/*
This software is Copyright ©️ 2024 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import React, { useContext } from "react";
import {
  DistractorStrategy,
} from "constants/cogenerationDummyData";
import {
  Grid,
  Divider,
  TextField,
  FormControl,
  Typography,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  ListItemText,
  Paper,
  Button,
  Card,
  CardActions,
  CardContent,
  IconButton,
  Collapse,
  Radio,
} from "@mui/material";
import { ClearOutlined, ExpandMore } from "@mui/icons-material";
import DeleteDialog from "./delete-dialog";
import CogenerationContext from "context/cogeneration";
import ConceptHintOutput from "./concept-hint-output";

interface LessonInputClasses {
  selectForm: string;
  divider: string;
  button: string;
  expand: string;
  expandOpen: string;
  list: string;
  listDragging: string;
  cardRoot: string;
}

const inputFields = [
  {
    dataCy: 'title-input',
    label: 'Lesson Title Input',
    placeholder: 'Insert additional input to generate the lesson title'
  },
  {
    dataCy: 'introduction-input',
    label: 'Introduction Input',
    placeholder: "Insert additional input to generate the lesson's introduction"
  },
  {
    dataCy: 'objective-input',
    label: 'Lesson Objective Input',
    placeholder: "Insert additional input to generate the lesson's objective"
  },
  {
    dataCy: 'essential-question-input',
    label: 'Essential Question Input',
    placeholder: 'Insert additional input to generate the essential question'
  },
  {
    dataCy: 'concept-hint-input',
    label: 'Key Concept & Hint Input',
    placeholder: "Insert additional input to generate the lesson's key concepts and hints"
  },
  {
    dataCy: 'conclusion-input',
    label: 'Conclusion Input',
    placeholder: "Insert additional input to generate the lesson's conclusion"
  }
];

interface LogPair {
  title: string;
  type: string;
  call: string;
  response: string;
}
interface MCQPromptPair {
  title: string;
  type: string;
  prompt: string;
  systemPrompt: string;
}

interface LessonPromptSet {
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

interface GenState {
  genRecipe: string;
  universalContext: string;
  jsonOutput: string;
  logPairs: LogPair[];
  MCQPrompts: MCQPromptPair[];
  lessonPrompts: LessonPromptSet[];
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
  handleConceptChange:(val: string, idx: number) => void;
  handleHintChange: (val: string, indexOfConcept: number, indexOfHint: number) => void;
  handleGenerateLesson: () => void;
};
const generatedLesson: Array<{
  dataCy: string;
  label: string;
  placeholder: string;
  valueKey: keyof GenState;
  onChange: keyof CogenerationContextType;
}> = [
  {
    dataCy: 'edit-title',
    label: 'Title',
    placeholder: 'Add/edit the desired lesson title',
    valueKey: 'lessonTitle',
    onChange: 'handleTitleChange'
  },
  {
    dataCy: 'edit-intro',
    label: 'Introduction',
    placeholder: 'Add/edit the desired lesson introduction',
    valueKey: 'lessonIntro',
    onChange: 'handleIntroChange'
  },
  {
    dataCy: 'edit-objective',
    label: 'Learning Objective',
    placeholder: 'Add/edit the desired learning objective',
    valueKey: 'lessonObjective',
    onChange: 'handleObjectiveChange'
  },
  {
    dataCy: 'edit-essential-question',
    label: 'Essential Question',
    placeholder: 'Add/edit the desired essential question',
    valueKey: 'essentialQuestion',
    onChange: 'handleEssentialQuestionChange'
  }
];

export function LessonInput(props: {
  classes: LessonInputClasses;
}): JSX.Element {
  const { classes } = props;

  const context = useContext(CogenerationContext);
  if (!context) {
    throw new Error("SomeComponent must be used within a CogenerationProvider");
  }

  return (
    <>
      <Paper elevation={0} style={{ textAlign: "left" }}>
        <Grid
          container
          spacing={3}
          style={{ display: "flex", alignItems: "center", marginBottom: 5 }}
        >
          <Grid item style={{marginBottom: 10}}>
            <Typography variant="h6" style={{ padding: 5 }}>
              Lesson Generation
            </Typography>
          </Grid>
          <Grid item style={{ marginLeft: 20, marginBottom: 10 }}>
            <Button
              data-cy="generate-lesson"
              className={classes.button}
              onClick={context.handleGenerateLesson}
              variant="contained"
              color="primary"
              size="small"
              disabled={context.generationData.universalContext === ""}
            >
              Generate Lesson
            </Button>
          </Grid>
        </Grid>
        <Grid container spacing={4}>
          {inputFields.map((input, i) => (
            <Grid key={i} item xs={12}>
                <TextField
                data-cy= {input.dataCy}
                label={input.label}
                placeholder={input.placeholder}
                fullWidth
                multiline
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
              />
            </Grid>
          ))}
          <Divider variant="middle" className={classes.divider} />
        </Grid>
      </Paper>
    </>
  );
}

export function LessonOutput (props: {
  classes: LessonInputClasses;
}): JSX.Element {
  const { classes } = props;

  const context = useContext(CogenerationContext);
  if (!context) {
    throw new Error("SomeComponent must be used within a CogenerationProvider");
  }

  return (
    <>
    <Card
      data-cy={`Generated-Lesson`}
      style={{ width: "100%", marginTop: 15, marginBottom: 15, marginLeft: 15 }}
    >
      <CardContent>
        <Grid container spacing={1}>
          <Typography variant="h6" style={{ padding: 3 }}>
            Generated Lesson
          </Typography>
          {generatedLesson.map((lesson, i) => (  
            <Grid item xs={12} key={i}>
              <TextField
              margin="normal"
              data-cy={lesson.dataCy}
              label={lesson.label}
              multiline
              maxRows={4}
              fullWidth
              placeholder={lesson.placeholder}
              InputLabelProps={{
                shrink: true,
              }}
              value={context.generationData[lesson.valueKey] || ""}
              onChange={(e) => {
                (context[lesson.onChange] as (value: string) => void)(e.target.value);
              }}
            />
            </Grid>

          ))}
          <ConceptHintOutput classes={classes}/>

          <Grid item xs={12}>
            <TextField
              margin="normal"
              data-cy="edit-conclusion"
              label={`Conclusion`}
              multiline
              maxRows={4}
              fullWidth
              placeholder="Add/edit the desired conclusion"
              InputLabelProps={{
                shrink: true,
              }}
              value={context.generationData.conclusion || ""}
              onChange={(e) => {
                context.handleConclusionChange(e.target.value);
              }}
            />
          </Grid>
          </Grid>
      </CardContent>
    </Card>
    </>
  )

}
