import { Paper } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";

export default function Home() {
  return (
    <>
      <Grid xs={12}>
        <Paper sx={{ padding: "10px", textAlign: "center" }}>
          <h1>
            See <span style={{ color: "#08D2EA" }}>10</span>X.chat in Action
          </h1>
        </Paper>
      </Grid>
    </>
  );
}
