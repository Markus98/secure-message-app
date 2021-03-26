import React, { useState } from 'react'
import messageService from '../services/messages';

const MessageForm = () => {
  const [message, setMessage] = useState('');
  const [password, setPassword] = useState('');
  const [url, setUrl] = useState(false);

  const handleMessageCreate = async ({message, password}) => {
    try {
      //the response from backend is the URL
      const data = await messageService.create_message(message, password, null, null);
      setUrl(data.generatedUrl);
    }
    catch(exception){
      console.log(exception);
    }
  }

  const addMessage = async (event) => {
    event.preventDefault();
    //there has to be a message
    if (message !== '') {
      handleMessageCreate({
        message: message,
        password: password
      });
      setMessage('');
    }
    setPassword('');
  }

  //just a simple form
  return (
    <div className = 'formMessage'>
      <h2>Create a new message</h2>
      <h4>If you do not want to use a password for extra protection, leave the field blank</h4>
      <form onSubmit={addMessage}>
        <div> message: <input id = 'message' value ={message} onChange={({ target }) => setMessage(target.value)}/></div>
        <div> password:<input id = 'password' value = {password} onChange={({ target }) => setPassword(target.value)}/></div>
        <button id = 'create-message' type="submit">create</button>
      </form>
      <h4> When the message has been created, the url will be shown below</h4>
      <p>{url}</p>
    </div>
  )
}

export default MessageForm;