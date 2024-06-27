/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import React from "react";
import clsx from "clsx";
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

interface QuestionAnswerClasses {
  selectForm: string;
  divider: string;
  button: string;
  expand: string;
  expandOpen: string;
}

const QuestionAnswerPair = (props: {
  classes: QuestionAnswerClasses;
  questionIndex: number;
  question: string;
  answer: string;
  handleQuestionChange: (val: string) => void;
  handleRemoveQuestion: (index: number) => void;
  handleAnswerChange: (val: string) => void;
  canDelete: boolean;
  questionChosen: number | null;
  setQuestionChosen: React.Dispatch<React.SetStateAction<number | null>>
}) => {
  const {
    classes,
    questionIndex,
    question,
    answer,
    handleQuestionChange,
    handleRemoveQuestion,
    handleAnswerChange,
    canDelete,
    questionChosen,
    setQuestionChosen,
  } = props;
  const [expanded, setExpanded] = React.useState(true);
  const handleRadioChange = (event: SelectChangeEvent) => {
    const selectedValue = parseInt(event.target.value, 10);
  
    if (!isNaN(selectedValue)) {
      setQuestionChosen(selectedValue);
    } else {
      console.error('Invalid value type received for questionChosen:', event.target.value);
    }
  };

  return (
    <Card
      data-cy={`Question-${questionIndex}`}
      style={{ width: "100%", marginTop: 15, marginBottom: 15, marginLeft: 15 }}
    >
      <CardContent>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <TextField
            margin="normal"
            data-cy="edit-question"
            label={`Question ${questionIndex + 1}`}
            multiline
            maxRows={4}
            fullWidth
            placeholder="Add/edit the desired question"
            InputLabelProps={{
              shrink: true,
            }}
            value={question || ""}
            onChange={(e) => {
              handleQuestionChange(e.target.value);
            }}
            disabled={questionChosen != questionIndex && questionChosen != null}
          />
          <CardActions>
            {canDelete ? (
              <IconButton
                data-cy="delete"
                aria-label="remove question"
                size="small"
                onClick={() => handleRemoveQuestion(questionIndex)}
              >
                <ClearOutlined />
              </IconButton>
            ) : null}
            <Radio
              checked={questionChosen === questionIndex}
              onChange={handleRadioChange}
              value={questionIndex.toString()}
              name="radio-button"
            />
            <IconButton
              data-cy="expand"
              aria-label="expand question"
              size="small"
              aria-expanded={expanded}
              className={clsx(classes.expand, {
                [classes.expandOpen]: expanded,
              })}
              onClick={() => setExpanded(!expanded)}
            >
              <ExpandMore />
            </IconButton>
          </CardActions>
        </div>
        <Collapse
          in={expanded}
          timeout="auto"
          unmountOnExit
          style={{ paddingTop: 10, paddingRight: 10 }}
        >
          <TextField
            margin="normal"
            data-cy="edit-answer"
            label={`Answer`}
            multiline
            maxRows={4}
            fullWidth
            placeholder="Add/edit your desired answer."
            InputLabelProps={{
              shrink: true,
            }}
            value={answer || ""}
            onChange={(e) => {
              handleAnswerChange(e.target.value);
            }}
            disabled={questionChosen != questionIndex && questionChosen != null}
          />
        </Collapse>
      </CardContent>
    </Card>
  );
};

