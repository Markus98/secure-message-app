import React, { useState } from 'react'
import messageService from '../services/messages';

const MessageForm = () => {
  const [message, setMessage] = useState('');
  const [password, setPassword] = useState('');
  const [lifeTime, setLifeTime] = useState(100);
  const [readLimit, setReadLimit] = useState(10);
  const [url, setUrl] = useState(false);

  const handleMessageCreate = async ({message, password,lifeTime,readLimit}) => {
    try {
      //the response from backend is the URL to the message
      //lifetime is timed by 100 because its in milliseconds, could be done earlier too
      const data = await messageService.create_message(message, password, lifeTime*1000, readLimit);
      const fullUrl = window.location.protocol + '//' + window.location.host + '/' + data.generatedUrl;
      setUrl(<a href={fullUrl}>{fullUrl}</a>);
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
        password: password,
        lifeTime: lifeTime,
        readLimit: readLimit
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
        <div> password:<input id = 'password' value = {password} onChange={({ target }) => setPassword(target.value)} type="password"/></div>
        <div> lifetime: <input id = 'lifetime' value ={lifeTime} onChange={({ target }) => setLifeTime(target.value)} type = 'number' /></div>
        <div> readlimit:<input id = 'readlimit' value = {readLimit} onChange={({ target }) => setReadLimit(target.value)} type="number"/></div>
        <button id = 'create-message' type="submit">create</button>
      </form>
      <h4> When the message has been created, the url will be shown below</h4>
      <p>{url}</p>
    </div>
  )
}

export default MessageForm;