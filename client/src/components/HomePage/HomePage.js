import { Grid2 } from "@mui/material";

// top-left, top-right, bottom-right, bottom-left
const VERTICAL_DISTRIBUTION = [0.4, 1, 1, 0.6]

function HomePage() {
  return (
    <Grid2 container spacing={2} size={12} sx={{ flex: "1 1 auto", padding: "35px 0px 35px 0px" }}>
      <Grid2 container direction={"column"} size={6} >
        <Grid2 sx={{ flexGrow: VERTICAL_DISTRIBUTION[0] }}>
          <div>profile</div>
        </Grid2>
        <Grid2 sx={{ flexGrow: VERTICAL_DISTRIBUTION[3] }}>
          <div>past matches</div>
        </Grid2>
      </Grid2>
      <Grid2 container size={6} direction={"column"}>
        <Grid2 sx={{ flexGrow: VERTICAL_DISTRIBUTION[1] }}>
          <div>ongoing session</div>
        </Grid2>
        <Grid2 sx={{ flexGrow: VERTICAL_DISTRIBUTION[2] }}>
          <div>selection</div>
        </Grid2>
      </Grid2>
    </Grid2>
  );
}

export default HomePage;