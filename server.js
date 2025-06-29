const express = require("express");
const cors = require("cors");
const axios = require("axios");
const path = require("path");
const helmet = require("helmet");
const hpp = require("hpp");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
// import { o } from "odata";

const config = require("dotenv").config;

require("colors");
config();

const CREATIO_URL = process.env.CREATIO_URL;

const LOGIN_ENV = process.env.LOGIN_ENV;

const SERVER_PORT = process.env.PORT;

const IS_NETCORE = process.env.IS_NETCORE;

const CREATIO_ENV =
  IS_NETCORE === "false" ? `${CREATIO_URL}/0/odata` : `${CREATIO_URL}/odata`;

console.log("survey url ", CREATIO_ENV);
console.log("login url ", LOGIN_ENV);

const tmpLoginUrl = `${LOGIN_ENV}/ServiceModel/AuthService.svc/Login`;

const almacenamiento = multer.memoryStorage();

const subir = multer({ storage: almacenamiento });

const tmpData = {
  UserName: process.env.BGlobalUserName,
  UserPassword: process.env.BGlobalPassword,
};

const app = express();

const getHeadersObject = (headersArr) => {
  const headersObject = {};

  headersArr.forEach((cadena) => {
    const clave = cadena.split("=");
    headersObject[clave[0]] = cadena;
  });

  return headersObject;
};

// app.use(express.json());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
// app.use(express.static("static"));
app.use(cors());
app.use(helmet());
app.use(hpp());
app.disable("x-powered-by");
app.use(express.static(path.join(__dirname, "build")));

app.post("/getsurvey", (req, resp) => {
  const { surveyId } = req.body;

  const options = {
    method: "POST",
    url: tmpLoginUrl,
    data: tmpData,
  };

  axios
    .request(options)
    .then((response) => {
      const headersArr = response.headers["set-cookie"];

      const headersObject = getHeadersObject(headersArr);

      const axiosSurveyOptions = {
        method: "GET",
        headers: {
          Cookie: headersObject[".ASPXAUTH"],
        },
        referrer: undefined,
        url: `${CREATIO_ENV}/BGlobalSurvey(${surveyId})?$select=BGlobalSurveyName,BGlobalSurveyDescription,BGlobalSurveyImageId,BGlobalLanguageId,BGBackgroundId,BGFooter,BGlobalUpdateData,Id`,
      };

      axios
        .request(axiosSurveyOptions)
        .then((res) => {
          resp.status(200).json(res.data);
        })
        .catch((err) => {
          console.log("BGlobalSurvey GET SURVEY ERR".inverse.bgMagenta, err);
          resp.status(500).json(err);
        });
    })
    .catch((error) => {
      console.error("GET SURVEY LOGIN ERROR".inverse.red, error);
      resp.json({ error: error, errorMessgae: "GET SURVEY LOGIN - ERROR" });
    });
});

app.post("/getpages", (req, resp) => {
  const { surveyId } = req.body;

  const options = {
    method: "POST",
    url: tmpLoginUrl,
    data: tmpData,
  };

  axios
    .request(options)
    .then((response) => {
      const headersArr = response.headers["set-cookie"];

      const headersObject = getHeadersObject(headersArr);

      const axiosSurveyOptions = {
        method: "GET",
        headers: {
          Cookie: headersObject[".ASPXAUTH"],
        },
        referrer: undefined,
        url: `${CREATIO_ENV}/BGlobalSurveyPage?$filter=BGlobalSurveyId/Id eq ${surveyId} and BGlobalIsActive eq true&$orderby=BGlobalOrderPage&$select=BGlobalShowTitle,BGlobalOrderPage,Id,BGlobalSubTitle,BGlobalTitle`,
      };

      axios
        .request(axiosSurveyOptions)
        .then((res) => {
          resp.status(200).json(res.data.value);
        })
        .catch((err) => {
          console.log("BGlobalPages ERR".inverse.bgMagenta, err);
          resp.status(500).json(err);
        });
    })
    .catch((error) => {
      console.error("GET PAGES LOGIN ERROR".inverse.red, error);
      resp.json({ error: error, errorMessage: "GET PAGES LOGIN - ERROR" });
    });
});

app.post("/getquestion", (req, resp) => {
  const { questionId } = req.body;

  const options = {
    method: "POST",
    url: tmpLoginUrl,
    data: tmpData,
  };

  axios
    .request(options)
    .then((response) => {
      const headersArr = response.headers["set-cookie"];

      const headersObject = getHeadersObject(headersArr);

      const axiosSurveyOptions = {
        method: "GET",
        headers: {
          Cookie: headersObject[".ASPXAUTH"],
        },
        referrer: undefined,
        url: `${CREATIO_ENV}/BGlobalSurveyQuestion?$filter=BGlobalPageId/Id eq ${questionId} and BGlobalIsActive eq true&$expand=BGlobalType&$orderby=BGlobalOrderQuestion&$select=Id,BGlobalQuestion,BGlobalLabel1,BGlobalLabel2,BGlobalOrderQuestion,BGlobalIsRequired,BGlobalAddValueNa,BGlobalAddComment,BGlobalShowOrder,BGlobalDependenceQuestionId,BGlobalDependenceResponseId,BGlobalQuestionPageOrder,BGlobalSurveyImageId,BGlobalType`,
      };

      axios
        .request(axiosSurveyOptions)
        .then((res) => {
          resp.status(200).json(res.data);
        })
        .catch((err) => {
          console.log("BGlobalSurveyQuestion ERR".inverse.bgMagenta, err);
          resp.status(500).json(err);
        });
    })
    .catch((error) => {
      console.error("GET QUESTION LOGIN ERROR".inverse.red, error);
      resp.json({ error: error, errorMessage: "GET QUESTION LOGIN - ERROR" });
    });
});

app.post("/getanswer", (req, resp) => {
  const { answerId } = req.body;

  const options = {
    method: "POST",
    url: tmpLoginUrl,
    data: tmpData,
  };

  axios
    .request(options)
    .then((response) => {
      const headersArr = response.headers["set-cookie"];

      const headersObject = getHeadersObject(headersArr);

      const axiosSurveyOptions = {
        method: "GET",
        headers: {
          Cookie: headersObject[".ASPXAUTH"],
        },
        referrer: undefined,
        url: `${CREATIO_ENV}/BGlobalSurveyAnswer?$filter=BGlobalQuestion/Id eq ${answerId} and BGlobalIsActive eq true&$top=1000&$orderby=BGlobalOrderAnswer&$expand=BGlobalType&$select=Id,BGlobalQuestionId,BGlobalValueText,BGlobalIsDefault,BGlobalOrderAnswer,BGlobalImageId,BGlobalEndSurvey,BGlobalType`,
      };

      axios
        .request(axiosSurveyOptions)
        .then((res) => {
          resp.status(200).json(res.data);
        })
        .catch((err) => {
          console.log("BGlobalSurveyAnswer ERR".inverse.bgMagenta, err);
          resp.status(500).json(err);
        });
    })
    .catch((error) => {
      console.error("GET ANSWER LOGIN ERROR".inverse.red, error);
      resp.json({ error: error, errorMessage: "GET ANSWER LOGIN - ERROR" });
    });
});

