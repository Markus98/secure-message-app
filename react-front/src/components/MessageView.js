import React, { useState } from 'react'

const MessageView = ({messages, messageMatch}) => {

    const [passwordInput, setPasswordInput] = useState('');
    const [showMessage, setShowMessage] = useState(false);

    function returnCurrentMessage() {
        return messageMatch ? messages.find(mes => mes.url === messageMatch.params.id) : null;
      }
  
    const handlePassword = async (event) => {
        event.preventDefault()
        const message = returnCurrentMessage();
        try {
        //this is true for only this page
        //maybe doing this check should be done in backend, and we never pass the password to frontend
        //obviously when everything is encrypted its in the backend
        if (message.password===passwordInput) {
            setShowMessage(true);
        }
            setPasswordInput('');
        } catch(exception) {
        console.log(exception);
        }
    }
    //form where you enter the password
    const passwordForm = () => {
      return (<form name='passwordForm' onSubmit={handlePassword}> 
        <label>
          <h3>This file requires a password to access</h3>
          <h4>Password:</h4>
          <input type='text' value={passwordInput} onChange={({ target }) => setPasswordInput(target.value)}/>
        </label>
        <button id='enter-password' type='submit' >Submit</button>
      </form>)
    }

    //could be written more elegantly, basically there to make sure that either there is no password
    //or that in the current tab the password has been entered correctly
    const message = returnCurrentMessage();
    if (!message.password || showMessage === true) {
        return (<h2> {message.message} </h2>);
    }
    else {
        return passwordForm();
    }
  }

  export default MessageView;