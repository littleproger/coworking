import { Coworking } from '@coworking/common/dist/services/coworking';
import { Typography } from '@mui/material';
import OutlineButton from '../OutlineButton';
import './place-card.css';

type PlaceCardProps = {
  image: string;
  image_alt: string;
  city: string;
  description: string;
} & Coworking;

const PlaceCard = (props: PlaceCardProps) => {

  return (
    <a className="place-card-container" href={`/coworkings/${props._id}`} style={{ cursor: 'pointer' }} >
      <img
        alt={props.image_alt}
        src={props.image}
        className="place-card-image"
      />
      <div className="place-card-container1">
        <Typography textAlign="center" variant='h6' fontWeight="bold" className="place-card-text">{props.title}</Typography>
        <Typography textAlign="center" className="place-card-text"><em>{props.city}</em></Typography>
        <div className="place-card-text1" dangerouslySetInnerHTML={{ __html: props.shortDescription }} />
        <a href={`/coworkings/${props._id}`} style={{ cursor: 'pointer' }}>
          <OutlineButton text="Discover place" style={{ cursor: 'pointer' }}/>
        </a>
      </div>
    </a>
  );
};

PlaceCard.defaultProps = {
  image:
    'https://images.unsplash.com/photo-1514924013411-cbf25faa35bb?ixlib=rb-1.2.1&q=85&fm=jpg&crop=entropy&cs=srgb&w=1000',
  image_alt: 'image',
  city: 'City Name',
  description:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna.',
};


export default PlaceCard;
