import React, { useState } from 'react'
import messageService from '../services/messages';
import PasswordStrengthBar from 'react-password-strength-bar';

const defaultLifeTime = {days: 0, hours: 1, minutes: 0, seconds: 0};
const defaultReadLimit = 10;

const MessageForm = () => {
  const [message, setMessage] = useState('');
  const [inputDisabled, setinputDisabled] = useState({password: true, lifetime: true, readlimit: true});
  const [password, setPassword] = useState('');
  const [lifeTime, setLifeTime] = useState(defaultLifeTime);
  const [readLimit, setReadLimit] = useState(defaultReadLimit);
  const [url, setUrl] = useState(false);

  const handleMessageCreate = async ({message, password,lifeTime,readLimit}) => {
    try {
      //the response from backend is the URL to the message
      //lifetime is timed by 100 because its in milliseconds, could be done earlier too
      // If disabled don't pass onto the create_message function
      if(inputDisabled.password) password = null;
      if(inputDisabled.lifetime) lifeTime = null;
      if(inputDisabled.readlimit) readLimit = null;
      const data = await messageService.create_message(message, password, lifeTime * 1000, readLimit);
      const fullUrl = window.location.protocol + '//' + window.location.host + '/' + data.generatedUrl;
      setUrl(<a href={fullUrl}>{fullUrl}</a>);
    }
    catch(exception){
      console.log(exception);
    }
  }

  function timeToSeconds(timeDict) {
    return ((((parseInt(timeDict.days) * 24 + parseInt(timeDict.hours)) * 60 + parseInt(timeDict.minutes)) * 60) + parseInt(timeDict.seconds));
  } 

  const addMessage = async (event) => {
    event.preventDefault();
    //there has to be a message
    if (message !== '') {
      handleMessageCreate({
        message: message,
        password: password,
        lifeTime: timeToSeconds(lifeTime),
        readLimit: parseInt(readLimit)
      });
      setMessage('');
    }
    setPassword('');
  }

  //does different stuff depending on the value checked
  const handleCheckChange = (e,checkType) => {
    if (checkType === 'password') {
      setinputDisabled({...inputDisabled, password: !e.target.checked});
      setPassword('');
    }
    else if (checkType === 'lifetime') {
      setinputDisabled({...inputDisabled, lifetime: !e.target.checked});
      setLifeTime(defaultLifeTime);
    }
    else if (checkType === 'readlimit') {
      setinputDisabled({...inputDisabled, readlimit: !e.target.checked});
      setReadLimit(defaultReadLimit);
    }
  }

  const handleLifeTimeChange = (e,time) => {
    if (time === 'days') {
      setLifeTime({...lifeTime,days: e.target.value});
    }
    else if (time === 'hours') {
      setLifeTime({...lifeTime,hours: e.target.value});
    }
    else if (time === 'minutes') {
      setLifeTime({...lifeTime,minutes: e.target.value});
    }
    else if (time === 'seconds') {
      setLifeTime({...lifeTime,seconds: e.target.value});
    }
  }
  
  //just a simple form, the lifetime part needs to be reworked
  return (
    <div className = 'formMessage'>
      <h2>Create a new message</h2>
      <h4>You can choose the extra security measures below</h4>
      <form onSubmit={addMessage}>
        <div> Message: <div><textarea id = 'message' value ={message} onChange={({ target }) => setMessage(target.value)} rows={5} cols={30}/></div></div>
        <div> Password:</div><div><input id = 'password' value = {password} onChange={({ target }) => setPassword(target.value)} type='password' disabled = {inputDisabled.password} hidden = {inputDisabled.password}/>
        <input type='checkbox' checked={!inputDisabled.password} onChange={e => handleCheckChange(e,'password')}/></div>
        <div hidden = {inputDisabled.password}><PasswordStrengthBar password={password} style={{width: '10%', padding: '0.1% 44.5%'}}/></div>
        <div> Lifetime D/H/M/S: </div>
        <div><input id = 'lifetime_days' value ={lifeTime.days} onChange={e => handleLifeTimeChange(e,'days')} type = 'number' 
        min = '0' max = '365' disabled = {inputDisabled.lifetime} hidden = {inputDisabled.lifetime}/>
        <input id = 'lifetime_hours' value ={lifeTime.hours} onChange={e => handleLifeTimeChange(e,'hours')} type = 'number' 
        min = '0' max = '24' disabled = {inputDisabled.lifetime} hidden = {inputDisabled.lifetime} />
        <input id = 'lifetime_minutes' value ={lifeTime.minutes} onChange={e => handleLifeTimeChange(e,'minutes')} type = 'number' 
        min = '0' max = '60' disabled = {inputDisabled.lifetime} hidden = {inputDisabled.lifetime}/>
        <input id = 'lifetime_seconds' value ={lifeTime.seconds} onChange={e => handleLifeTimeChange(e,'seconds')} type = 'number' 
        min = '0' max = '60' disabled = {inputDisabled.lifetime} hidden = {inputDisabled.lifetime}/>
        <input type='checkbox' checked={!inputDisabled.lifetime} onChange={e => handleCheckChange(e,'lifetime')}/></div>
        
        <div> ReadLimit:</div><div><input id = 'readlimit' value = {readLimit} onChange={({ target }) => setReadLimit(target.value)} type="number" 
        min = '1' max = '10000' disabled = {inputDisabled.readlimit} hidden = {inputDisabled.readlimit}/>
        <input type='checkbox' checked={!inputDisabled.readlimit} onChange={e => handleCheckChange(e,'readlimit')}/></div>
        <button id = 'create-message' type='submit'>create</button>
      </form>
      <h4> When the message has been created, the url will be shown below</h4>
      <p>{url}</p>
    </div>
  )
}

export default MessageForm;