
import { Chip } from '@mui/material';
import './benefit-item.css';

interface BenefitItemProps {
  className: string;
  children: string;
}
const BenefitItem = (props:BenefitItemProps) => {
  return (
    <Chip label={props.children} style={{ background: '#fca311ff', fontSize: '18px', fontWeight: 600, color: 'white' }}/>
  );
};

BenefitItem.defaultProps = {
  text: 'Button',
  rootClassName: '',
};


export default BenefitItem;
