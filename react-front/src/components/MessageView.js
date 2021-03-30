import React, { useState, useEffect } from 'react'
import messageService from '../services/messages'

const MessageView = ({url}) => {
  const [passwordInput, setPasswordInput] = useState('');

  const [message, setMessage] = useState('');
  const [readLimit, setReadLimit] = useState({timesread: null, readlimit: null});
  const [expiry, setExpiry] = useState(null);
  const [timeStamp, setTimeStamp] = useState('');
  const [deletion, setDeletion] = useState(null);

  const [successful, setSuccess] = useState(false);
  const [exists, setExists] = useState(false);
  const [loading, setLoading] = useState(true);

  const handlePassword = ({ target }) => setPasswordInput(target.value);

  const submitPassword = async (event) => {
    event.preventDefault()
    fetchMessage(passwordInput)
  }

  // fetch the message in this url form the backend
  const fetchMessage = async (password) => {
    try {
      const data = await messageService.get_message(url, password);
      if(data.exists) {
        setExists(true);
      }
      if(data.message) {
        setMessage(data.message); 
        //define this as an array to save space? Could also be a dictionary for better mobility
        setReadLimit({timesread: data.timesRead, readlimit: data.readLimit})
        if(data.aliveTimeLeft !== null)
        {
          var time = new Date(data.timestamp + data.aliveTimeLeft);
          setExpiry(time);
        }
        //turns it into string timestamp
        setTimeStamp((new Date(data.timestamp)).toString())
        setSuccess(true);
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    fetchMessage(null);
  }, []);
  useEffect( () => {
    if(expiry === null) return;
    const id = setTimeout(() => {
      const diff = new Date(expiry.getTime() - new Date().getTime());
      console.log(diff.getTime())
      if(diff.getTime() < 1000 * 60 * 60 * 24) // only show the time until if the duration is under 24 hours
        setDeletion(diff.getUTCHours() + ":" + diff.getUTCMinutes() + ":" + diff.getUTCSeconds());
    }, 1000);
    return () => clearInterval(id);
  }, [expiry, deletion]);
  
  return loading ?
    (<h2>Getting the message</h2>)
    : !exists ?
    (<h2>This URL does not contain any messages</h2>)
    : successful ?
    (<ShowMsg msg={message} readlimit={readLimit} deletion={deletion} expiry={expiry} timestamp={timeStamp}/>)
    :
    (<PasswordInput onSubmit={submitPassword} handlePassword={handlePassword}passwordInput={passwordInput}/>)
}

const PasswordInput = ({onSubmit, passwordInput, handlePassword}) => {
  return (
    <form name='passwordForm' onSubmit={onSubmit}> 
      <label>
        <h3>This file requires a password to access</h3>
        <h4>Password:</h4>
        <input type='password' value={passwordInput} onChange={handlePassword}/>
      </label>
      <button id='enter-password' type='submit' >Submit</button>
    </form>
  )
} 

const ShowMsg = ({msg, readlimit, deletion, expiry, timestamp}) => {
  return (
    <>
      <h2>Your secret message:</h2>
      <h4>{msg}</h4>
      {readlimit.readlimit !== null
      ? <p>This message has been accessed {readlimit.timesread}/{readlimit.readlimit} times</p>
      : <p>This message has been accessed {readlimit.timesread} times</p>}
      {expiry === null ? null : 
      <>
        <div>Message will be deleted on</div>
        <div>{expiry.toString()}</div>
        {deletion ?
          <>
            <div>Time until deletion</div>
            <div>{deletion}</div>
          </>
        : null}
      </>}
      <div>Message created on</div>
      <div>{timestamp}</div>
    </>
  )
}
export default MessageView;