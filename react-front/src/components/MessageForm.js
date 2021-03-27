import React, { useState } from 'react'
import messageService from '../services/messages';

const defaultLifeTime = 100;
const defaultReadLimit = 10;

const MessageForm = () => {
  const [message, setMessage] = useState('');
  const [inputEnabled, setInputEnabled] = useState({password: false, lifetime: false, readlimit: false});
  const [password, setPassword] = useState('');
  const [lifeTime, setLifeTime] = useState(defaultLifeTime);
  const [readLimit, setReadLimit] = useState(defaultReadLimit);
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

  //does different stuff depending on the value checked
  const handleCheckChange = (e,checkType) => {
    if (checkType === 'password') {
      setInputEnabled({...inputEnabled, password: !e.target.checked});
      setPassword('');
    }
    else if (checkType === 'lifetime') {
      setInputEnabled({...inputEnabled, lifetime: !e.target.checked});
      setLifeTime(defaultLifeTime);
    }
    else if (checkType === 'readlimit') {
      setInputEnabled({...inputEnabled, readlimit: !e.target.checked});
      setReadLimit(defaultReadLimit);
    }
  }


  
  //just a simple form, the lifetime part needs to be reworked
  return (
    <div className = 'formMessage'>
      <h2>Create a new message</h2>
      <h4>If you do not want to use a password for extra protection, leave the field blank</h4>
      <form onSubmit={addMessage}>
        <div> message: <div><textarea id = 'message' value ={message} onChange={({ target }) => setMessage(target.value)} rows={5} cols={30}/></div></div>
        <div> password:<input id = 'password' value = {password} onChange={({ target }) => setPassword(target.value)} type='password' disabled = {inputEnabled.password}/>
        <input type='checkbox' checked={!inputEnabled.password} onChange={e => handleCheckChange(e,'password')}/></div>
        <div> lifetime: <input id = 'lifetime' value ={lifeTime} onChange={({ target }) => setLifeTime(target.value)} type = 'number' 
        min = '10' max = '100000' disabled = {inputEnabled.lifetime}/>
        <input type='checkbox' checked={!inputEnabled.lifetime} onChange={e => handleCheckChange(e,'lifetime')}/></div>
        <div> readlimit:<input id = 'readlimit' value = {readLimit} onChange={({ target }) => setReadLimit(target.value)} type="number" 
        min = '1' max = '10000' disabled = {inputEnabled.readlimit}/>
        <input type='checkbox' checked={!inputEnabled.readlimit} onChange={e => handleCheckChange(e,'readlimit')}/></div>
        <button id = 'create-message' type='submit'>create</button>
      </form>
      <h4> When the message has been created, the url will be shown below</h4>
      <p>{url}</p>
    </div>
  )
}

export default MessageForm;