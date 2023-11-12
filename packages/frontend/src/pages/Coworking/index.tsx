import { Coworking as CoworkingProps, ImageField } from '@coworking/common/dist/services/coworking';
import { Typography } from '@mui/material';
import { useCallback } from 'react';
import BenefitItem from '../../components/BenefitItem';
import { BookingDatePicker } from '../../components/BookingCoworking';
import { Gallery } from '../../components/Gallery';
import { useQuery } from '../../customHooks/useQuery';
import { feathersClient } from '../../feathersClient';
import './coworking.css';

const getPhotosForGallery = (photos?: ImageField[]) => {
  if (!photos?.length) return [];
  return photos.map(photo => ({
    src: photo.file || '',
    width: 4,
    height: 3,
    alt: 'Coworking photo',
    key: photo.id,
  }));
};

export const Coworking = () => {

  const getCoworkings = useCallback(async () => {
    const response = await feathersClient.service('coworkings').get('654cf1955dfff5ea437c6e7f');

    if (!response) {
      throw new Error('Network response was not ok 53fXf ');
    }
    return response;
  }, []);

  const { data, error, isLoading, refetch } = useQuery<CoworkingProps>(getCoworkings);

  const photos = getPhotosForGallery(data?.collageImages);

  return (
    <div className="coworking-container">
      {isLoading ? (
        <p>Loading....</p>
      ) : (
        <>
          <div className="coworking-container1">
            <div className="coworking-container3">
              <span className="coworking-text12" style={{ textAlign: 'center' }}>
                {(data?.title || 'Untitled title')} <br />
                <em style={{ fontSize: '20px' }}>{data?.location}</em>
              </span>
              <BookingDatePicker />
              <span className="coworking-text13">
                <span
                  dangerouslySetInnerHTML={{
                    __html: data?.description ?? ' ',
                  }}
                />
              </span>
            </div>
          </div>
          <div style={{ marginTop: '100px' }}>
            <Typography variant='h4'>Gallery</Typography>
            <Gallery />
          </div>
          <div className="coworking-container4">
            <div className="coworking-container5">
              <span className="coworking-text16">Benefits</span>
              <div className="coworking-container6">
                {data?.benefits.map(benefit => (
                  <BenefitItem key={benefit} className="benefit-item-root-class-name">{benefit}</BenefitItem>
                ))}
              </div>
            </div>
            <div style={{ marginTop: '60px' }} dangerouslySetInnerHTML={{ __html: data?.rules || '' }} />
          </div>
        </>
      )}
    </div>
  );
};

export default Coworking;
