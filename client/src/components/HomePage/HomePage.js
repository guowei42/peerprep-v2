import { Button, Grid2, styled } from "@mui/material";
import { useNavigate } from "react-router-dom";
import QueueCard from "./QueueCard";
import BasicCard from "./BasicCard";

function HomePage() {
  let navigate = useNavigate();

  return (
    <>
      <Grid2
        container
        spacing={3}
        sx={{
          padding: "35px 0",
          justifyContent: "center"
        }}
      >
        <Grid2 item xs={12} md={7} container spacing={2} direction="column">
          
          <Grid2 item>
            <BasicCard 
              title="View All Questions" 
              description="View all the questions you can attempt."
              label="Questions List"
              link="/questionpage"
            />
          </Grid2>
          
          <Grid2 item>
            <BasicCard 
              title="Past Question Attempts" 
              description="View your previous question attempts and 
                their solutions to track your progress and learn from 
                your mistakes."
              label="Profile"
            />
          </Grid2>

          <Grid2 item>
            <BasicCard 
              title="Previous Matches" 
              description="Enjoyed collaborating with someone? View 
                your past matches and send a friend request to your previous 
                matches."
              label="Previous Matches"
            />
          </Grid2>
        </Grid2>

        <Grid2 item xs={12} md={5} container spacing={2} direction="column">
          <Grid2 item>
            <div>Ongoing Session</div>
          </Grid2>
          <Grid2 item>
            <QueueCard />
          </Grid2>
        </Grid2>

      </Grid2>
    </>
  );
}

export default HomePage;

