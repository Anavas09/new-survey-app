import { create } from "zustand";
import { devtools, persist, createJSONStorage } from "zustand/middleware";

type SurveyState = {
  answers: any;
};

type SurveyAction = {
  setAnswers: (questionId: string, answers: SurveyState["answers"]) => void;
};

const useSurveyStore = create<SurveyState & SurveyAction>()(
  devtools(
    persist(
      (set, get) => ({
        answers: {}, // Guardará las respuestas con la estructura { questionId: respuesta }

        setAnswers: (questionId, answer) =>
          set((state) => ({
            answers: {
              ...state.answers,
              [questionId]: answer,
            },
          })),

        // Opcional: resetea todas las respuestas
        resetAnswers: () => set({ answers: {} }),
      }),
      {
        name: "survey-storage-test",
        storage: createJSONStorage(() => localStorage),
      }
    )
  )
);

export default useSurveyStore;