app.post("/getentity", (req, resp) => {
  const { entityId } = req.body;

  const options = {
    method: "POST",
    url: tmpLoginUrl,
    data: tmpData,
  };

  axios
    .request(options)
    .then((response) => {
      const headersArr = response.headers["set-cookie"];

      const headersObject = getHeadersObject(headersArr);

      const axiosSurveyOptions = {
        method: "GET",
        headers: {
          Cookie: headersObject[".ASPXAUTH"],
        },
        referrer: undefined,
        url: `${CREATIO_ENV}/BGlobalSurveyEntity(${entityId})`,
      };

      axios
        .request(axiosSurveyOptions)
        .then((res) => {
          resp.status(200).json(res.data);
        })
        .catch((err) => {
          console.log("BGlobalSurveyAnswer ERR".inverse.bgMagenta, err);
          resp.status(500).json(err);
        });
    })
    .catch((error) => {
      console.error("GET ANSWER LOGIN ERROR".inverse.red, error);
      resp.json({ error: error, errorMessage: "GET ANSWER LOGIN - ERROR" });
    });
});

app.post("/getcontact", (req, resp) => {
  const { contactId, AccountId, CityId, RegionId, CountryId, AddressTypeId } =
    req.body;

  const options = {
    method: "POST",
    url: tmpLoginUrl,
    data: tmpData,
  };

  axios
    .request(options)
    .then((response) => {
      const headersArr = response.headers["set-cookie"];

      const headersObject = getHeadersObject(headersArr);

      const axiosSurveyOptions = {
        method: "GET",
        headers: {
          Cookie: headersObject[".ASPXAUTH"],
        },
        referrer: undefined,
        url: `${CREATIO_ENV}/Contact(${contactId})?$select=Name,Email,Phone,MobilePhone,JobTitle,AccountId,Address,Zip,CityId,RegionId,CountryId,AddressTypeId,Id`,
      };

      if (AccountId) {
        axiosSurveyOptions.url = `${CREATIO_ENV}/Contact(${contactId})/Account`;
      } else if (CityId) {
        axiosSurveyOptions.url = `${CREATIO_ENV}/Contact(${contactId})/City`;
      } else if (RegionId) {
        axiosSurveyOptions.url = `${CREATIO_ENV}/Contact(${contactId})/Region`;
      } else if (CountryId) {
        axiosSurveyOptions.url = `${CREATIO_ENV}/Contact(${contactId})/Country`;
      } else if (AddressTypeId) {
        axiosSurveyOptions.url = `${CREATIO_ENV}/Contact(${contactId})/AddressType`;
      } else {
        // Si no hay lookups, usar la URL original
        axiosSurveyOptions.url = `${CREATIO_ENV}/Contact(${contactId})?$select=Name,Email,Phone,MobilePhone,JobTitle,AccountId,Address,Zip,CityId,RegionId,CountryId,AddressTypeId,Id`;
      }

      axios
        .request(axiosSurveyOptions)
        .then((res) => {
          if (AccountId) {
            resp.status(200).json({ ...res.data, isAccount: true });
          } else if (CityId) {
            resp.status(200).json({ ...res.data, isCity: true });
          } else if (RegionId) {
            resp.status(200).json({ ...res.data, isRegion: true });
          } else if (CountryId) {
            resp.status(200).json({ ...res.data, isCountry: true });
          } else if (AddressTypeId) {
            resp.status(200).json({ ...res.data, isAddressType: true });
          } else {
            // Si no hay lookups, retornar objeto original
            resp.status(200).json(res.data);
          }
        })
        .catch((err) => {
          console.log("GET CONTACT ERR".inverse.bgMagenta, err);
          resp.status(500).json(err);
        });
    })
    .catch((error) => {
      console.error("GET ANSWER LOGIN ERROR".inverse.red, error);
      resp.json({ error: error, errorMessage: "GET ANSWER LOGIN - ERROR" });
    });
});

app.post("/getcountries", (req, resp) => {
  const options = {
    method: "POST",
    url: tmpLoginUrl,
    data: tmpData,
  };

  axios
    .request(options)
    .then((response) => {
      const headersArr = response.headers["set-cookie"];

      const headersObject = getHeadersObject(headersArr);

      const axiosSurveyOptions = {
        method: "GET",
        headers: {
          Cookie: headersObject[".ASPXAUTH"],
        },
        referrer: undefined,
        url: `${CREATIO_ENV}/Country?$orderby=Name&$select=Id,Name,Code,Alpha2Code`,
      };

      axios
        .request(axiosSurveyOptions)
        .then((res) => {
          const countries = res.data.value.map((country) => {
            return { ...country, label: country.Name };
          });
          resp.status(200).json(countries);
        })
        .catch((err) => {
          console.log("BGlobal GET COUNTRY ERR".inverse.bgMagenta, err);
          resp.status(500).json(err);
        });
    })
    .catch((error) => {
      console.error("GET COUNTRY LOGIN ERROR".inverse.red, error);
      resp.json({ error: error, errorMessage: "GET COUNTRY LOGIN - ERROR" });
    });
});

app.post("/getregionlist", (req, resp) => {
  const { countryId } = req.body;

  const options = {
    method: "POST",
    url: tmpLoginUrl,
    data: tmpData,
  };

  axios
    .request(options)
    .then((response) => {
      const headersArr = response.headers["set-cookie"];

      const headersObject = getHeadersObject(headersArr);

      const axiosSurveyOptions = {
        method: "GET",
        headers: {
          Cookie: headersObject[".ASPXAUTH"],
        },
        referrer: undefined,
        url: `${CREATIO_ENV}/Region?$top=1000&$select=Id,Name&$orderby=Name&$filter=Country/Id eq ${countryId}`,
      };

      axios
        .request(axiosSurveyOptions)
        .then((res) => {
          const regionList = res.data.value.map((region) => {
            return { ...region, label: region.Name };
          });
          resp.status(200).json(regionList);
        })
        .catch((err) => {
          console.log("BGlobal GET REGION ERR".inverse.bgMagenta, err);
          resp.status(500).json(err);
        });
    })
    .catch((error) => {
      console.error("GET REGION LOGIN ERROR".inverse.red, error);
      resp.json({ error: error, errorMessage: "GET REGION LOGIN - ERROR" });
    });
});

app.post("/getcitylist", (req, resp) => {
  const { regionId } = req.body;

  const options = {
    method: "POST",
    url: tmpLoginUrl,
    data: tmpData,
  };

  axios
    .request(options)
    .then((response) => {
      const headersArr = response.headers["set-cookie"];

      const headersObject = getHeadersObject(headersArr);

      const axiosSurveyOptions = {
        method: "GET",
        headers: {
          Cookie: headersObject[".ASPXAUTH"],
        },
        referrer: undefined,
        url: `${CREATIO_ENV}/City?$top=1000&$select=Id,Name&$orderby=Name&$filter=Region/Id eq ${regionId}`,
      };

      axios
        .request(axiosSurveyOptions)
        .then((res) => {
          const cities = res.data.value.map((city) => {
            return { ...city, label: city.Name };
          });
          resp.status(200).json(cities);
        })
        .catch((err) => {
          console.log("BGlobal GET CITY ERR".inverse.bgMagenta, err);
          resp.status(500).json(err);
        });
    })
    .catch((error) => {
      console.error("GET CITY LOGIN ERROR".inverse.red, error);
      resp.json({ error: error, errorMessage: "GET CITY LOGIN - ERROR" });
    });
});

