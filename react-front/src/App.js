import './App.css';
import React, { useState, useEffect } from 'react';
import {
  Switch, Route, useRouteMatch
} from 'react-router-dom';

import messageService from './services/messages';
import MessageForm from './components/MessageForm';
import MessageView from './components/MessageView';

//dont bother checking this, just renders the messages into frontend.
function App() {

  const messageMatch = useRouteMatch('/:id');
  //crashes on wrong id, since no way to know if messagematch exists
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
