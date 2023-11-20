import ReactDOM from 'react-dom';
import Modal from 'react-modal';
import { Provider } from 'react-redux';

import './index.css';

// import App from './App';
// import store from './redux/store';
import App from './App';
import store from './redux/store';

Modal.setAppElement('#root');

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root'),
);