app.get("/getaccountlist", (req, resp) => {
  const options = {
    method: "POST",
    url: tmpLoginUrl,
    data: tmpData,
  };

  axios
    .request(options)
    .then((response) => {
      const headersArr = response.headers["set-cookie"];

      const headersObject = getHeadersObject(headersArr);

      const axiosSurveyOptions = {
        method: "GET",
        headers: {
          Cookie: headersObject[".ASPXAUTH"],
        },
        referrer: undefined,
        url: `${CREATIO_ENV}/Account?$top=1000&$select=Id,Name&$orderby=Name`,
      };

      axios
        .request(axiosSurveyOptions)
        .then((res) => {
          const cities = res.data.value.map((account) => {
            return { ...account, label: account.Name };
          });
          resp.status(200).json(cities);
        })
        .catch((err) => {
          console.log("BGlobal GET ACCOUNT ERR".inverse.bgMagenta, err);
          resp.status(500).json(err);
        });
    })
    .catch((error) => {
      console.error("GET ACCOUNT LOGIN ERROR".inverse.red, error);
      resp.json({ error: error, errorMessage: "GET ACCOUNT LOGIN - ERROR" });
    });
});

app.post("/getaddresslist", (req, resp) => {
  const options = {
    method: "POST",
    url: tmpLoginUrl,
    data: tmpData,
  };

  axios
    .request(options)
    .then((response) => {
      const headersArr = response.headers["set-cookie"];

      const headersObject = getHeadersObject(headersArr);

      const axiosSurveyOptions = {
        method: "GET",
        headers: {
          Cookie: headersObject[".ASPXAUTH"],
        },
        referrer: undefined,
        url: `${CREATIO_ENV}/AddressType?$top=1000&$select=Id,Name&$orderby=Name`,
      };

      axios
        .request(axiosSurveyOptions)
        .then((res) => {
          const addressList = res.data.value.map((address) => {
            return { ...address, label: address.Name };
          });
          resp.status(200).json(addressList);
        })
        .catch((err) => {
          console.log("BGlobal GET ADDRESS TYPE ERR".inverse.bgMagenta, err);
          resp.status(500).json(err);
        });
    })
    .catch((error) => {
      console.error("GET ADDRESS TYPE LOGIN ERROR".inverse.red, error);
      resp.json({
        error: error,
        errorMessage: "GET ADDRESS TYPE LOGIN - ERROR",
      });
    });
});

app.post("/updatecontact", (req, resp) => {
  const {
    Id,
    AccountName,
    Address,
    AddressName,
    CityName,
    CountryName,
    Email,
    JobTitle,
    MobilePhone,
    Name,
    Phone,
    RegionName,
    Zip,
    CityId,
    RegionId,
    CountryId,
    AddressTypeId,
  } = req.body.formData;

  const filteredData = {};

  const formDataObject = {
    Address,
    Email,
    JobTitle,
    MobilePhone,
    Name,
    Phone,
    Zip,
    CityId,
    RegionId,
    CountryId,
    AddressTypeId,
  };

  for (const key in formDataObject) {
    if (formDataObject[key]) {
      filteredData[key] = formDataObject[key];
    }
  }

  const options = {
    method: "POST",
    url: tmpLoginUrl,
    data: tmpData,
  };

  axios
    .request(options)
    .then((response) => {
      const aspxAuthCookie = response.headers["set-cookie"];
      const headersArr = response.headers["set-cookie"];

      const headersObject = getHeadersObject(headersArr);

      const axiosBGlobalSurveyEntityOptions = {
        method: "PATCH",
        headers: {
          Cookie: aspxAuthCookie,
          BPMCSRF: headersObject["BPMCSRF"].slice(8, 30),
        },
        referrer: undefined,
        url: `${CREATIO_ENV}/Contact(${Id})`,
        data: filteredData,
      };

      axios
        .request(axiosBGlobalSurveyEntityOptions)
        .then((res) => {
          console.log("CONTACT UPDATE");

          resp.status(200).json(res.data);
        })
        .catch((err) => {
          console.log("BGlobal CONTACT PATCH ERR".inverse.bgMagenta, err);

          resp
            .status(400)
            .json({ error: true, errorMessage: "UPDATE CONTACT ERROR" });
        });
    })
    .catch((error) => {
      console.error("updateSurveyEntity LOGIN ERROR".inverse.red, error);
      resp.json({
        error: error,
        errorMessage: "updateSurveyEntity LOGIN - ERROR",
      });
    });
});

const updateSurveyEntity = (entityId, BGlobalSurveyEntityData, resp) => {
  const options = {
    method: "POST",
    url: tmpLoginUrl,
    data: tmpData,
  };

  axios
    .request(options)
    .then((response) => {
      const aspxAuthCookie = response.headers["set-cookie"];
      const headersArr = response.headers["set-cookie"];

      const headersObject = getHeadersObject(headersArr);

      const axiosBGlobalSurveyEntityOptions = {
        method: "PATCH",
        headers: {
          Cookie: aspxAuthCookie,
          BPMCSRF: headersObject["BPMCSRF"].slice(8, 30),
        },
        referrer: undefined,
        url: `${CREATIO_ENV}/BGlobalSurveyEntity(${entityId})`,
        data: BGlobalSurveyEntityData,
      };

      axios
        .request(axiosBGlobalSurveyEntityOptions)
        .then((res) => {
          console.log("ENTITY UPDATE");
        })
        .catch((err) => {
          console.log("BGlobalSurveyEntity PATCH ERR".inverse.bgMagenta, err);
        });
    })
    .catch((error) => {
      console.error("updateSurveyEntity LOGIN ERROR".inverse.red, error);
      resp.json({
        error: error,
        errorMessage: "updateSurveyEntity LOGIN - ERROR",
      });
    });
};

