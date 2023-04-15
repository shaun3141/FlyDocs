import { Paper } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";

export default function Home() {
  return (
    <>
      <Grid xs={12}>
        <Paper sx={{ padding: "10px", textAlign: "center", height: "100%", width: "100%" }}>
        <iframe
        style={{ padding: "10px", textAlign: "center", height: "700px", width: "100%" }}
         src="https://chat.berri.ai/aHR0cHM6Ly9zdG9yZXF1ZXJ5YWJoaTItYXlsdS56ZWV0LWJlcnJpLnplZXQuYXBwL2JlcnJpX3F1ZXJ5P3Byb2pfcGF0aD1pbmRleGVzL25vdXJib3V6aWQ5OUBnbWFpbC5jb20vZDBjMWNhOTEtN2I3My00ODJmLTlkMTYtOWI3Njc2Y2Q3M2FiJnByb2pfbmFtZT1odHRwczovL2x1bmEuZ2l0bGFiLmlvL2Rpc2NvcmQtdW5vZmZpY2lhbC1kb2NzL2Rlc2t0b3BfcmVtb3RlX2F1dGguaHRtbCZxdWVyeT0=" title="W3Schools Free Online Web Tutorials"></iframe>
        </Paper>
      </Grid>
    </>
  );
}
