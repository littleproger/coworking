import { Button, Stack } from '@mui/material';
import { StackProps } from '@mui/system';
import './outline-button.css';

interface OutlineButton {
  text: string;
}
const OutlineButton = (props: OutlineButton & StackProps) => {
  return (
    <Stack className="outline-button-container" style={{ cursor:'pointer' }}>
      <Button variant='outlined' style={{ textDecoration: 'none' }}>
        {props.text}
      </Button>
    </Stack>
  );
};

OutlineButton.defaultProps = {
  text: 'Button',
};


export default OutlineButton;