app.post("/sendanswer", subir.none(), (req, resp) => {
  const { answer, questionId, type, entityId, isComment, finishSurvey } =
    req.body;

  const options = {
    method: "POST",
    url: tmpLoginUrl,
    data: tmpData,
  };

  axios
    .request(options)
    .then((response) => {
      const aspxAuthCookie = response.headers["set-cookie"];
      const headersArr = response.headers["set-cookie"];

      const headersObject = getHeadersObject(headersArr);

      const axiosEntityOptions = {
        method: "GET",
        headers: {
          Cookie: aspxAuthCookie,
        },
        referrer: undefined,
        url: `${CREATIO_ENV}/BGlobalSurveyEntity(${entityId})?$select=BGlobalSurveyId,BGlobalContactId,BGlobalAccountId,BGlobalDateUpdate,BGlobalIsCompleted,Id`,
      };

      axios
        .request(axiosEntityOptions)
        .then((res) => {
          console.log("TYPE".red, type);
          console.log("QUESTIONID".america, questionId);
          console.log("ANSWER FROM ENTITY".dim, answer);

          let data = {};
          let axiosSendResponseOptions = {};

          if (finishSurvey === true) {
            updateSurveyEntity(
              entityId,
              {
                BGlobalCompleteDate: new Date().toISOString(),
                BGlobalIsCompleted: true,
              },
              resp
            );
          }

          switch (type) {
            case "checkbox":
              const checkboxArray = answer;

              checkboxArray.sort(
                (a, b) => a.BGlobalOrderAnswer - b.BGlobalOrderAnswer
              );

              const checkboxPromises = checkboxArray.map((checkbox) => {
                if (checkbox.selected) {
                  data = {
                    BGlobalSurveyEntityId: entityId,
                    BGlobalQuestionId: questionId,
                    //BGlobalComments : ,
                    BGlobalMenssage: checkbox.BGlobalValueText,
                    BGlobalAnswerId: checkbox.Id,
                    // BGlobalAnswerFilaId: checkbox.Id,
                    //BGlobalAmount : ,
                    //BGlobalDate: ,
                    Id: uuidv4(),
                  };
                } else {
                  data = {
                    BGlobalSurveyEntityId: entityId,
                    BGlobalQuestionId: questionId,
                    //BGlobalComments : ,
                    // BGlobalMenssage: answer[1],
                    // BGlobalAnswerId: checkbox.selected ? checkbox.Id : "",
                    // BGlobalAnswerFilaId: checkbox.selected ? checkbox.Id : "",
                    //BGlobalAmount : ,
                    //BGlobalDate: ,
                    Id: uuidv4(),
                  };
                }
                axiosSendResponseOptions = {
                  method: "POST",
                  headers: {
                    Cookie: aspxAuthCookie,
                    BPMCSRF: headersObject["BPMCSRF"].slice(8, 30),
                  },
                  data: data,
                  url: `${CREATIO_ENV}/BGlobalSurveyResponse`,
                };
                return axios
                  .request(axiosSendResponseOptions)
                  .then((res) => {
                    return {
                      ...res.data,
                      respuesta: {
                        checkbox: checkbox.selected ? checkbox.Id : "",
                        BGlobalQuestionId: questionId,
                      },
                    };
                  })
                  .catch((err) => {
                    console.log(
                      "BGlobalSurveyResponse CHECKBOX ERR".bgRed,
                      err
                    );
                    return err;
                  });
              });

              Promise.all(checkboxPromises).then((pARes) => {
                console.log("checkboxPromises".bgYellow, pARes);
                resp.status(200).json({
                  ...res.data,
                  respuesta: answer,
                  type,
                  answerId: uuidv4(),
                });
              });

              break;

            case "date":
              if (isComment) {
                data = {
                  BGlobalSurveyEntityId: entityId,
                  BGlobalQuestionId: questionId.slice(0, 36),
                  BGlobalComments: answer,
                  //BGlobalMenssage: answer,
                  //BGlobalAnswerId : ,
                  //BGlobalAnswerFilaId : ,
                  //BGlobalAmount : ,
                  //BGlobalDate: ,
                  Id: uuidv4(),
                };
              } else {
                data = {
                  BGlobalSurveyEntityId: entityId,
                  BGlobalQuestionId: questionId,
                  //BGlobalComments : ,
                  //BGlobalMenssage: answer,
                  //BGlobalAnswerId : ,
                  //BGlobalAnswerFilaId : ,
                  //BGlobalAmount : ,
                  BGlobalDate: answer,
                  Id: uuidv4(),
                };
              }

              axiosSendResponseOptions = {
                method: "POST",
                headers: {
                  Cookie: aspxAuthCookie,
                  BPMCSRF: headersObject["BPMCSRF"].slice(8, 30),
                },
                data: data,
                url: `${CREATIO_ENV}/BGlobalSurveyResponse`,
              };

              axios
                .request(axiosSendResponseOptions)
                .then((res) => {
                  resp.status(200).json({ ...res.data, respuesta: answer });
                })
                .catch((err) => {
                  console.log(
                    "BGlobalSurveyResponse SWITCH EMAIL ERR".bgRed,
                    err
                  );
                  resp.status(500).json(err);
                });
              break;

            case "email":
              if (isComment) {
                const respuesta = Object.values(answer);

                data = {
                  BGlobalSurveyEntityId: entityId,
                  BGlobalQuestionId: questionId.slice(0, 36),
                  BGlobalComments: respuesta[0],
                  BGlobalMenssage: respuesta[1] || "",
                  //BGlobalAnswerId : ,
                  //BGlobalAnswerFilaId : ,
                  //BGlobalAmount : ,
                  //BGlobalDate: ,
                  Id: uuidv4(),
                };
              } else {
                data = {
                  BGlobalSurveyEntityId: entityId,
                  BGlobalQuestionId: questionId,
                  //BGlobalComments : ,
                  BGlobalMenssage: answer,
                  //BGlobalAnswerId : ,
                  //BGlobalAnswerFilaId : ,
                  //BGlobalAmount : ,
                  //BGlobalDate: ,
                  Id: uuidv4(),
                };
              }

              axiosSendResponseOptions = {
                method: "POST",
                headers: {
                  Cookie: aspxAuthCookie,
                  BPMCSRF: headersObject["BPMCSRF"].slice(8, 30),
                },
                data: data,
                url: `${CREATIO_ENV}/BGlobalSurveyResponse`,
              };

              axios
                .request(axiosSendResponseOptions)
                .then((res) => {
                  resp.status(200).json({ ...res.data, respuesta: answer });
                })
                .catch((err) => {
                  console.log(
                    "BGlobalSurveyResponse SWITCH EMAIL ERR".bgRed,
                    err
                  );
                  resp.status(500).json(err);
                });
              break;

            case "float":
            case "int":
              if (isComment) {
                const respuesta = Object.values(answer);

                data = {
                  BGlobalSurveyEntityId: entityId,
                  BGlobalQuestionId: questionId,
                  BGlobalComments: respuesta[1],
                  //BGlobalAnswerId : ,
                  //BGlobalAnswerFilaId : ,
                  BGlobalAmount: Number(respuesta[0]),
                  //BGlobalDate: ,
                  Id: uuidv4(),
                };
              } else {
                data = {
                  BGlobalSurveyEntityId: entityId,
                  BGlobalQuestionId: questionId,
                  //BGlobalComments : ,
                  //BGlobalMenssage: answer,
                  //BGlobalAnswerId : ,
                  //BGlobalAnswerFilaId : ,
                  BGlobalAmount: Number(answer),
                  //BGlobalDate: ,
                  Id: uuidv4(),
                };
              }

              axiosSendResponseOptions = {
                method: "POST",
                headers: {
                  Cookie: aspxAuthCookie,
                  BPMCSRF: headersObject["BPMCSRF"].slice(8, 30),
                },
                data: data,
                url: `${CREATIO_ENV}/BGlobalSurveyResponse`,
              };

              axios
                .request(axiosSendResponseOptions)
                .then((res) => {
                  resp.status(200).json({ ...res.data, respuesta: answer });
                })
                .catch((err) => {
                  console.log(
                    "BGlobalSurveyResponse SWITCH INT/FLOAT ERR".bgRed,
                    err
                  );
                  resp.status(500).json(err);
                });
              break;

            case "list":
            case "ranking":
            case "matrizs":
              if (isComment) {
                data = {
                  BGlobalSurveyEntityId: entityId,
                  BGlobalQuestionId: questionId.slice(0, 36),
                  BGlobalComments: answer,
                  //BGlobalMenssage: answer,
                  //BGlobalAnswerId : ,
                  //BGlobalAnswerFilaId : ,
                  //BGlobalAmount : ,
                  //BGlobalDate: ,
                  Id: uuidv4(),
                };
              } else {
                data = {
                  BGlobalSurveyEntityId: entityId,
                  BGlobalQuestionId: questionId,
                  //BGlobalComments : ,
                  BGlobalMenssage: Object.values(answer)[0],
                  BGlobalAnswerId: Object.keys(answer)[0],
                  //BGlobalAnswerFilaId : ,
                  //BGlobalAmount : ,
                  //BGlobalDate: ,
                  Id: uuidv4(),
                };
              }

              axiosSendResponseOptions = {
                method: "POST",
                headers: {
                  Cookie: aspxAuthCookie,
                  BPMCSRF: headersObject["BPMCSRF"].slice(8, 30),
                },
                data: data,
                url: `${CREATIO_ENV}/BGlobalSurveyResponse`,
              };

              axios
                .request(axiosSendResponseOptions)
                .then((res) => {
                  resp.status(200).json({
                    ...res.data,
                    answerId: uuidv4(),
                    BGlobalQuestionId: questionId,
                    respuesta: answer,
                    type,
                  });
                })
                .catch((err) => {
                  console.log(
                    `BGlobalSurveyResponse SWITCH ${type.toUpperCase()} ERR`
                      .bgRed,
                    err
                  );
                  resp.status(500).json(err);
                });
              break;

            case "matriz":
            case "matrizi":
              const answersMatrizArray = Object.entries(answer.answer);

              const asnwersMatrizPromises = answersMatrizArray.map((answer) => {
                data = {
                  BGlobalSurveyEntityId: entityId,
                  BGlobalQuestionId: questionId,
                  //BGlobalComments : ,
                  //BGlobalMenssage: answer[1],
                  BGlobalAnswerId: answer[1].slice(-36),
                  BGlobalAnswerFilaId: answer[0],
                  //BGlobalAmount : ,
                  //BGlobalDate: ,
                  Id: uuidv4(),
                };

                axiosSendResponseOptions = {
                  method: "POST",
                  headers: {
                    Cookie: aspxAuthCookie,
                    BPMCSRF: headersObject["BPMCSRF"].slice(8, 30),
                  },
                  data: data,
                  url: `${CREATIO_ENV}/BGlobalSurveyResponse`,
                };

                return axios
                  .request(axiosSendResponseOptions)
                  .then((res) => {
                    return {
                      ...res.data,
                      respuesta: {
                        [answer[0]]: answer[1],
                        BGlobalQuestionId: questionId,
                      },
                    };
                  })
                  .catch((err) => {
                    console.log("BGlobalSurveyResponse ERR".bgRed, err);
                    return err;
                  });
              });

              Promise.all(asnwersMatrizPromises).then((pARes) => {
                console.log("asnwersMatrizPromises".bgYellow, pARes);
                resp.status(200).json({
                  ...res.data,
                  respuesta: answer,
                  type,
                  answerId: uuidv4(),
                });
              });

              break;

            case "qtxtmulti":
              const answersArray = Object.entries(answer);

              answersArray.sort((a, b) => a[1].order - b[1].order);

              const asnwersPromises = answersArray.map((answer) => {
                data = {
                  BGlobalSurveyEntityId: entityId,
                  BGlobalQuestionId: questionId,
                  //BGlobalComments : ,
                  BGlobalMenssage: answer[1].resp,
                  BGlobalAnswerId: answer[0],
                  //BGlobalAnswerFilaId : ,
                  //BGlobalAmount : ,
                  //BGlobalDate: ,
                  Id: uuidv4(),
                };
                axiosSendResponseOptions = {
                  method: "POST",
                  headers: {
                    Cookie: aspxAuthCookie,
                    BPMCSRF: headersObject["BPMCSRF"].slice(8, 30),
                  },
                  data: data,
                  url: `${CREATIO_ENV}/BGlobalSurveyResponse`,
                };
                return axios
                  .request(axiosSendResponseOptions)
                  .then((res) => {
                    return {
                      ...res.data,
                      respuesta: {
                        [answer[0]]: answer[0],
                        BGlobalQuestionId: questionId,
                      },
                    };
                  })
                  .catch((err) => {
                    console.log("BGlobalSurveyResponse ERR".bgRed, err);
                    return err;
                  });
              });

              Promise.all(asnwersPromises).then((pARes) => {
                console.log("asnwersPromises".zebra, pARes);
                resp.status(200).json({
                  ...res.data,
                  respuesta: answer,
                  type,
                  answerId: uuidv4(),
                });
              });

              break;

            case "txt":
              if (isComment) {
                const respuesta = Object.values(answer);

                data = {
                  BGlobalSurveyEntityId: entityId,
                  BGlobalQuestionId: questionId,
                  BGlobalComments: respuesta[1],
                  BGlobalMenssage: respuesta[0],
                  //BGlobalAnswerId : ,
                  //BGlobalAnswerFilaId : ,
                  //BGlobalAmount: Number(respuesta[0]),
                  //BGlobalDate: ,
                  Id: uuidv4(),
                };
              } else {
                data = {
                  BGlobalSurveyEntityId: entityId,
                  BGlobalQuestionId: questionId,
                  //BGlobalComments : ,
                  BGlobalMenssage: answer,
                  //BGlobalAnswerId : ,
                  //BGlobalAnswerFilaId : ,
                  //BGlobalAmount: answer,
                  //BGlobalDate: ,
                  Id: uuidv4(),
                };
              }

              axiosSendResponseOptions = {
                method: "POST",
                headers: {
                  Cookie: aspxAuthCookie,
                  BPMCSRF: headersObject["BPMCSRF"].slice(8, 30),
                },
                data: data,
                url: `${CREATIO_ENV}/BGlobalSurveyResponse`,
              };

              axios
                .request(axiosSendResponseOptions)
                .then((res) => {
                  resp.status(200).json({ ...res.data, respuesta: answer });
                })
                .catch((err) => {
                  console.log(
                    "BGlobalSurveyResponse SWITCH TXT ERR".bgRed,
                    err
                  );
                  resp.status(500).json(err);
                });
              break;

            default:
              if (isComment) {
                data = {
                  BGlobalSurveyEntityId: entityId,
                  BGlobalQuestionId: questionId.slice(0, 36),
                  BGlobalComments: answer,
                  //BGlobalAnswerId : ,
                  //BGlobalAnswerFilaId : ,
                  //BGlobalAmount : ,
                  //BGlobalDate: ,
                  Id: uuidv4(),
                };
              } else {
                data = {
                  BGlobalSurveyEntityId: entityId,
                  BGlobalQuestionId: questionId,
                  //BGlobalComments : ,
                  BGlobalMenssage: answer,
                  //BGlobalAnswerId : ,
                  //BGlobalAnswerFilaId : ,
                  //BGlobalAmount : ,
                  //BGlobalDate: ,
                  Id: uuidv4(),
                };
              }

              axiosSendResponseOptions = {
                method: "POST",
                headers: {
                  Cookie: aspxAuthCookie,
                  BPMCSRF: headersObject["BPMCSRF"].slice(8, 30),
                },
                data: data,
                url: `${CREATIO_ENV}/BGlobalSurveyResponse`,
              };

              axios
                .request(axiosSendResponseOptions)
                .then((res) => {
                  resp.status(200).json({ ...res.data, respuesta: answer });
                })
                .catch((err) => {
                  console.log(
                    "BGlobalSurveyResponse SWITCH DEFAULT ERR".bgRed,
                    err
                  );
                  resp.status(500).json(err);
                });
              break;
          }
        })
        .catch((err) => {
          console.log("BGlobalSurveyEntity ERR", err);
          resp.status(500).json(err);
        });
    })
    .catch((error) => {
      console.error("GET ANSWER LOGIN ERROR".inverse.red, error);
      resp.json({ error: error, errorMessage: "GET ANSWER LOGIN - ERROR" });
    });
});

