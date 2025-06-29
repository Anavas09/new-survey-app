import React from "react";
import { Typography, Checkbox } from "@mui/material";

import useSurveyStore from "../../store/surveyStore";

import { BGlobalAnswerType, BGlobalQuestionType } from "../../types";
import TextQuestion from "../Questions/TextQuestion";
import RankingQuestion from "../Questions/RankingQuestion/RankingQuestion";

type SurveyQuestionType = {
  question: BGlobalQuestionType;
  options: BGlobalAnswerType[];
};

const SurveyQuestion: React.FC<SurveyQuestionType> = ({
  options,
  question,
}) => {
  const setAnswer = useSurveyStore((state) => state.setAnswers);
  const answers = useSurveyStore((state) => state.answers);

  /*
  useEffect(() => {
    if (!answers[question.Id]) {
      // Inicia la respuesta en vacío si no está en el estado
      setAnswer(question.Id, "");
    }
  }, [question.Id, setAnswer, answers]);
  */

  switch (question.BGlobalType.Description) {
    case "label":
      return <Typography>{question.BGlobalQuestion}</Typography>;

    case "txt":
      return (
        <>
          <TextQuestion question={question} />
        </>
      );

    case "checkbox":
      return (
        <div>
          <Typography>{question.BGlobalQuestion}</Typography>
          <Checkbox
            checked={Boolean(answers[question.Id])}
            onChange={(e) => setAnswer(question.Id, e.target.checked)}
          />
        </div>
      );

    case "ranking":
      return (
        <div>
          <RankingQuestion question={question} options={options} />
        </div>
      );

    // Agrega más casos según los tipos de preguntas que manejes
    default:
      return null;
  }
};

export default SurveyQuestion;
