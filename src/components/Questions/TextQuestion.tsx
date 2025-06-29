import React, { useState } from "react";
import { TextField } from "@mui/material";

import { BGlobalQuestionType } from "../../types";

type TextQuestionType = {
  question: BGlobalQuestionType;
};

const TextQuestion: React.FC<TextQuestionType> = ({ question }) => {
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState(false);

  const validate = (value: string) => {
    // Supongamos que el mínimo requerido es de 5 caracteres
    if (value.length < 5) {
      setError(true);
    } else {
      setError(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAnswer(value);
    validate(value);
  };

  return (
    <>
      <TextField
        label={question.BGlobalQuestion}
        value={answer}
        onChange={handleChange}
        error={error}
        helperText={error ? "Debe tener al menos 5 caracteres" : ""}
        fullWidth
      />
    </>
  );
};

export default TextQuestion;
