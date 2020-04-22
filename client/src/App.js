import React from 'react';
import './App.css';
import Main from './components/MainComponent'
import 'typeface-roboto';

import { Provider } from 'react-redux'
import store from './redux/store.js'

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <Main />
      </div>
    </Provider>
  );
}

export default App;
