import { Coworking as CoworkingProps, ImageField } from '@coworking/common/dist/services/coworking';
import { Typography } from '@mui/material';
import { Stack } from '@mui/system';
import { useCallback } from 'react';
import { ReactImageGalleryItem } from 'react-image-gallery';
import { useParams } from 'react-router-dom';
import BenefitItem from '../../components/BenefitItem';
import { BookingDatePicker } from '../../components/BookingCoworking';
import { CommentsSection } from '../../components/Comments';
import { Gallery } from '../../components/Gallery';
import { useQuery } from '../../customHooks/useQuery';
import { feathersClient } from '../../feathersClient';
import './coworking.css';

const getPhotosForGallery = (photos?: ImageField[]):ReadonlyArray<ReactImageGalleryItem> => {
  if (!photos?.length) return [];
  return photos.map(photo => ({
    original: photo.file || '',
    thumbnail: photo.file || '',
    width: 4,
    height: 3,
    alt: 'Coworking photo',
    key: photo.id,
  }));
};

export const Coworking = () => {
  const { coworkingId } = useParams();

  if (!coworkingId) return <h1>Coworking space not found</h1>;

  const getCoworkings = useCallback(async () => {
    const response = await feathersClient.service('coworkings').get(coworkingId);

    if (!response) {
      throw new Error('Network response was not ok 53fXf ');
    }
    return [response];
  }, [coworkingId]);

  const { data, error, isLoading, refetch } = useQuery<CoworkingProps>(getCoworkings);
  if (!data) return null;


  const coworking = data[0];

  const photos = getPhotosForGallery(coworking?.collageImages);

  return (
    <div className="coworking-container">
      {isLoading ? (
        <p>Loading....</p>
      ) : (
        <>
          <div className="coworking-container1">
            <div className="coworking-container3">
              <span className="coworking-text12" style={{ textAlign: 'center' }}>
                {(coworking?.title || 'Untitled title')} <br />
                <em style={{ fontSize: '20px' }}>{coworking?.location}</em>
              </span>
              <Stack flexDirection="row-reverse" gap={3} width='100%'>
                <Stack width="30%" height="500px" flex={0.5} style={{ background: 'white', borderRadius: '10px', padding: '20px 10px' }}>
                  <BookingDatePicker />
                </Stack>
                <Stack flex={1}>
                  <div className="coworking-text13">
                    <div
                      dangerouslySetInnerHTML={{
                        __html: coworking?.description ?? ' ',
                      }}
                    />
                  </div>
                </Stack>
              </Stack>
            </div>
          </div>
          {!!photos.length && <Stack marginTop='100px' width="100%" paddingLeft="4em" paddingRight="4em">
            <Typography variant='h4' margin="0 0 30px 0">Gallery</Typography>
            <Gallery photos={photos} />
          </Stack>}
          <div className="coworking-container4">
            {coworking?.benefits.length && <div className="coworking-container5">
              <span className="coworking-text16">Benefits</span>
              <Stack className="coworking-container6" flexDirection="row" flexWrap="wrap">
                {coworking?.benefits.map(benefit => (
                  <BenefitItem key={benefit} className="benefit-item-root-class-name">{benefit}</BenefitItem>
                ))}
              </Stack>
            </div>}
            {coworking?.rules && <div style={{ marginTop: '60px' }} dangerouslySetInnerHTML={{ __html: coworking?.rules || '' }} />}
          </div>
          <CommentsSection coworkingId={coworkingId} />
        </>
      )}
    </div>
  );
};

export default Coworking;