export function QuestionAnswerGen(props: {
  classes: QuestionAnswerClasses;
  questionChosen: number | null;
  setQuestionChosen: React.Dispatch<React.SetStateAction<number | null>>;
  universalContext: string;
  setQuestions: React.Dispatch<React.SetStateAction<string[][]>>;
  questions: string[][];
  distractors: string[];
}): JSX.Element {
  const {
    classes,
    questionChosen,
    setQuestionChosen,
    distractors,
    universalContext,
    questions,
    setQuestions,
  } = props;

  const [showQuestions, setShowQuestions] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [questionToDelete, setQuestionToDelete] = React.useState<number | null>(
    null
  );
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setQuestionToDelete(null);
    setOpen(false);
  };

  const [questionStrategy, setQuestionStrategy] =
    React.useState("verification");
  const handleQuestionStrategy = (event: SelectChangeEvent) => {
    setQuestionStrategy(event.target.value as string);
  };

  const handleQuestionChange = (val: string, idx: number) => {
    setQuestions((oldQuestions) => {
      const newQuestions = [...oldQuestions];
      newQuestions[idx][0] = val;
      return newQuestions;
    });
  };

  const handleAnswerChange = (val: string, idx: number) => {
    setQuestions((oldQuestions) => {
      const newQuestions = [...oldQuestions];
      newQuestions[idx][1] = val;
      return newQuestions;
    });
  };

  const handleRemoveQuestion = (index: number | null) => {
    if (index !== null) {
      setQuestions((oldQuestions) => {
        const newQuestions = oldQuestions.filter((_, idx) => idx !== index);
  
        // Adjusted logic for setting questionChosen
        if (questionChosen === index) {
          if (newQuestions.length > 0) {
            const newIndex = index === 0 ? 0 : index - 1;
            setQuestionChosen(newIndex);
          } else {
            setQuestionChosen(null); // Assuming questionChosen is number | null
          }
        }
  
        return newQuestions;
      });
    }
    setQuestionToDelete(null);
  };

  const handleGenerateQuestions = () => {
    setQuestions([
      ["question1", "answer1"],
      ["question2", "answer2"],
      ["question3", "answer3"],
    ]);
    setShowQuestions(true);
  };
  return (
    <>
      <Paper elevation={0} style={{ textAlign: "left" }}>
        <Grid
          container
          spacing={0}
          style={{ display: "flex", alignItems: "center", marginBottom: 3 }}
        >
          <Grid item>
            <Typography variant="h6" style={{ padding: 5 }}>
              QA Generation
            </Typography>
          </Grid>
          <Grid item style={{ marginLeft: 10 }}>
            <FormControl size="small" sx={{ mb: 1, minWidth: 200 }}>
              <InputLabel shrink>QA Strategy</InputLabel>
              <Select
                data-cy="question-strategy"
                labelId="question-strategy-label"
                label="QA Strategy"
                value={questionStrategy}
                onChange={handleQuestionStrategy}
              >
                <MenuItem value={"verification"}>
                  <ListItemText primary="Verification" />
                </MenuItem>
                <MenuItem value={"definition"}>
                  <ListItemText primary="Definition" />
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item style={{ marginLeft: 20 }}>
            <Button
              data-cy="generate-question-answer"
              className={classes.button}
              onClick={handleGenerateQuestions}
              variant="contained"
              color="primary"
              size="small"
              disabled={universalContext === ""}
            >
              Generate QA Pairs 
            </Button>
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              data-cy="question-input"
              label="User Question Input"
              placeholder="Insert additional input to generate question"
              fullWidth
              multiline
              InputLabelProps={{
                shrink: true,
              }}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              data-cy="answer-input"
              label="User Answer Input"
              placeholder="Insert additional input to generate answer"
              fullWidth
              multiline
              InputLabelProps={{
                shrink: true,
              }}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              data-cy="question-context"
              label="Question Context"
              placeholder="Insert additional context for QA"
              fullWidth
              multiline
              InputLabelProps={{
                shrink: true,
              }}
              variant="filled"
            />
          </Grid>
          {showQuestions &&
            questions.map((row, i) => (
              <>
                <QuestionAnswerPair
                  key={i}
                  classes={classes}
                  questionIndex={i}
                  question={row[0]}
                  answer={row[1]}
                  handleQuestionChange={(val: string) => {
                    handleQuestionChange(val, i);
                  }}
                  handleRemoveQuestion={() => {
                    setQuestionToDelete(i);
                    if (questionChosen === i && distractors[0] != "") {
                      handleOpen();
                    } else {
                      handleRemoveQuestion(i);
                    }
                  }}
                  handleAnswerChange={(val: string) => {
                    handleAnswerChange(val, i);
                  }}
                  canDelete={questions.length > 1}
                  questionChosen={questionChosen}
                  setQuestionChosen={setQuestionChosen}
                />
              </>
            ))}
          <Divider variant="middle" className={classes.divider} />
        </Grid>
      </Paper>
      <DeleteDialog
        open={open}
        handleClose={handleClose}
        handleConfirm={handleRemoveQuestion}
        index={questionToDelete}
      />
    </>
  );
}

export default QuestionAnswerGen;
