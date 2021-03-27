import React, { useState, useEffect } from 'react'
import messageService from '../services/messages'

const MessageView = ({url}) => {
  const [passwordInput, setPasswordInput] = useState('');

  const [message, setMessage] = useState('');
  const [readLimit, setReadLimit] = useState({timesread: 0, readlimit: 10});
  const [lifeTime, setLifeTime] = useState({timeleft: 10, timetotal: 10});
  const [timeStamp, setTimeStamp] = useState('');

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
        //timer is currently not real time
        setLifeTime({timeleft: (data.lifetime - data.aliveTimeLeft)/1000, timetotal: data.lifetime/1000})
        //turns it into string timestamp
        setTimeStamp((new Date(data.timestamp)).toString())
        setSuccess(true);
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  }
  useEffect( () => fetchMessage(null), []);

  return loading ?
    (<h2>Getting the message</h2>)
    : !exists ?
    (<h2>This URL does not contain any messages</h2>)
    : successful ?
    (<ShowMsg msg={message} readlimit = {readLimit} lifetime = {lifeTime} timestamp = {timeStamp}/>)
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

const ShowMsg = ({msg,readlimit,lifetime,timestamp}) => {
  return (
    <>
      <h2>Your secret message:</h2>
      <h4>{msg}</h4>
      <p>Times this message has been accessed {readlimit.timesread}/{readlimit.readlimit} </p>
      <p>Seconds left until message is deleted {Math.round(lifetime.timeleft)}/{lifetime.timetotal} </p>
      <p>Date created {timestamp} </p>
    </>
  )
}
export default MessageView;