app.post("/sendmultiplefileanswer", subir.array("files"), (req, resp) => {
  const { questionId, entityId, finishSurvey } = req.body;
  const files = req.body.files;

  const options = {
    method: "POST",
    url: tmpLoginUrl,
    data: tmpData,
  };

  axios
    .request(options)
    .then((response) => {
      const aspxAuthFileCookie = response.headers["set-cookie"];
      const headersArr = response.headers["set-cookie"];

      const headersObject = getHeadersObject(headersArr);

      if (finishSurvey) {
        updateSurveyEntity(
          entityId,
          {
            BGlobalCompleteDate: new Date().toISOString(),
            BGlobalIsCompleted: true,
          },
          resp
        );
      }

      const axiosEntityOptions = {
        method: "GET",
        headers: {
          Cookie: aspxAuthFileCookie,
        },
        referrer: undefined,
        url: `${CREATIO_ENV}/BGlobalSurveyEntity(${entityId})?$select=BGlobalSurveyId,BGlobalContactId,BGlobalAccountId,BGlobalDateUpdate,BGlobalIsCompleted,Id`,
      };

      axios
        .request(axiosEntityOptions)
        .then(() => {
          const respuestaId = uuidv4();
          const data = {
            BGlobalSurveyEntityId: entityId,
            BGlobalQuestionId: questionId,
            Id: respuestaId,
          };

          const axiosSendResponseOptions = {
            method: "POST",
            headers: {
              Cookie: aspxAuthFileCookie,
              BPMCSRF: headersObject["BPMCSRF"].slice(8, 30),
            },
            data: data,
            url: `${CREATIO_ENV}/BGlobalSurveyResponse`,
          };

          axios
            .request(axiosSendResponseOptions)
            .then((res) => {
              if (files) {
                const uploadFile = async (file) => {
                  const axiosSendMultiplesFilesResponseOptions = {
                    method: "POST",
                    maxBodyLength: Infinity,
                    url: `${CREATIO_URL}/0/rest/FileApiService/UploadFile`,
                    headers: {
                      BPMCSRF: headersObject["BPMCSRF"].slice(8, 30),
                      "Content-Length": file.size,
                      "Content-Range": `bytes 0-${file.size - 1}/${file.size}`,
                      Cookie: aspxAuthFileCookie,
                    },
                    params: {
                      fileId: uuidv4(),
                      columnName: "Data",
                      fileName: file.originalname,
                      parentColumnName: "BGlobalSurveyResponse",
                      parentColumnValue: respuestaId,
                      entitySchemaName: "BGlobalSurveyResponseFile",
                      mimeType:
                        "application%2Fvnd.openxmlformats-officedocument.wordprocessingml.document",
                      totalFileLength: file.size,
                    },
                    data: { "application/octet-stream": file.buffer },
                  };

                  try {
                    const resArray = await axios.request(
                      axiosSendMultiplesFilesResponseOptions
                    );
                    return resArray.data;
                  } catch (err) {
                    console.log(
                      "axiosSendMultiplesFilesResponseOptions ERR".red,
                      err
                    );
                    return err;
                  }
                };

                const uploadFiles = async (files) => {
                  const requestsArray = Object.values(files).map(uploadFile);
                  const results = await Promise.all(requestsArray);
                  return results;
                };

                uploadFiles(files)
                  .then((pARes) => {
                    resp.status(200).json({
                      ...res.data,
                      respuesta: pARes,
                      answerId: uuidv4(),
                    });
                  })
                  .catch((err) => {
                    console.error("Error uploading multiple files".red, err);
                    resp.status(500).json({ error: "Internal Server Error" });
                  });
              } else {
                resp.status(400).json({ message: "error files" });
              }
            })
            .catch((err) => {
              console.log("BGlobalSurveyResponse ERR".bgRed, err);
              resp.status(500).json(err);
            });
        })
        .catch((err) => {
          console.log("BGlobalSurveyEntity ERR", err);
          resp.status(500).json(err);
        });
    })
    .catch((error) => {
      console.error("GET ANSWER LOGIN ERROR".inverse.red, error);
      resp.json({ error: error, errorMessage: "GET ANSWER LOGIN - ERROR" });
    });
});

