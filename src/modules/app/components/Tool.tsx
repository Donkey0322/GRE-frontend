import {
  CleaningServicesRounded as CleaningServicesRoundedIcon,
  Handyman as HandymanIcon,
  Menu as MenuIcon,
  Refresh as RefreshIcon,
  ShuffleTwoTone as ShuffleTwoToneIcon,
} from "@mui/icons-material";
import {
  CircularProgress,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
} from "@mui/material";
import _ from "lodash";
import { useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import DeepCleanIcon from "@/assets/icons/DeepClean";
import { useClean, useFetch, useRefetch } from "@/modules/app/services";

export default function Tool() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const shuffle = searchParams.get("shuffle");

  const [dialOpen, setDialOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [deepClean, setDeepClean] = useState(false);

  const { mutate, isPending } = useRefetch();
  const { mutate: clean, isPending: isCleaning } = useClean();
  const { refetch } = useFetch();

  const handleShuffleClick = () => {
    if (_.isNil(shuffle)) navigate("?shuffle=true");
    else void refetch();
  };

  return (
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
        tooltipTitle={"Refetch blocks from Notion"}
        onClick={() => mutate()}
      />
      <SpeedDialAction
        key={"clean"}
        sx={
          deepClean
            ? {
                "&, &:hover": {
                  bgcolor: "gold",
                },
              }
            : undefined
        }
        icon={
          isCleaning ? (
            <CircularProgress color="inherit" size="2em" />
          ) : deepClean ? (
            <DeepCleanIcon fontSize={"1.9em"} />
          ) : (
            <CleaningServicesRoundedIcon />
          )
        }
        tooltipTitle={`Wipe out the current answers${
          deepClean ? " deeply" : ""
        }`}
        onClick={() => clean({ deep: deepClean })}
        onMouseEnter={() => {
          timeoutRef.current = setTimeout(() => {
            setDeepClean(true);
          }, 1500);
        }}
        onMouseLeave={() => {
          setDeepClean(false);
          if (timeoutRef.current) {
            console.log("Hi");
            clearTimeout(timeoutRef.current);
          }
        }}
      />
      <SpeedDialAction
        key={"shuffle"}
        icon={<ShuffleTwoToneIcon />}
        tooltipTitle={"Shuffle questions"}
        onClick={handleShuffleClick}
      />
    </SpeedDial>
  );
}
