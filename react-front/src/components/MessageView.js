import React, { useState, useEffect } from 'react'
import messageService from '../services/messages'

const MessageView = ({url}) => {
  const [passwordInput, setPasswordInput] = useState('');
  const [message, setMessage] = useState('');
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
        setMessage(data.message); // TODO other parameters
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
    (<ShowMsg msg={message}/>)
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

const ShowMsg = ({msg}) => {
  return (
    <>
      <h2>Your secret message:</h2>
      <div>{msg}</div>
    </>
  )
}

export default MessageView;