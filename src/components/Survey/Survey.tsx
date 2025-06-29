import React, { useEffect, useState } from "react";
import axios from "axios";

import i18n from "../../i18n";

import {
  BGlobalLanguageType,
  BGlobalPagesType,
  BGlogalSurveyType,
} from "../../types";
import SurveyPage from "./SurveyPage";
import { Typography } from "@mui/material";

const Survey = () => {
  const [survey, setSurvey] = useState<BGlogalSurveyType>();
  const [pages, setPages] = useState<BGlobalPagesType[]>([]);
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0);

  const goToNextPage = () => {
    setCurrentPageIndex(currentPageIndex + 1);
  };

  const goToPreviousPage = () => {
    setCurrentPageIndex(currentPageIndex - 1);
  };

  useEffect(() => {
    console.log(window.location.pathname);
    if (
      window.location.pathname === "/SurveyView" &&
      window.location.search.toLowerCase().slice(1, 10) === "surveyid="
    ) {
      axios
        .post<any>(`${process.env.REACT_APP_DO_URL}/getsurvey`, {
          surveyId: window.location.search.slice(10),
        })
        .then((res) => {
          console.log("survey data ", res.data);
          axios
            .post<BGlobalLanguageType>(
              `${process.env.REACT_APP_DO_URL}/getlanguage`,
              {
                surveyId: window.location.search.slice(10),
              }
            )
            .then((resLng) => {
              console.log("LANGUAGE", resLng.data.BGlobalCode);
              i18n.changeLanguage(resLng.data.BGlobalCode);

              axios
                .post(`${process.env.REACT_APP_DO_URL}/validatekey`, {
                  surveyId: window.location.search.slice(10),
                })
                .then((resVK) => {
                  console.log("VALIDATE KEY", resVK.data.isValidKey);
                  if (resVK.data.isValidKey) {
                    setSurvey(res.data);
                  }
                })
                .catch((errLng) => {
                  console.error("LANGUAGE-ERROR", errLng);
                });
            })
            .catch((errVK) => {
              console.error("VALIDATE KEY-ERROR", errVK);
            });
        })
        .catch((e) => {
          console.error("getsurvey - error", e);
        });
    }
  }, []);

  useEffect(() => {
    console.log("activeSurvey", survey);
    if (survey && survey.Id) {
      axios
        .post<BGlobalPagesType[]>(`${process.env.REACT_APP_DO_URL}/getpages`, {
          surveyId: survey.Id,
        })
        .then((res) => {
          console.log("paginas", res.data);
          setPages(res.data);
        })
        .catch((err) => {
          console.error("getpages - error ", err);
        });

      /*
      axios
        .post<BGlobalSurveyStyleType>(
          `${process.env.REACT_APP_DO_URL}/getstyles`,
          {
            surveyId: survey.Id,
          }
        )
        .then((res) => {
          console.log("ESTILOS", res.data);

          if (res.data) {
            setAllEncuestaStyles({
              encuestaBackgroundColor: res.data.BGSurveyBC || "#000000",
              encuestaFontColor: res.data.BGSurveyFC || "#000000",
              encuestaFontFamily: res.data.BGSurveyFT || "Hanken Grotesk",
            });

            setAllPreguntaStyles({
              preguntaFontColor: res.data.BGQuestionFC || "#000000",
              preguntaFontFamily: res.data.BGQuestionFT || "Hanken Grotesk",
            });

            setAllRespuestaStyles({
              respuestaBackgroundColor: res.data.BGAnswerBC || "#000000",
              respuestaFontColor: res.data.BGAnswerFC || "#000000",
              respuestaFontFamily: res.data.BGAnswerFT || "Hanken Grotesk",
            });

            setAllTituloStyles({
              tituloFontColor: res.data.BGTitleFC || "#000000",
              tituloFontFamily: res.data.BGTitleFT || "Hanken Grotesk",
            });
          }

          setIsLoading(false);
        })
        .catch((err) => {
          console.error("ESTILOS - error ", err);
          setIsLoading(false);
        });
        */
    }
  }, [survey]);

  return (
    <div>
      {pages.length > 0 && (
        <>
          <Typography variant="body1">{survey?.BGlobalSurveyName}</Typography>
          <SurveyPage
            page={pages[currentPageIndex]}
            pageNumber={currentPageIndex}
            totalPages={pages.length}
            onNextPage={goToNextPage}
            onPreviousPage={goToPreviousPage}
          />
        </>
      )}
      {/*pages.map((page) => (
        <h1>si</h1>
        <SurveyQuestion key={question.Id} question={question} />
      ))*/}
    </div>
  );
};

export default Survey;
