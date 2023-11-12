import './outline-button.css';

interface OutlineButton {
  text: string;
}
const OutlineButton = (props: OutlineButton) => {
  return (
    <div className="outline-button-container">
      <button className="outline-button-button button Button">
        {props.text}
      </button>
    </div>
  );
};

OutlineButton.defaultProps = {
  text: 'Button',
};


export default OutlineButton;
