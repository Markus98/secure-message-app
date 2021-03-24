import './App.css';
import React, { useState, useEffect } from 'react';
import {
  Switch, Route, useRouteMatch
} from 'react-router-dom';

import messageService from './services/messages';
import MessageForm from './components/MessageCreate';
import MessageView from './components/MessageView';

//dont bother checking this, just renders the messages into frontend.
function App() {

  const [messages, setMessages] = useState([]);
  
  useEffect(() => {
    messageService.get_messages().then(messages => 
      setMessages(messages));
  }, [messages.length]);

  const messageMatch = useRouteMatch('/:id');
  //crashes on wrong id, since no way to know if messagematch exists
  if (messages.length>0){
    return (
      <div className='App'>
        <Switch>
          <Route path = '/:id'>
            <MessageView messages = {messages} messageMatch = {messageMatch}/>
          </Route>
          <Route path = '/homepage'>
            <MessageForm />
          </Route>
        </Switch>
      </div>
    );
  }
  else { return <div>loading...</div> }
}

export default App;
