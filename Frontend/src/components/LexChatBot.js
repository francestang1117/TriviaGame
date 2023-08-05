import React, { useEffect, useState } from 'react';
import AWS from 'aws-sdk';

AWS.config.update({
	region: 'us-east-1',
	credentials: new AWS.Credentials('AKIAZS44T5LDREPJKSMC', 'cLdlDnqm4JCDI/eV4icux4OInXnKJbuzonAUFUil'),
});

const LexV2Chatbot = () => {
  const [chatLog, setChatLog] = useState([]);
  const [uniqueSessionId, setUniqueSessionId] = useState('');

  const lexRuntime = new AWS.LexRuntimeV2({ apiVersion: '2020-08-07' });

  const handleUserInput = async (event) => {
    event.preventDefault();
    const userInput = event.target.userInput.value.trim();
    if (userInput !== '') {
      displayMessage('User: ' + userInput);
      await sendMessageToLex(userInput);
      event.target.userInput.value = '';
    }
  };

  const sendMessageToLex = async (message) => {
    const params = {
      botId: 'SHODDSKRKD',       // Replace with your bot ID
      botAliasId: 'TSTALIASID', // Replace with your bot alias ID
      localeId: 'en_US',           // Replace with your bot locale (e.g., en_US)
      sessionId: uniqueSessionId, // Replace with a unique identifier for each session
      text: message,
    };

    try {
      const data = await lexRuntime.recognizeText(params).promise();
      displayMultipleMessages(data.messages);
    } catch (error) {
      console.error(error);
    }
  };

  const generateSessionId = () => {
    // Generate a random string of specified length
    const randomString = (length) => {
      let result = '';
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      const charactersLength = characters.length;
      for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
      }
      return result;
    };

    // Get the current timestamp (number of milliseconds since 1 January 1970 00:00:00 UTC)
    const timestamp = Date.now();
  
    // Combine the random string and timestamp to create a unique session ID
    const sessionId = randomString(2) + timestamp;
  
    return sessionId;
  };

  const displayMultipleMessages = (messages) => {
    const newMessages = messages.filter((message) => message.contentType === 'PlainText').map((message) => 'Bot: ' + message.content);
    setChatLog((prevChatLog) => [...prevChatLog, ...newMessages]);
  };

  const displayMessage = (message) => {
    setChatLog((prevChatLog) => [...prevChatLog, message]);
  };

  useEffect(() => {
    const id = generateSessionId();
    setUniqueSessionId(id);
    console.log(id);
  }, []); // The empty array makes this run only on component load

  return (
    <div id="chat-interface">
      <div id="chat-log">
        {chatLog.map((message, index) => (
          <p key={index}>{message}</p>
        ))}
      </div>
      <form onSubmit={handleUserInput}>
        <input type="text" name="userInput" placeholder="Type your message..." />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default LexV2Chatbot;
