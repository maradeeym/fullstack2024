import React from 'react';
import ReactDOM from 'react-dom/client';
import { createStore } from 'redux';
import reducer from './reducer';

const store = createStore(reducer);

const App = () => {
  const handleAction = (actionType) => {
    store.dispatch({
      type: actionType,
    });
  };

  return (
    <div>
      <button onClick={() => handleAction('GOOD')}>good</button>
      <button onClick={() => handleAction('OK')}>ok</button>
      <button onClick={() => handleAction('BAD')}>bad</button>
      <button onClick={() => handleAction('ZERO')}>reset stats</button>
      <div>good {store.getState().good}</div>
      <div>ok {store.getState().ok}</div>
      <div>bad {store.getState().bad}</div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));

const renderApp = () => {
  console.log('Current state:', store.getState());
  root.render(<App />);
}

renderApp();
store.subscribe(renderApp);

