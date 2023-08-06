import React, { useEffect, useState } from "react";
import { database } from './firebase';
import { ref, onValue, push, off, serverTimestamp } from "firebase/database";
import './chat.css'


const Chat = () => {

    const [message, setMessage] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [name, setName] = useState(localStorage.getItem("username") || "John");

    useEffect(() => {
        // Build a listener to fetch messages from firebase
        const messageRef = ref(database, 'message');
        const listener = onValue(messageRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const messageList = Object.values(data);
                setMessage(messageList);
            }
        });
        return () => {
            off(messageRef, listener);
        }
    }, []);

    const sentMessage = (event) => {
        event.preventDefault();
        if (inputMessage.trim() !== '') {
            const messageRef = ref(database, 'message');
            push(messageRef, {
                message: inputMessage,
                timestamp: serverTimestamp(),
                user: name,
            });
            setInputMessage('');
        }
    };

    return (
        <div>
            <div>
                {message.map((content, index) => (
                    <div key={index} className={`message-format ${content.user === name ? 'user' : 'others'}`}>
                        <strong>{content.user}</strong>
                        <br />
                        {content.message}
                    </div>
                ))}
            </div>
            <div>
                <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                />
                <button onClick={sentMessage}>Send</button>
            </div>
        </div>
    );
};

export default Chat;