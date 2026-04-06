import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

import { socket } from '../socket'; 

const ChatPanel = ({ targetUser }) => {
    const [message, setMessage] = useState("");
    const [chatHistory, setChatHistory] = useState([]);

    useEffect(() => {
        // Listen for incoming messages
        socket.on('receive_message', (data) => {
            setChatHistory((prev) => [...prev, { ...data, type: 'received' }]);
        });

        return () => socket.off('receive_message');
    }, []);

    const sendMessage = () => {
        if (message.trim() === "") return;

        const data = {
            targetId: targetUser.id,
            text: message
        };

        // 1. Server ko bhejo
        socket.emit('send_message', data);

        // 2. Apni screen par add karo
        setChatHistory((prev) => [...prev, { text: message, type: 'sent', time: 'Just now' }]);

        // 3. Input clear karo
        setMessage("");
    };

    return (
        <div className="flex flex-col h-full bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
            {/* Header */}
            <div className="p-4 bg-indigo-50 border-b border-indigo-100 flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                    {targetUser.name[0]}
                </div>
                <div>
                    <h3 className="font-bold text-slate-800 text-sm">Chatting with</h3>
                    <p className="text-xs text-indigo-600 font-medium">@{targetUser.name}</p>
                </div>
            </div>

            {/* Message Area */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 flex flex-col">
                <div className="bg-indigo-100 p-3 rounded-2xl rounded-tl-none text-sm text-slate-700 self-start max-w-[80%]">
                    System: You are now in proximity!
                </div>

                {chatHistory.map((msg, index) => (
                    <div
                        key={index}
                        className={`p-3 rounded-2xl text-sm max-w-[80%] ${msg.type === 'sent'
                                ? 'bg-indigo-600 text-white self-end rounded-tr-none'
                                : 'bg-slate-100 text-slate-700 self-start rounded-tl-none'
                            }`}
                    >
                        {msg.text}
                    </div>
                ))}
            </div>

            {/* Input Form */}
            <div className="p-4 border-t border-slate-100">
                <form
                    onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
                    className="flex gap-2"
                >
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 bg-slate-100 border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                    <button
                        type="submit"
                        className="bg-indigo-600 text-white p-2 rounded-xl hover:bg-indigo-500 transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                        </svg>
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChatPanel;