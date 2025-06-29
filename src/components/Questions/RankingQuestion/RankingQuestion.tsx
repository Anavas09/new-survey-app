import React from "react";
import { Box, Rating, Typography } from "@mui/material";

import { BGlobalAnswerType, BGlobalQuestionType } from "../../../types";

import useSurveyStore from "../../../store/surveyStore";
import CircleIcon from "./CircleIcon";

type RankingQuestionProps = {
  question: BGlobalQuestionType;
  options: BGlobalAnswerType[];
};

const RankingQuestion: React.FC<RankingQuestionProps> = ({
  question,
  options,
}) => {
  const setAnswer = useSurveyStore((state) => state.setAnswers);
  const answers = useSurveyStore((state) => state.answers);

  const handleChange = (
    event: React.ChangeEvent<{}>,
    newValue: number | null
  ) => {
    if (newValue !== null) {
      setAnswer(question.Id, newValue);
    }
  };

  return (
    <Box>
      <Typography variant="h6" mr={2}>
        {question.BGlobalQuestion}
      </Typography>
      <Box display="flex" alignItems="center">
        <Typography variant="h6">{question.BGlobalLabel1}</Typography>
        <Rating
          name={`rating-${question.Id}`}
          value={answers[question.Id] || 0}
          onChange={handleChange}
          max={options.length}
          IconContainerComponent={({ value }) => (
            <CircleIcon
              value={value}
              label={options[value - 1].BGlobalValueText || value.toString()}
            />
          )}
        />
        <Typography variant="h6" ml={2}>
          {question.BGlobalLabel2}
        </Typography>
      </Box>
    </Box>
  );
};

export default RankingQuestion;
