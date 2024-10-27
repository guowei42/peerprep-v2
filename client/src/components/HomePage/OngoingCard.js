import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
function OngoingCard() {
    let navigate = useNavigate();
    return (
        <div>
            <p>Ongoing session</p>
            <Button onClick={() => navigate("/collaborationpage")}>
          Ongoing session
        </Button>
        <p>Please end all ongoing session before matching again!</p>
        </div>
    )



}

export default OngoingCard;