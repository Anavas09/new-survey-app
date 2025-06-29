//Tipado del tipo BGlobalQuestionDescriptionType para el tipo de preguntas
interface BGlobalQuestionDescriptionType {
  Id: string;
  Name: string;
  CreatedOn: string;
  CreatedById: string;
  ModifiedOn: string;
  ModifiedById: string;
  ProcessListeners: number;
  Description: QuestionType;
}

//Tipado del tipo BGlobalAnswerDescriptionType para el tipo de preguntas
export interface BGlobalAnswerDescriptionType {
  Id: string
  Name: string
  CreatedOn: string
  CreatedById: string
  ModifiedOn: string
  ModifiedById: string
  ProcessListeners: number
  Description: string
}

export type QuestionType =
  | "checkbox"
  | "email"
  | "date"
  | "float"
  | "int"
  | "label"
  | "list"
  | "matriz"
  | "matrizi"
  | "matrizs"
  | "mupload"
  | "qtxtmulti"
  | "radiobutton"
  | "txtmulti"
  | "ranking"
  | "txt"
  | "upload";

//Tipado de la configuración de la encuesta
interface BGlobalSurveyConfig {
  Id: string;
  CreatedOn: Date;
  CreatedById: string;
  ModifiedOn: Date;
  ModifiedById: string;
  ProcessListeners: number;
  BGlobalCompanyName: string;
  BGlobalIsActive: boolean;
  BGlobalEmailFrom: string;
  BGlobalEmailSurveyURL: string;
  BGlobalAPIKEY: string;
  BGlobalEnableSSL: boolean;
  BGlobalEmailConfigId: string;
}

//Encuesta
export type BGlogalSurveyType = {
  "@odata.context": string;
  Id: string;
  CreatedOn: Date;
  CreatedById: string;
  ModifiedOn: Date;
  ModifiedById: string;
  ProcessListeners: number;
  BGAverageResponse: number;
  BGBackgroundId: string;
  BGCMediaResponse: number;
  BGDefaultProcessId: string;
  BGDefaultProcessName: string;
  BGFooter: string;
  BGHighThreshold: number;
  BGlobalEmailSubject: string;
  BGlobalEnableAccount: boolean;
  BGlobalEnableCampaign: boolean;
  BGlobalEnableContact: boolean;
  BGlobalEnableOrder: boolean;
  BGlobalIsActive: boolean;
  BGlobalLanguageId: string;
  BGlobalResponseDeadLine: Date;
  BGlobalSurveyCode: string;
  BGlobalSurveyConfig: BGlobalSurveyConfig;
  BGlobalSurveyConfigId: string;
  BGlobalSurveyDescription: string;
  BGlobalSurveyFrom: Date;
  BGlobalSurveyImageId: string;
  BGlobalSurveyName: string;
  BGlobalSurveyTo: Date;
  BGlobalTemplateEmailId: string;
  BGlobalUpdateData: boolean;
  BGMailSendingProcessId: string;
  BGMailSendingProcessName: string;
  BGMediumThreshold: number;
};

//Páginas
export type BGlobalPagesType = {
  Id: string;
  CreatedOn: Date;
  CreatedById: string;
  ModifiedOn: Date;
  ModifiedById: string;
  ProcessListeners: number;
  BGlobalSurveyIdId: string;
  BGlobalTitle: string;
  BGlobalSubTitle: string;
  BGlobalDescription: string;
  BGlobalIsActive: boolean;
  BGlobalOrderPage: number;
  BGlobalShowTitle: boolean;
  BGIdSource: string;
};

//Listado de Preguntas
export type BGlobalQuestionListType = {
  "@odata.context": string;
  value: BGlobalQuestionType[];
};

//Pregunta
export type BGlobalQuestionType = {
  Id: string;
  BGlobalQuestion: string;
  BGlobalLabel1: string;
  BGlobalLabel2: string;
  BGlobalOrderQuestion: number;
  BGlobalIsRequired: boolean;
  BGlobalAddValueNa: boolean;
  BGlobalAddComment: boolean;
  BGlobalShowOrder: boolean;
  BGlobalDependenceQuestionId: string;
  BGlobalDependenceResponseId: string;
  BGlobalQuestionPageOrder: number;
  BGlobalSurveyImageId: string;
  BGlobalType: BGlobalQuestionDescriptionType;
};

//Listado de Respuestas/Opciones
export type BGlobalAnswerListType = {
  "@odata.context": string;
  value: BGlobalAnswerType[];
};

//Respuestas/Opciones
export type BGlobalAnswerType = {
  Id: string
  BGlobalQuestionId: string
  BGlobalValueText: string
  BGlobalIsDefault: boolean
  BGlobalOrderAnswer: number
  BGlobalImageId: string
  BGlobalEndSurvey: boolean
  BGlobalType: BGlobalAnswerDescriptionType
  rightLabel?:string
  leftLabel?:string
}

//Idioma
export type BGlobalLanguageType = {
  "@odata.context": string;
  Id: string;
  Name: string;
  CreatedOn: string;
  CreatedById: string;
  ModifiedOn: string;
  ModifiedById: string;
  ProcessListeners: number;
  Description: string;
  BGlobalCode: string;
};
