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
import { useState } from "react";

import { useClean, useRefetch, useShuffle } from "@/modules/app/services";

export default function Tool() {
  const [dialOpen, setDialOpen] = useState(false);

  const { mutate, isPending } = useRefetch();
  const { mutate: clean, isPending: isCleaning } = useClean();
  const { mutate: shuffle, isPending: isShuffling } = useShuffle();

  return (
    <SpeedDial
      sx={{ position: "fixed", top: "2em", right: "2em" }}
      icon={<SpeedDialIcon icon={<HandymanIcon />} openIcon={<MenuIcon />} />}
      ariaLabel={""}
      direction={"down"}
      onOpen={() => setDialOpen(true)}
      onClose={() => setDialOpen(false)}
      open={isPending || isCleaning || isShuffling || dialOpen}
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
        icon={
          isShuffling ? (
            <CircularProgress color="inherit" size="2em" />
          ) : (
            <ShuffleTwoToneIcon />
          )
        }
        tooltipTitle={"Shuffle questions"}
        onClick={() => shuffle()}
      />
    </SpeedDial>
  );
}
