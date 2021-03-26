import './App.css';
import React from 'react';
import {
  Switch, Route, useRouteMatch
} from 'react-router-dom';

import MessageForm from './components/MessageForm';
import MessageView from './components/MessageView';

function App() {
  const messageMatch = useRouteMatch('/:id');
  return (
    <div className='App'>
      <Switch>
        <Route path = '/:id'>
          <MessageView messageMatch = {messageMatch}/>
        </Route>
        <Route path = '/'>
          <MessageForm />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
