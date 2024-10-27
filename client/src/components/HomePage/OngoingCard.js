import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
function OngoingCard() {
    let navigate = useNavigate();
    return (
        <div>
            <p>Ongoing session</p>
            <Button variant = "contained" onClick={() => navigate("/collaborationpage")}>
          Ongoing session
        </Button>
        </div>
    )



}

export default OngoingCard;