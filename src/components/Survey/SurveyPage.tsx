import React, { useEffect, useState } from "react";
import axios from "axios";

import { CircularProgress, Box, Button } from "@mui/material";

import SurveyQuestionList from "./SurveyQuestionList";

import {
  BGlobalAnswerListType,
  BGlobalAnswerType,
  BGlobalPagesType,
  BGlobalQuestionListType,
  BGlobalQuestionType,
} from "../../types";

type SurveyPageType = {
  page: BGlobalPagesType;
  pageNumber: number;
  totalPages: number;

  onNextPage: () => void;
  onPreviousPage: () => void;
};

const SurveyPage: React.FC<SurveyPageType> = ({
  page,
  pageNumber,
  totalPages,
  onNextPage,
  onPreviousPage,
}) => {
  const [questions, setQuestions] = useState<BGlobalQuestionType[]>([]);
  const [optionsMap, setOptionsMap] = useState<{
    [key: string]: BGlobalAnswerType[];
  }>({});
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchQuestionsAndOptions = async () => {
      try {
        // Petición para obtener las preguntas de la página
        const questionResponse = await axios.post<BGlobalQuestionListType>(
          `${process.env.REACT_APP_DO_URL}/getquestion`,
          {
            questionId: page.Id,
          }
        );
        const questionData = questionResponse.data.value;

        console.log("questionData", questionData);

        // Cargar opciones para preguntas de tipo Ranking, SingleSelect, MultiSelect
        const optionsPromises = questionData.map(async (question) => {
          if (
            ["checkbox", "list", "radiobutton", "ranking"].includes(
              question.BGlobalType.Description
            )
          ) {
            const response = await axios.post<BGlobalAnswerListType>(
              `${process.env.REACT_APP_DO_URL}/getanswer`,
              {
                answerId: question.Id,
              }
            );

            //console.log("respuesta de getAnswer", response.data);

            return { questionId: question.Id, options: response.data.value };
          }
          return { questionId: question.Id, options: [] };
        });

        // Resuelve todas las promesas de opciones
        const optionsResults = await Promise.all(optionsPromises);

        // Mapear las opciones en un objeto donde las claves son los IDs de las preguntas
        const newOptionsMap: { [key: string]: any } = {};
        optionsResults.forEach(({ questionId, options }) => {
          newOptionsMap[questionId] = options;
        });

        // Actualizar el estado con las preguntas y las opciones
        setQuestions(questionData);
        setOptionsMap(newOptionsMap);
      } catch (error) {
        console.error("Error fetching questions and options:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestionsAndOptions();
  }, [page.Id]);

  useEffect(() => {
    if (Object.keys(optionsMap).length > 0) {
      console.log("optionsMap", optionsMap);
    }
  }, [optionsMap]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div>
      <h2>{page.BGlobalTitle}</h2>
      <SurveyQuestionList questions={questions} questionMap={optionsMap} />
      {pageNumber < totalPages && pageNumber !== 0 && (
        <Button variant="contained" onClick={onPreviousPage}>
          Back
        </Button>
      )}
      {pageNumber < totalPages - 1 && (
        <Button variant="contained" onClick={onNextPage}>
          Next
        </Button>
      )}
    </div>
  );
};

export default SurveyPage;
