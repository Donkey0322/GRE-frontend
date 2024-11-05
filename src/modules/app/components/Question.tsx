import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ReportIcon from "@mui/icons-material/Report";
import StarsRoundedIcon from "@mui/icons-material/StarsRounded";
import { InputAdornment, Tooltip, tooltipClasses } from "@mui/material";
import TextField from "@mui/material/TextField";
import Zoom from "@mui/material/Zoom";
import { motion } from "framer-motion";
import FuzzySet from "fuzzyset";
import { debounce, isNull, round, toNumber } from "lodash";
import { useMemo, useRef, useState } from "react";
import styled from "styled-components";

import type { QuestionType } from "@/types";
import type { TooltipProps } from "@mui/material";

import { useInput, useNote } from "@/modules/app/services";

interface QuestionProps {
  index: number;
  question: QuestionType;
}

const QuestionContainer = styled.div`
  display: flex;
  align-items: start;
  column-gap: 0.5em;
`;

const Number = styled.div`
  line-height: 2em;
  flex-shrink: 0;
`;

const Context = styled.div`
  line-height: 2em;
`;

const WarningTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} arrow classes={{ popper: className }} />
))(() => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: "black",
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "black",
  },
}));

const InputIcon = ({
  iconType,
  score,
}: {
  iconType?: "correct" | "close" | "wrong";
  score?: number | null;
} & React.ComponentProps<typeof StarsRoundedIcon>) => {
  const icon = useMemo(() => {
    switch (iconType) {
      case "correct":
        return <CheckCircleIcon fontSize="small" color="success" />;
      case "close":
        return <ReportIcon fontSize="medium" color="warning" />;
      case "wrong":
        return <CancelIcon fontSize="small" color="error" />;
      default:
        iconType satisfies undefined;
        return <></>;
    }
  }, [iconType]);

  const animatedIcon = useMemo(() => {
    if (!iconType) return icon;
    return <Zoom in={true}>{icon}</Zoom>;
  }, [icon, iconType]);

  return (
    <WarningTooltip
      title={score && round(score, 2)}
      // disableHoverListener={iconType !== "close"}
    >
      {animatedIcon}
    </WarningTooltip>
  );
};

export default function Question({ index, question }: QuestionProps) {
  const { mutate: handleStarred } = useNote(question.id);
  const { mutate: handleInput } = useInput(question.id);

  const fuzzy = useMemo(() => FuzzySet([question.answer]), [question.answer]);

  const [score, setScore] = useState<number | null>(
    question.input
      ? toNumber(fuzzy.get(question.input, [[0, question.input]])[0][0])
      : null
  );
  const [starred, setStarred] = useState(question.note);
  const [placeholderIndex, setPlaceholderIndex] = useState(1);

  const placeholder = useMemo(
    () => question.answer.slice(0, placeholderIndex),
    [placeholderIndex, question.answer]
  );

  const iconType = useMemo(() => {
    if (placeholder === question.answer) return "wrong";
    if (isNull(score)) return undefined;
    if (score === 1) return "correct";
    if (score > 0.7) return "close";
    return "wrong";
  }, [placeholder, question.answer, score]);

  const inputRef = useRef<HTMLInputElement>(null);

  const tabToNextQuestion = (index: number) => {
    const sibling = document.querySelector<HTMLInputElement>(
      `input#Q${index + 1}`
    );
    if (toNumber(sibling?.attributes.getNamedItem("data-score")?.value) === 1) {
      tabToNextQuestion(index + 1);
      return;
    }
    sibling?.focus();
  };

  const debounceHandleInput = useMemo(
    () =>
      debounce((input: string) => {
        handleInput({ input });
      }, 800),
    [handleInput]
  );

  const handleInputChange = ({
    target: { value },
  }: React.ChangeEvent<HTMLInputElement>) => {
    setScore(value ? toNumber(fuzzy.get(value, [[0, value]])[0][0]) : null);
    debounceHandleInput(value);
    if (value === question.answer) {
      tabToNextQuestion(index);
    }
  };

  const handleRemind = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === " " && e.shiftKey) {
      e.preventDefault();
      setPlaceholderIndex((prev) => prev + 1);
    }
  };

  const handleStarClick = () => {
    handleStarred();
    setStarred(true);
  };

  return (
    <QuestionContainer>
      <motion.div
        style={{
          height: "32px",
          aspectRatio: "1 / 1",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          cursor: "pointer",
        }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileTap={{ scale: starred ? 1 : 0.6 }}
        whileHover={{ scale: starred ? 1 : 1.4 }}
        transition={{ type: "spring", stiffness: 400, damping: 13 }}
        onClick={!starred ? handleStarClick : undefined}
        onKeyUp={(e) => {
          if (!starred && e.key === "Enter") handleStarClick();
          else return undefined;
        }}
      >
        <StarsRoundedIcon
          fontSize="medium"
          style={{ color: starred ? "gold" : "grey" }}
        />
      </motion.div>
      <TextField
        ref={inputRef}
        id={`Q${index}`}
        error={placeholder === question.answer}
        disabled={placeholder === question.answer}
        value={placeholder === question.answer ? placeholder : undefined}
        variant="standard"
        placeholder={placeholder}
        defaultValue={question.input}
        sx={{ width: "150px", flexShrink: 0 }}
        inputProps={{ "data-score": score ?? 0 }}
        InputProps={{
          endAdornment: (
            <InputAdornment
              key={iconType}
              position="end"
              sx={{ cursor: "pointer" }}
            >
              <InputIcon iconType={iconType} score={score} />
            </InputAdornment>
          ),
        }}
        onChange={handleInputChange}
        onKeyDown={handleRemind}
      />
      <Number>{index + 1 + ". "}</Number>
      <Context>{question.context}</Context>
    </QuestionContainer>
  );
}
