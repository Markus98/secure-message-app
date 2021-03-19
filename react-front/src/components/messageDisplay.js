import React from 'react';

const MessageDisplay = (messages, messageUrl) => {

  let password;
  //does nothing rn
  const passwordForm = () => {
    return (<form name="passwordForm"> 
      <label>
        <h1>Password:</h1>
        <input type="text" name="Password" value={password} />
      </label>
      <button type="button" name="Submit">Submit</button>
    </form>)
  }
  //I love if else
  const message = messageUrl ? messages.find(mes => mes.url === messageUrl.params.id) : null;
  if (message) {
    if (!message.password) {
      return (
        <div>  
          {message.message}
        </div>
      )}
      else { return ( <div> {passwordForm()}</div> )} }
  else { return (<div>There is nothing here</div>) } 
}

  export default MessageDisplay;

  //
  //  