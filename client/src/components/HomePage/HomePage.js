import { Grid2 } from "@mui/material";

function HomePage() {
  return (
    <Grid2 container spacing={2}>
      <Grid2 size={6}>
        <div>profile</div>
      </Grid2>
      <Grid2 size={5}>
        <div>ongoing session</div>
      </Grid2>
      <Grid2 size={6}>
        <div>past matches</div>
      </Grid2>
      <Grid2 size={5}>
        <div>selection</div>
      </Grid2>
    </Grid2>
  );
}

export default HomePage;