app.post("/sendsinglefileanswer", subir.single("archivo"), (req, resp) => {
  const file = req.body.file;
  const { questionId, entityId, finishSurvey } = req.body;

  const options = {
    method: "POST",
    url: tmpLoginUrl,
    data: tmpData,
  };

  axios
    .request(options)
    .then((response) => {
      const aspxFileAuthCookie = response.headers["set-cookie"];
      const headersArr = response.headers["set-cookie"];

      const headersObject = getHeadersObject(headersArr);

      if (finishSurvey) {
        updateSurveyEntity(
          entityId,
          {
            BGlobalCompleteDate: new Date().toISOString(),
            BGlobalIsCompleted: true,
          },
          resp
        );
      }

      const respuestaId = uuidv4();

      const data = {
        BGlobalSurveyEntityId: entityId,
        BGlobalQuestionId: questionId,
        Id: respuestaId,
      };

      const axiosSendResponseOptions = {
        method: "POST",
        headers: {
          Cookie: aspxFileAuthCookie,
          BPMCSRF: headersObject["BPMCSRF"].slice(8, 30),
        },
        data: data,
        url: `${CREATIO_ENV}/BGlobalSurveyResponse`,
      };

      axios
        .request(axiosSendResponseOptions)
        .then(() => {
          const axiosSendFileResponseOptions = {
            method: "POST",
            maxBodyLength: Infinity,
            url: `${CREATIO_URL}/0/rest/FileApiService/UploadFile`,
            headers: {
              BPMCSRF: headersObject["BPMCSRF"].slice(8, 30),
              // "Content-Disposition": `attachment; filename=${file?.originalname}`,
              "Content-Length": file?.size, //cambiar
              "Content-Range": `bytes 0-${file?.size - 1}/${file?.size}`,
              Cookie: aspxFileAuthCookie,
            },
            params: {
              fileId: uuidv4(),
              columnName: "Data",
              fileName: `${file?.originalname}`,
              parentColumnName: "BGlobalSurveyResponse",
              parentColumnValue: respuestaId, //id del BGlobalSurveyResponse
              entitySchemaName: "BGlobalSurveyResponseFile",
              mimeType:
                "application%2Fvnd.openxmlformats-officedocument.wordprocessingml.document",
              totalFileLength: file?.size || 6083, //size del archivo
            },
            data: { "application/octet-stream": file?.buffer },
          };

          axios
            .request(axiosSendFileResponseOptions)
            .then((res) => {
              console.log("axiosSendFileResponseOptions RES".green, res.data);
              resp.status(200).json(res.data);
            })
            .catch((err) => {
              console.log("axiosSendFileResponseOptions ERR".red, err);
              resp.status(500).json(err);
            });
        })
        .catch((err) => {
          console.log("BGlobalSurveyResponse FILE ERR".bgRed, err);
          resp.status(500).json(err);
        });
    })
    .catch((error) => {
      console.error("GET ANSWER LOGIN ERROR".inverse.red, error);
      resp.json({ error: error, errorMessage: "GET ANSWER LOGIN - ERROR" });
    });
});

