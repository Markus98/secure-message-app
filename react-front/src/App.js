import './App.css';
import React, { useState, useEffect } from 'react'
import  messageService from './services/messages';

//dont bother checking this, just renders the messages into frontend.
function App() {

  const [messages, setMessages] = useState([]);

  useEffect(() => {
    messageService.get_messages().then(messages => 
      setMessages(messages));
  }, []);

  if (messages.length> 0) {
    return (
      <div className="App">
        {messages.map(message => <div key={message.url}>{message.crymessage}</div>)}
      </div>
    );
  }
  else {
    return <div>loading...</div>
  }
}

export default App;
