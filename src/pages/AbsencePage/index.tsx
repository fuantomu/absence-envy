/** @jsxImportSource @emotion/react */
import Container from "@mui/material/Container";
import { FC, ReactNode, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { TextInput } from 'react-native';
import { AppContextProvider } from "../../components/App/context";
import Loading from "../../components/Loading";
import { BuildHelper } from "../../utils/BuildHelper";
import useErrorHandler from "../../utils/useErrorHandler";
import { BuildPlayer } from "../../types";
import { Box, Button, Card, CardContent, MenuItem, Select, SelectChangeEvent, Tooltip, Typography } from "@mui/material";
import DatePicker from "react-datepicker";
import UUID from "../../utils/UUID";
import SendIcon from '@mui/icons-material/Send';
import "react-datepicker/dist/react-datepicker.css";

export interface AbsencePageProps {}

const AbsencePage: FC<AbsencePageProps> = () => {
  const [common] = useTranslation("common");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState("DEFAULT");
  const [options, setOptions] = useState<any[]>([]);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [reason, setReason] = useState('');
  const [sent, setSent] = useState(false);
  const handleError = useErrorHandler();

  const getOptions = async () => {
    const buildObject : any[] = [];
    await BuildHelper.parseGetPlayers().then((newRoster : BuildPlayer[]) => {
      if(newRoster){
        for(const player of newRoster){
          if(player.main === player.name){
            buildObject.push(player.name)
          }
        }
        setOptions(buildObject.sort((a,b) => a.localeCompare(b)))
      }
    })
    return buildObject
  }

  const handleSelect = (event: SelectChangeEvent<string>, child: ReactNode) => {
    setSelectedOption(event.target.value)
  }

  const handleInput = (text: string) => {
    setReason(text)
  }

  const handleSend = () => {
    if(selectedOption !== "DEFAULT"){
      const newStart = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), 0, 0, 0, 0)
      const newEnd = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate(), 23, 59, 59, 999)
      console.log(`Player ${selectedOption} is absent from ${newStart} to ${newEnd} with reason ${reason}`)
      const absence = {name:selectedOption, startDate: newStart.getTime(), endDate: newEnd.getTime(), reason}
      BuildHelper.parseAbsenceSend(absence)
      BuildHelper.parsePostAbsence(absence)
      setSent(true)
    }
  }

  useEffect(() => {
    if (isLoading){
      getOptions()
      setIsLoading(false);
    }
  }, [handleError, isLoading, options, reason]);

  if (isLoading) {
    return <Loading />;
  }

  if (sent){
    return (<Container key={UUID()}>
              <Box key={UUID()} display={"flex"} css={{justifyContent:"center"}}>
                <Typography style={{caretColor: "transparent"}} fontSize={"38px"} variant="subtitle1">
                {common(`absence.sent`)}
                </Typography>
              </Box>
            </Container>
    )
  }

  return (
    <AppContextProvider value={{}}>

      <Container key={UUID()}>
        <Card key={UUID()}>
          <CardContent key={UUID()} style={{border:"1", borderColor: "black", backgroundColor: "#242424"}}>
          <Box key={UUID()} display={"grid"} gridTemplateColumns={"1fr 1fr"}>
              <Typography style={{caretColor: "transparent"}} fontSize={"38px"} variant="subtitle1">
                {common(`absence.title`)}
              </Typography>
          </Box>
          <br></br>
          <Box key={UUID()} display={"grid"} gridTemplateColumns={"1fr 1fr"}>
              <Typography style={{caretColor: "transparent"}} fontSize={"22px"} variant="subtitle1">
                {common(`absence.character`)}
              </Typography>
              <Select
                value={selectedOption}
                label="Character"
                onChange={handleSelect}
              >
                <MenuItem disabled key={"DEFAULT"} value={"DEFAULT"}>Select a character...</MenuItem>
                {options.map((option) => (
                    <MenuItem key={UUID()} value={option}> {option} </MenuItem>
                ))}
              </Select>
          </Box>
          <br></br>
          <Box key={UUID()} display={"grid"} gridTemplateColumns={"1fr 1fr"}>
              <Typography style={{caretColor: "transparent"}} fontSize={"22px"} variant="subtitle1">
                {common(`absence.start`)}
              </Typography>
              <DatePicker selected={startDate} onChange={(date:Date) => setStartDate(date)} />
          </Box>
          <br></br>
          <Box key={UUID()} display={"grid"} gridTemplateColumns={"1fr 1fr"}>
              <Typography style={{caretColor: "transparent"}} fontSize={"22px"} variant="subtitle1">
                {common(`absence.end`)}
              </Typography>
              <DatePicker selected={endDate} onChange={(date:Date) => setEndDate(date)} />
          </Box>
          <br></br>
          <Box key={UUID()} display={"grid"} gridTemplateColumns={"1fr 1fr"}>
              <Typography style={{caretColor: "transparent"}} fontSize={"22px"} variant="subtitle1">
                {common(`absence.reason`)}
              </Typography>
              <TextInput
                key={UUID()}
                onChangeText ={handleInput}
                defaultValue={reason}
                placeholder={common("absence.reason")}
                autoFocus
              />

          </Box>
          <br></br>
          <Box key={UUID()} display={"grid"} justifyContent={"center"}>
            <Tooltip title={common("absence.send")} placement="top" arrow>
              <Button color="success" variant="contained" size="large" style={{height: '50px', width: '150px'}} onClick={() => handleSend()}>
                <SendIcon />
              </Button>
            </Tooltip>
          </Box>
          </CardContent>
        </Card>

      </Container>
    </AppContextProvider>
  );
};

export default AbsencePage;