const getAnswer = (preguntaId, currentPageId, surveyAnswers, surveyId) => {
  if (!surveyAnswers?.[surveyId]?.[currentPageId]?.[preguntaId]) {
    return undefined;
  }

  return surveyAnswers[surveyId][currentPageId][preguntaId];
};

const enviarRespuestas = async (req, resp) => {
  const { entityId, surveyId } = req.body;
  const pagesList = JSON.parse(req.body.pagesList);
  const questions = JSON.parse(req.body.questions);
  const surveyAnswers = JSON.parse(req.body.surveyAnswers);

  //@ts-ignore
  const archivos = req.files["files"];

  //@ts-ignore
  const archivo = req.files["file"] ? req.files["file"][0] : null;

  if (questions.length > 0) {
    let answersPromises = [];
    const todosQuestionsIds = [];

    for (let index = 0; index < pagesList.length; index++) {
      const currentPageId = pagesList[index];
      todosQuestionsIds.push(
        ...Object.keys(surveyAnswers[surveyId][currentPageId])
      );
    }

    if (todosQuestionsIds && todosQuestionsIds.length > 0) {
      const answersArray = todosQuestionsIds.reduce(
        (acc, questionId, index) => {
          const question = questions.find(
            (question) =>
              question.Id === questionId ||
              question.Id === `${questionId}-comment`
          );

          const getCurrentPageId = (questionID) => {
            for (const currentPageId in surveyAnswers[surveyId]) {
              const question = surveyAnswers[surveyId][currentPageId];
              for (const subQuestionId in question) {
                if (subQuestionId === questionID) {
                  return currentPageId;
                }
              }
            }
            return null;
          };

          if (question && question.BGlobalType.Description !== "label") {
            const answer = getAnswer(
              questionId,
              getCurrentPageId(questionId) || "",
              surveyAnswers,
              surveyId
            );

            acc.push({
              answer: answer,
              questionId,
              type: question.BGlobalType.Description,
              entityId,
              isComment: false,
              finishSurvey: index + 1 === todosQuestionsIds.length,
            });
          }

          const commentQuestion = questions.find(
            (question) => `${question.Id}-comment` === questionId
          );

          if (commentQuestion) {
            const answer = getAnswer(
              questionId,
              getCurrentPageId(questionId) || "",
              surveyAnswers,
              surveyId
            );

            const commentAnswer = acc.find(
              (val) => val.questionId === commentQuestion.Id
            );

            if (commentAnswer) {
              commentAnswer.answer = {
                answer: commentAnswer.answer,
                comment: answer,
              };
              commentAnswer.isComment = true;
            }
          }

          return acc;
        },
        []
      );

      for (const answer of answersArray) {
        if (answer.type === "mupload" && archivos && archivos.length > 0) {
          const multipleFilesData = {
            files: archivos,
            type: answer.type,
            questionId: answer.questionId,
            entityId,
            finishSurvey: answer.finishSurvey,
          };

          try {
            const response = await axios.post(
              `${process.env.REACT_APP_DO_URL}/sendmultiplefileanswer`,
              multipleFilesData
            );
            console.log(response.data);
            answersPromises.push(response.data);
          } catch (err) {
            console.error("postanswers sendmultiplefileanswer - error ", err);
          }
        } else if (answer.type === "upload" && archivo) {
          const singleFileData = {
            file: archivo,
            type: answer.type,
            questionId: answer.questionId,
            entityId,
            finishSurvey: answer.finishSurvey,
          };

          try {
            const response = await axios.post(
              `${process.env.REACT_APP_DO_URL}/sendsinglefileanswer`,
              singleFileData
            );
            console.log(response.data);
            answersPromises.push(response.data);
          } catch (err) {
            console.error("postanswers sendsinglefileanswer - error ", err);
          }
        } else if (answer.type === "matriz" || answer.type === "matrizi") {
          try {
            const response = await axios.post(
              `${process.env.REACT_APP_DO_URL}/sendanswer`,
              {
                type: answer.type,
                answer,
                questionId: answer.questionId,
                entityId,
                isComment: answer.isComment,
                finishSurvey: answer.finishSurvey,
              }
            );
            console.log(response.data);
            answersPromises.push(response.data);
          } catch (err) {
            console.error(
              "postanswers sendanswer matriz matrizi - error ",
              err
            );
          }
        } else if (answer.type === "int") {
          const data = {
            type: answer.type,
            answer: answer.answer,
            questionId: answer.questionId,
            entityId,
            isComment: answer.isComment,
            finishSurvey: answer.finishSurvey,
          };

          try {
            const response = await axios.post(
              `${process.env.REACT_APP_DO_URL}/sendanswer`,
              data
            );
            console.log(response.data);
            answersPromises.push(response.data);
          } catch (err) {
            console.error("postanswers sendanswer int - error ", err);
          }
        } else {
          try {
            const response = await axios.post(
              `${process.env.REACT_APP_DO_URL}/sendanswer`,
              answer
            );
            console.log(response.data);
            answersPromises.push(response.data);
          } catch (err) {
            console.error("postanswers sendanswer default - error ", err);
          }
        }
      }

      try {
        const results = await Promise.all(answersPromises);
        resp.json(results);
      } catch (err) {
        console.error("postanswers answersPromises - error ", err);
        resp.sendStatus(500);
      }
    } else {
      resp.sendStatus(400).json({
        message: `todosQuestionsIds.length ${todosQuestionsIds?.length}`,
      });
    }
  } else {
    resp.status(400).json({ message: `question.length ${questions?.length}` });
  }
};

app.post(
  "/enviarRespuestas",
  subir.fields([{ name: "file", maxCount: 1 }, { name: "files" }]),
  enviarRespuestas
);

app.post("/savestyles", (req, resp) => {
  const {
    answerBC,
    answerFC,
    answerFT,
    questionFC,
    questionFT,
    titleFC,
    titleFT,
    surveyBC,
    surveyFC,
    surveyFT,
    surveyId,
  } = req.body;

  const options = {
    method: "POST",
    url: tmpLoginUrl,
    data: tmpData,
  };

  axios
    .request(options)
    .then((response) => {
      const aspxAuthCookie = response.headers["set-cookie"];

      const headersArr = response.headers["set-cookie"];

      const headersObject = getHeadersObject(headersArr);

      const styleId = uuidv4();

      const stylesData = JSON.stringify({
        BGAnswerBC: answerBC,
        BGAnswerFC: answerFC,
        BGAnswerFT: answerFT,
        BGQuestionFC: questionFC,
        BGQuestionFT: questionFT,
        BGSurveyBC: surveyBC,
        BGSurveyFC: surveyFC,
        BGSurveyFT: surveyFT,
        BGSurveyId: surveyId,
        BGTitleFC: titleFC,
        BGTitleFT: titleFT,
        Id: styleId,
      });

      const axiosSurveyStyleOptions = {
        method: "POST",
        headers: {
          Cookie: aspxAuthCookie,
          BPMCSRF: headersObject["BPMCSRF"].slice(8, 30),
          "Content-Type": "application/json",
        },
        url: `${CREATIO_ENV}/BGlobalSurveyStyle`,
        data: stylesData,
      };

      axios
        .request(axiosSurveyStyleOptions)
        .then((res) => {
          console.log("SAVE STYLES".inverse.green, res.data);
          resp.status(200).json({
            ...res.data,
            message: "Estilos guardados exitosamente",
            styleId,
          });
        })
        .catch((err) => {
          console.log("SAVE STYLES ERR".inverse.bgMagenta, err);
          resp.status(500).json(err);
        });
    })
    .catch((error) => {
      console.error("SAVE STYLES LOGIN ERROR".inverse.red, error);
      resp.json({ error: error, errorMessage: "SAVE STYLES LOGIN - ERROR" });
    });
});

