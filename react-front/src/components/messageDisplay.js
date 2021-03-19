export const messageDisplay = (messages, messageUrl) => {
    const message = messageUrl ? messages.find(mes => mes.url === messageUrl.params.id) : null;
    if (message) {
      return (
        <div>  
            {message.crymessage}
        </div>
      )
    }
    else { return <div>There is nothing here</div> }
  }
