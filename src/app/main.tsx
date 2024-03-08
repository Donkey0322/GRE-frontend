import { Menu as MenuIcon, Refresh as RefreshIcon } from "@mui/icons-material";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CleaningServicesRoundedIcon from "@mui/icons-material/CleaningServicesRounded";
import HandymanIcon from "@mui/icons-material/Handyman";
import ShuffleTwoToneIcon from "@mui/icons-material/ShuffleTwoTone";
import {
  Backdrop,
  CircularProgress,
  InputAdornment,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import TextField from "@mui/material/TextField";
import Zoom from "@mui/material/Zoom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { debounce } from "lodash";
import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";

import type { RefetchOptions } from "@tanstack/react-query";

import instance from "@/services/axios.config";

const Container = styled.div`
  width: 100vw;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  row-gap: 30px;
  padding: 20px;
  box-sizing: border-box;
  padding-bottom: 80px;
`;

const QuestionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 30px;
`;

const Question = styled.div`
  display: flex;
  align-items: end;
  column-gap: 0.5em;
`;

const Context = styled.div`
  line-height: normal;
`;

export default function Main() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { data, refetch, isFetching } = useQuery({
    queryKey: ["/", pathname],
    queryFn: () =>
      instance
        .get<
          {
            answer: string;
            context: string;
            input: string;
          }[]
        >("/", { params: { chapter: pathname.slice(1) } })
        .then((res) => res.data),
  });
  const { mutate, isPending } = useMutation({
    mutationKey: ["refetch"],
    mutationFn: () =>
      instance
        .post<RefetchOptions>("/", { chapter: pathname.slice(1) })
        .then((res) => res.data),
    onSuccess: refetch,
  });
  const { mutate: handleInput } = useMutation({
    mutationKey: ["input"],
    mutationFn: ({ index, input }: { index: number; input: string }) =>
      instance
        .put<RefetchOptions>("/", { chapter: pathname.slice(1), index, input })
        .then((res) => res.data),
  });
  const { mutate: clean, isPending: isCleaning } = useMutation({
    mutationKey: ["clean"],
    mutationFn: () =>
      instance
        .patch<RefetchOptions>("/", { chapter: pathname.slice(1) })
        .then((res) => res.data),
    onSuccess: refetch,
  });
  const [statuses, setStatuses] = useState<(boolean | null)[]>([]);
  const [dialOpen, setDialOpen] = useState(false);

  useEffect(() => {
    if (data) {
      setStatuses(
        data?.map(({ input, answer }) => (input ? input === answer : null))
      );
    }
  }, [data]);

  const handleOnChange = useCallback(
    (input: string, index: number) => {
      handleInput({ index, input });
    },
    [handleInput]
  );

  const debounceHandleOnChange = debounce(handleOnChange, 1000);

  return (
    <Container>
      <SpeedDial
        sx={{ position: "fixed", top: "2em", right: "2em" }}
        icon={<SpeedDialIcon icon={<HandymanIcon />} openIcon={<MenuIcon />} />}
        ariaLabel={""}
        direction={"down"}
        onOpen={() => setDialOpen(true)}
        onClose={() => setDialOpen(false)}
        open={isPending || isCleaning || dialOpen}
      >
        <SpeedDialAction
          key={"refresh"}
          icon={
            isPending ? (
              <CircularProgress color="inherit" size="2em" />
            ) : (
              <RefreshIcon />
            )
          }
          tooltipTitle={"Refetch blocks form Notion"}
          onClick={() => mutate()}
        />
        <SpeedDialAction
          key={"clean"}
          icon={
            isCleaning ? (
              <CircularProgress color="inherit" size="2em" />
            ) : (
              <CleaningServicesRoundedIcon />
            )
          }
          tooltipTitle={"Wipe out the current answers"}
          onClick={() => clean()}
        />
        <SpeedDialAction
          key={"shuffle"}
          icon={<ShuffleTwoToneIcon />}
          tooltipTitle={"Shuffle questions"}
        />
      </SpeedDial>
      <ToggleButtonGroup
        size="large"
        value={pathname.slice(1)}
        exclusive
        onChange={(_, value) => navigate(`/${value}`)}
      >
        <ToggleButton value="cloze1" key="1">
          Cloze 1
        </ToggleButton>
        <ToggleButton value="cloze2" key="2">
          Cloze 2
        </ToggleButton>
        <ToggleButton value="cloze3" key="3">
          Cloze 3
        </ToggleButton>
      </ToggleButtonGroup>
      {!statuses.length || isFetching ? (
        <p>Loading...</p>
      ) : (
        <QuestionsContainer>
          {data?.map((question, index) => (
            <Question key={index}>
              <TextField
                variant="standard"
                placeholder={question.answer.charAt(0)}
                defaultValue={question.input}
                sx={{ width: "150px", flexShrink: 0 }}
                {...(statuses[index] === true && {
                  InputProps: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <Zoom in={statuses[index] === true}>
                          <CheckCircleIcon fontSize="small" color="success" />
                        </Zoom>
                      </InputAdornment>
                    ),
                  },
                })}
                {...(statuses[index] === false && {
                  InputProps: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <Zoom in={statuses[index] === false}>
                          <CancelIcon fontSize="small" color="error" />
                        </Zoom>
                      </InputAdornment>
                    ),
                  },
                })}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setStatuses((prev) =>
                    prev.map((q, qIndex) =>
                      qIndex === index
                        ? event.target.value
                          ? question.answer === event.target.value
                          : null
                        : q
                    )
                  );
                  debounceHandleOnChange(event.target.value, index);
                }}
              />
              <Context>{index + 1 + ".  " + question.context}</Context>
            </Question>
          ))}
          <Backdrop
            sx={{
              backgroundColor: "#ffffffb7",
              zIndex: (theme) => theme.zIndex.drawer + 1,
            }}
            open={isPending || isCleaning}
          />
        </QuestionsContainer>
      )}
    </Container>
  );
}