app.post("/getstyles", (req, resp) => {
  const { surveyId } = req.body;

  const options = {
    method: "POST",
    url: tmpLoginUrl,
    data: tmpData,
  };

  axios
    .request(options)
    .then((response) => {
      const headersArr = response.headers["set-cookie"];

      const headersObject = getHeadersObject(headersArr);

      const axiosSurveyOptions = {
        method: "GET",
        headers: {
          Cookie: headersObject[".ASPXAUTH"],
        },
        referrer: undefined,
        url: `${CREATIO_ENV}/BGlobalSurveyStyle?$filter=BGSurvey/Id eq ${surveyId}&orderBy=CreatedOn desc`,
      };

      const styleId = uuidv4();

      const defaultStyle = {
        Id: styleId,
        CreatedOn: "2023-07-19T15:23:42.788897Z",
        CreatedById: "239d148e-ec46-437a-88f2-0964ab324e03",
        ModifiedOn: "2023-07-19T15:23:42.788897Z",
        ModifiedById: "239d148e-ec46-437a-88f2-0964ab324e03",
        ProcessListeners: 0,
        BGSurveyId: "26892f19-bcc0-4431-820c-63a3c9f43a78",
        BGTitleFT: "Paytone One",
        BGTitleFC: "#000000",
        BGSurveyFT: "Hanken Grotesk",
        BGSurveyFC: "#4a90e2",
        BGSurveyBC: "#bd10e0",
        BGQuestionFT: "Hanken Grotesk",
        BGQuestionFC: "#000000",
        BGAnswerFT: "Hanken Grotesk",
        BGAnswerFC: "#000000",
        BGAnswerBC: "#000000",
      };

      axios
        .request(axiosSurveyOptions)
        .then((res) => {
          resp.status(200).json(res.data.value.slice(-1)[0] || defaultStyle);
        })
        .catch((err) => {
          console.log("BGlobalSurvey GET STYLES ERR".inverse.bgMagenta, err);
          resp.status(500).json(err);
        });
    })
    .catch((error) => {
      console.error("GET SURVEY STYLES LOGIN ERROR".inverse.red, error);
      resp.json({ error: error, errorMessgae: "GET SURVEY LOGIN - ERROR" });
    });
});

app.post("/getlanguage", (req, resp) => {
  const { surveyId } = req.body;

  const options = {
    method: "POST",
    url: tmpLoginUrl,
    data: tmpData,
  };

  axios
    .request(options)
    .then((response) => {
      const headersArr = response.headers["set-cookie"];

      const headersObject = getHeadersObject(headersArr);

      const axiosSurveyOptions = {
        method: "GET",
        headers: {
          Cookie: headersObject[".ASPXAUTH"],
        },
        referrer: undefined,
        url: `${CREATIO_ENV}/BGlobalSurvey(${surveyId})/BGlobalLanguage`,
      };

      axios
        .request(axiosSurveyOptions)
        .then((res) => {
          resp.status(200).json(res.data);
        })
        .catch((err) => {
          console.log("BGlobalSurvey LANGUAGE ERR".inverse.bgMagenta, err);
          resp.status(500).json(err);
        });
    })
    .catch((error) => {
      console.error("GET SURVEY LOGIN ERROR".inverse.red, error);
      resp.json({ error: error, errorMessgae: "GET SURVEY LOGIN - ERROR" });
    });
});

app.post("/validatekey", (req, resp) => {
  const { surveyId } = req.body;

  const options = {
    method: "POST",
    url: tmpLoginUrl,
    data: tmpData,
  };

  axios
    .request(options)
    .then((response) => {
      const headersArr = response.headers["set-cookie"];

      const headersObject = getHeadersObject(headersArr);

      const axiosSurveyOptions = {
        method: "GET",
        headers: {
          Cookie: headersObject[".ASPXAUTH"],
        },
        referrer: undefined,
        //url: `${CREATIO_ENV}/BGlobalSurvey(${surveyId})?$expand=BGlobalSurveyConfig($select=BGlobalAPIKEY)&$select=BGlobalSurveyConfig`,
        url: `${CREATIO_ENV}/BGlobalSurvey(${surveyId})?$expand=BGlobalSurveyConfig($select=BGlobalAPIKEY)`,
      };

      axios
        .request(axiosSurveyOptions)
        .then((res) => {
          axios
            .post(
              "https://licenses.bglobalsolutions.com/license/ValidateLicense",
              {
                apiKey: res.data.BGlobalSurveyConfig.BGlobalAPIKEY,
                functionality: 1,
                cultureInfo: "en",
                userName: tmpData.UserName,
                urlSite: CREATIO_URL,
              }
            )
            .then((resVK) => {
              resp.status(200).json({ isValidKey: resVK.data.result });
            })
            .catch((errVK) => {
              resp.status(500).json(errVK);
            });
        })
        .catch((err) => {
          console.log("BGlobalSurvey VALIDATE KEY ERR".inverse.bgMagenta, err);
          console.log("BGlobalSurvey VALIDATE KEY ERR".inverse.bgRed, axiosSurveyOptions);
          resp.status(500).json(err);
        });
    })
    .catch((error) => {
      console.error("GET SURVEY LOGIN ERROR".inverse.red, error);
      resp.json({ error: error, errorMessgae: "GET SURVEY LOGIN - ERROR" });
    });
});

app.post("/getimage", (req, resp) => {
  const { imageId } = req.body;

  const options = {
    method: "POST",
    url: tmpLoginUrl,
    data: tmpData,
  };

  axios
    .request(options)
    .then((response) => {
      const headersArr = response.headers["set-cookie"];

      const headersObject = getHeadersObject(headersArr);

      const axiosSurveyOptions = {
        method: "GET",
        headers: {
          Cookie: headersObject[".ASPXAUTH"],
        },
        url: `${CREATIO_URL}/0/rest/FileService/GetFile/9f808060-3903-4d1b-81c1-33e9a8f83e21/${imageId}`,
        responseType: "arraybuffer",
      };

      axios
        .request(axiosSurveyOptions)
        .then((res) => {
          resp
            .status(200)
            .json(Buffer.from(res.data, "binary").toString("base64"));
        })
        .catch((err) => {
          console.log("GET_IMAGE ERR".inverse.bgMagenta, err);
          resp.status(500).json(err);
        });
    })
    .catch((error) => {
      console.error("GET IMAGE LOGIN ERROR".inverse.red, error);
      resp.json({ error: error, errorMessage: "GET IMAGE LOGIN - ERROR" });
    });
});

app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.listen(SERVER_PORT, () =>
  console.log(`Server is running on port ${SERVER_PORT}`.inverse.yellow)
);
