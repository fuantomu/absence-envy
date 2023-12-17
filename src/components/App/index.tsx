/** @jsxImportSource @emotion/react */
import Box from "@mui/material/Box";
import { FC, Fragment, lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import "../../utils/i18n";
import useStyles from "./useStyles";
const ErrorBoundary = lazy(() => import("../ErrorBoundary"));
const Loading = lazy(() => import("../Loading"));
const AbsencePage = lazy(() => import("../../pages/AbsencePage"));

const App: FC = () => {
  const style = useStyles();

  return (
    <Fragment>
      <Box css={style.content} test-id="mui-root">
        <ErrorBoundary>
          <Suspense fallback={<Loading />}>
            <Routes>
              <Route path="*" element={<AbsencePage />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </Box>
    </Fragment>
  );
};

export default App;
