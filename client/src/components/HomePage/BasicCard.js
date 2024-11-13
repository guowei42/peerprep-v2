import { useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

export default function BasicCard({
  title,
  description,
  label,
  link,
  disabledButton,
}) {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate(link);
  };

  return (
    <Card
      sx={{
        minWidth: 300,
        flex: "1 1 auto",
        display: "flex",
        flexDirection: "column",
        borderRadius: "16px",
      }}
    >
      <CardContent sx={{ flex: "1 1 auto" }}>
        <Typography
          variant="h4"
          component="div"
          fontWeight="bold"
          padding="2px"
        >
          {title}
        </Typography>
        <Typography variant="body2" paddingTop="6px">
          {description}
        </Typography>
      </CardContent>
      <CardActions sx={{ justifyContent: "center" }}>
        <Button
          size="small"
          variant="outlined"
          onClick={handleButtonClick}
          disabled={disabledButton}
        >
          {label}
        </Button>
      </CardActions>
    </Card>
  );
}
