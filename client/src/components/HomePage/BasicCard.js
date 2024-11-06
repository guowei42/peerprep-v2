import { useNavigate } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

export default function BasicCard({title, description, label, link}) {

  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate(link);
  }

  return (
    <Card sx={{ minWidth: 275, flex: 0, borderRadius: '16px'}}>
      <CardContent>
        <Typography variant="h4" component="div" fontWeight="bold" padding="2px">
          {title}
        </Typography>
        <Typography variant="body2" paddingTop="6px">
          {description}
        </Typography>
      </CardContent>
      <CardActions sx={{ justifyContent: 'center'}}>
        <Button 
          size="small" 
          variant="outlined"
          onClick={handleButtonClick}
        >
          {label}
        </Button>
      </CardActions>
    </Card>
  );
}