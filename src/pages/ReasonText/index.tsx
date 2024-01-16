/** @jsxImportSource @emotion/react */
import { FC, MutableRefObject, useState } from "react";
import { useTranslation } from "react-i18next";
import { Box, TextField} from "@mui/material";
import useStyles from "./useStyles";

export interface ReasonTextProps {
  reasonRef: MutableRefObject<HTMLTextAreaElement>;
}

const ReasonText: FC<ReasonTextProps> = ({reasonRef}) => {
  const [common] = useTranslation("common");
  const styles = useStyles();
  const [reason, setCurrentReason] = useState(reasonRef.current?.value?? "");

  return (
    <Box display={"grid"} width={"100%"} css={styles.nameInputWrapper}>
      <TextField
        css={styles.nameInput}
        onChange={e => {setCurrentReason(e.target.value)}}
        placeholder={common("absence.reason")}
        multiline
        value={reason}
        inputRef={reasonRef}
        rows={4}
        error={reason.length === 0}
        helperText={reason.length === 0? common("absence.error") : undefined}
      />
    </Box>
  );
};

export default ReasonText;
