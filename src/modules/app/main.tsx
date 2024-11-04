import { Backdrop, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { debounce } from "lodash";
import { useEffect, useMemo } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import styled from "styled-components";

import { useLoading } from "@/hooks/useLoading";
import Question from "@/modules/app/components/Question";
import Tool from "@/modules/app/components/Tool";
import { useFetch, useInput } from "@/modules/app/services";

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

export default function Main() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const shuffle = searchParams.get("shuffle");

  const { data, isFetching, refetch } = useFetch();
  const { mutate: handleInput } = useInput();
  const { loading } = useLoading();

  const debounceHandleOnChange = useMemo(
    () =>
      debounce((input: string, index: number) => {
        handleInput({ index, input });
      }, 800),
    [handleInput]
  );

  useEffect(() => {
    void refetch();
  }, [refetch, shuffle]);

  return (
    <Container>
      <Tool />
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
      {isFetching ? (
        <p>Loading...</p>
      ) : (
        <QuestionsContainer>
          {data?.map((question, index) => (
            <Question
              key={index}
              index={index}
              question={question}
              onInputChange={(value) =>
                debounceHandleOnChange(value, question.id)
              }
            />
          ))}
          <Backdrop
            sx={{
              backgroundColor: "#ffffffb7",
              zIndex: (theme) => theme.zIndex.drawer + 1,
            }}
            open={loading}
          />
        </QuestionsContainer>
      )}
    </Container>
  );
}
