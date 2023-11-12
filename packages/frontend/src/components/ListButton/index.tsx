import './list-button.css';

interface ListButtonProps {
  text: string;
  image_alt: string;
  image_src: string;
  rootClassName: string;
}
const ListButton = (props:ListButtonProps) => {
  return (
    <div className={`list-button-container ${props.rootClassName} `}>
      <button type="button" className="list-button-button button">
        {props.text}
      </button>
    </div>
  );
};

ListButton.defaultProps = {
  text: '',
  image_alt: 'image',
  image_src: 'https://play.teleporthq.io/static/svg/default-img.svg',
  rootClassName: '',
};


export default ListButton;
