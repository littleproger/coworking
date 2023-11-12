import { Stack } from '@mui/material';
import { StackProps } from '@mui/system';
import './outline-button.css';

interface OutlineButton {
  text: string;
}
const OutlineButton = (props: OutlineButton & StackProps) => {
  return (
    <Stack className="outline-button-container" style={{ cursor:'pointer' }}>
      <button className="outline-button-button button Button">
        {props.text}
      </button>
    </Stack>
  );
};

OutlineButton.defaultProps = {
  text: 'Button',
};


export default OutlineButton;
