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

import { createRoot } from 'react-dom/client';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import App from './components/App';
import allReducers from './reducers';
import { AppContextProvider } from './contexts/AppContext';

const store = createStore(
  allReducers,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

document.addEventListener('DOMContentLoaded', () => {
  let container = document.getElementById('app');
  container.classList.add('vh-100');
  const root = createRoot(container);
  root.render(
    <Provider store={store}>
      <DndProvider backend={HTML5Backend}>
        <AppContextProvider>
          <App />
        </AppContextProvider>
      </DndProvider>
    </Provider>
  );
});
