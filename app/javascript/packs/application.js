// This file is automatically compiled by Webpack, along with any other files
// present in this directory. You're encouraged to place your actual application logic in
// a relevant structure within app/javascript and only use these pack files to reference
// that code so it'll be compiled.

// NOTE: don't need packages below as this functionality isn't in use
// add to package.json if needed
// require('@rails/ujs').start();
// require('turbolinks').start();
// require('@rails/activestorage').start();
// require('channels');

import { render } from 'react-dom';
import App from '../components/App';
import allReducers from '../reducers';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { AppContextProvider } from '../contexts/AppContext';

import '../styles/application.scss';

const store = createStore(
  allReducers,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

document.addEventListener('DOMContentLoaded', () => {
  const container = document.createElement('div');
  container.classList.add('vh-100');

  render(
    <Provider store={store}>
      <DndProvider backend={HTML5Backend}>
        <AppContextProvider>
          <App />
        </AppContextProvider>
      </DndProvider>
    </Provider>,
    document.body.appendChild(container)
  );
});
