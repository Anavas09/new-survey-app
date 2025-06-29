import React from "react";

import SurveyQuestion from "./SurveyQuestion";

import { BGlobalAnswerType, BGlobalQuestionType } from "../../types";

type SurveyQuestionListType = {
  questions: BGlobalQuestionType[];
  questionMap: { [key: string]: BGlobalAnswerType[] };
};

const SurveyQuestionList: React.FC<SurveyQuestionListType> = ({
  questions,
  questionMap,
}) => {
  return (
    <div>
      {questions.map((question) => (
        <SurveyQuestion
          key={question.Id}
          question={question}
          options={questionMap[question.Id]}
        />
      ))}
    </div>
  );
};

export default SurveyQuestionList;
