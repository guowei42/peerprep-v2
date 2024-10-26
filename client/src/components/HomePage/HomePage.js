import { Grid2, styled } from "@mui/material";
import QueueCard from "./QueueCard";

// top-left, top-right, bottom-right, bottom-left
const FlexGrid = styled(Grid2)(({ flex_amount }) => ({
  display: "flex",
  flex: `${flex_amount} 1 0`,
}));

function HomePage() {
  return (
    <>
      <Grid2
        container
        spacing={2}
        size={12}
        sx={{
          display: "flex",
          flex: "1 1 auto",
          padding: "35px 0px 35px 0px",
        }}
      >
        <Grid2 container direction={"column"} size={7}>
          <FlexGrid flex_amount={0.4}>
            <div>profile</div>
          </FlexGrid>
          <FlexGrid flex_amount={1}>
            <div>past matches</div>
          </FlexGrid>
        </Grid2>
        <Grid2 container size={5} direction={"column"}>
          <FlexGrid flex_amount={1}>
            <div>ongoing session</div>
          </FlexGrid>
          <FlexGrid flex_amount={1}>
            <QueueCard />
          </FlexGrid>
        </Grid2>
      </Grid2>
    </>
  );
}

export default HomePage;
