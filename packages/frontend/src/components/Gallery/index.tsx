import ImageGallery, { ReactImageGalleryItem } from 'react-image-gallery';
// import stylesheet if you're not already using CSS @import
import 'react-image-gallery/styles/css/image-gallery.css';

type GalleryProps = {
  photos: ReadonlyArray<ReactImageGalleryItem>;
}

export const Gallery = ({ photos }:GalleryProps) => {
  return <ImageGallery
    items={photos}
    showPlayButton={false}

  />;
};
