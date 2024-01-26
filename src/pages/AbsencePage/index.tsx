/** @jsxImportSource @emotion/react */
import Container from "@mui/material/Container";
import { FC, ReactNode, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { AppContextProvider } from "../../components/App/context";
import Loading from "../../components/Loading";
import { BuildHelper } from "../../utils/BuildHelper";
import useErrorHandler from "../../utils/useErrorHandler";
import { BuildPlayer } from "../../types";
import {
  Box,
  Button,
  MenuItem,
  Select,
  SelectChangeEvent,
  Tooltip,
  Typography,
} from "@mui/material";
import UUID from "../../utils/UUID";
import SendIcon from "@mui/icons-material/Send";
import Logo from "../Logo";
import useStyles from "./useStyles";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import ReasonText from "../ReasonText";
import useWebSocket from "react-use-websocket";
import updateLocale from "dayjs/plugin/updateLocale";

export interface AbsencePageProps {}

const AbsencePage: FC<AbsencePageProps> = () => {
  const [common] = useTranslation("common");
  const styles = useStyles();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState("DEFAULT");
  const [options, setOptions] = useState<any[]>([]);
  const [startDate, setStartDate] = useState<Dayjs>(
    dayjs().set("hours", 0).set("minutes", 0).set("seconds", 0).set("milliseconds", 0)
  );
  const [endDate, setEndDate] = useState<Dayjs>(
    dayjs().set("hours", 0).set("minutes", 0).set("seconds", 0).set("milliseconds", 0)
  );
  const [sent, setSent] = useState(false);
  const [players, setPlayers] = useState<BuildPlayer[]>([]);
  const [characterError, setCharacterError] = useState(false);
  const [socketUrl] = useState(process.env.REACT_APP_WEBSOCKET);
  const handleError = useErrorHandler();
  const reasonRef = useRef<any>();

  dayjs.extend(updateLocale);
  dayjs.updateLocale("en", {
    weekStart: 1,
  });

  const { sendMessage } = useWebSocket(socketUrl ?? "", {
    shouldReconnect: (closeEvent) => true,
    reconnectAttempts: 10,
    reconnectInterval: (attemptNumber) => Math.min(Math.pow(2, attemptNumber) * 1000, 10000),
  });

  const getOptions = async () => {
    const buildObject: any[] = [];
    const newPlayers: BuildPlayer[] = [];
    await BuildHelper.parseGetPlayers().then((newRoster: BuildPlayer[]) => {
      if (newRoster) {
        for (const player of newRoster) {
          if (player.main === player.name) {
            newPlayers.push(player);
            buildObject.push(player.name);
          }
        }
        setOptions(buildObject.sort((a, b) => a.localeCompare(b)));
      }
    });
    setPlayers([...newPlayers]);
    return buildObject;
  };

  const handleSelect = (event: SelectChangeEvent<string>, child: ReactNode) => {
    setSelectedOption(event.target.value);
    setCharacterError(false);
  };

  const handleSend = () => {
    if (selectedOption === "DEFAULT") {
      setCharacterError(true);
      return;
    }
    if (!reasonRef.current?.value) {
      return;
    }

    const newStart = startDate
      .set("hours", 0)
      .set("minutes", 0)
      .set("seconds", 0)
      .set("milliseconds", 0);
    const newEnd = endDate
      .set("hours", 23)
      .set("minutes", 59)
      .set("seconds", 59)
      .set("milliseconds", 999);
    console.log(
      `Player ${selectedOption} is absent from ${newStart} to ${newEnd} with reason ${
        reasonRef.current?.value ?? ""
      }`
    );
    const foundPlayer = players.find((player) => player.name === selectedOption);
    if (foundPlayer) {
      const absence = {
        player_id: foundPlayer.id,
        start_date: newStart.unix() * 1000,
        end_date: newEnd.unix() * 1000,
        reason: reasonRef.current?.value ?? "",
      };
      BuildHelper.parseAbsenceSend(absence);
      BuildHelper.parsePostAbsence(absence, selectedOption);
      sendMessage(
        JSON.stringify({
          message_type: "absence",
          data: absence,
          date: new Date().getTime(),
          account_name: "System",
        })
      );
      setSent(true);
    }
  };

  const handleGoBack = () => {
    setSelectedOption("DEFAULT");
    setStartDate(
      dayjs().set("hours", 0).set("minutes", 0).set("seconds", 0).set("milliseconds", 0)
    );
    setEndDate(dayjs().set("hours", 0).set("minutes", 0).set("seconds", 0).set("milliseconds", 0));
    setSent(false);
  };

  const handleStartDateChange = (date: Dayjs | null) => {
    if (date === null) {
      date = dayjs().set("hours", 0).set("minutes", 0).set("seconds", 0).set("milliseconds", 0);
    }
    const newDate = date.set("hours", 0).set("minutes", 0).set("seconds", 0).set("milliseconds", 0);
    setStartDate(newDate);
    if (newDate.isAfter(endDate)) {
      setEndDate(newDate);
    }
  };

  const handleEndDateChange = (date: Dayjs | null) => {
    if (date === null) {
      date = dayjs().set("hours", 0).set("minutes", 0).set("seconds", 0).set("milliseconds", 0);
    }
    const newDate = date.set("hours", 0).set("minutes", 0).set("seconds", 0).set("milliseconds", 0);
    setEndDate(newDate);
    if (newDate.isBefore(startDate)) {
      setStartDate(newDate);
    }
  };

  useEffect(() => {
    if (isLoading) {
      getOptions();
      setIsLoading(false);
    }
  }, [handleError, isLoading, options]);

  if (isLoading) {
    return <Loading />;
  }

  if (sent) {
    return (
      <Container key={UUID()}>
        <Box key={UUID()} display={"flex"} css={{ justifyContent: "center", marginTop: "10%" }}>
          <Typography style={{ caretColor: "transparent" }} fontSize={"38px"} variant="subtitle1">
            {common(`absence.sent`)}
          </Typography>
        </Box>
        <Box display={"flex"} css={{ justifyContent: "center", marginTop: window.innerHeight / 2 }}>
          <Button
            color="primary"
            variant="contained"
            css={{ width: "300px", height: "120px" }}
            onClick={handleGoBack}
          >
            <Typography style={{ caretColor: "transparent" }} fontSize={"38px"} variant="subtitle1">
              {"Back"}
            </Typography>
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <AppContextProvider value={{}}>
      <Container key={UUID()} maxWidth={"xl"}>
        <Logo></Logo>
        <Box css={styles.modal}>
          <h2>{common("absence.title")}</h2>
          <Box css={styles.content}>
            <Box display={"grid"} width={"100%"}>
              <Select
                error={characterError}
                required
                css={{ minWidth: "200px" }}
                value={selectedOption}
                label="Character"
                onChange={handleSelect}
                MenuProps={{ PaperProps: { sx: { maxHeight: 300 } } }}
              >
                <MenuItem disabled key={"DEFAULT"} value={"DEFAULT"}>
                  Select a character...
                </MenuItem>
                {options.map((option) => (
                  <MenuItem key={UUID()} value={option}>
                    {" "}
                    {option}{" "}
                  </MenuItem>
                ))}
              </Select>
              {characterError ? (
                <Typography
                  style={{ caretColor: "transparent", color: "red" }}
                  fontSize={"14px"}
                  variant="subtitle1"
                >
                  {common(`absence.error`)}
                </Typography>
              ) : (
                <></>
              )}
            </Box>
            <Box display={"grid"} width={"100%"}>
              <br></br>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  css={{ zIndex: 0, background: "#1d1d1d" }}
                  ampm={false}
                  format="DD.MM.YYYY"
                  label={common("absence.start")}
                  value={startDate}
                  onChange={handleStartDateChange}
                  views={["year", "month", "day"]}
                  sx={{ minWidth: "200px" }}
                />
              </LocalizationProvider>
            </Box>
            <Box display={"grid"} width={"100%"}>
              <br></br>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  css={{ zIndex: 0, background: "#1d1d1d" }}
                  ampm={false}
                  format="DD.MM.YYYY"
                  label={common("absence.end")}
                  value={endDate}
                  onChange={handleEndDateChange}
                  views={["year", "month", "day"]}
                  sx={{ minWidth: "200px" }}
                />
              </LocalizationProvider>
            </Box>
            <ReasonText reasonRef={reasonRef}></ReasonText>
            <Tooltip title={common("absence.send")} placement="top" arrow>
              <Button
                color="success"
                variant="contained"
                size="large"
                style={{ height: "50px", width: "150px" }}
                onClick={() => handleSend()}
              >
                <SendIcon />
              </Button>
            </Tooltip>
          </Box>
        </Box>
      </Container>
    </AppContextProvider>
  );
};

export default AbsencePage;
