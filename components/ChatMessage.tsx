
import React from 'react';
import { Sender } from '../types';
import type { Message } from '../types';


const BotIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-8 h-8 text-indigo-400"
  >
    <path
      fillRule="evenodd"
      d="M4.5 3.75a3 3 0 00-3 3v10.5a3 3 0 003 3h15a3 3 0 003-3V6.75a3 3 0 00-3-3h-15zm4.125 3a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5zm-3.873 4.5a.75.75 0 01.75-.75h6.375a.75.75 0 010 1.5H5.502a.75.75 0 01-.75-.75zM15.375 8.25a2.25 2.25 0 104.5 0 2.25 2.25 0 00-4.5 0z"
      clipRule="evenodd"
    />
  </svg>
);

const UserIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-8 h-8 text-teal-400"
  >
    <path
      fillRule="evenodd"
      d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z"
      clipRule="evenodd"
    />
  </svg>
);


const ChatMessage: React.FC<{ message: Message }> = ({ message }) => {
  const isBot = message.sender === Sender.Bot;

  const messageClasses = isBot
    ? 'bg-gray-700/50 text-gray-200'
    : 'bg-indigo-600/70 text-white';

  const containerClasses = isBot
    ? 'justify-start'
    : 'justify-end';

  return (
    <div className={`flex items-end gap-3 my-2 ${containerClasses}`}>
      {isBot && <div className="flex-shrink-0"><BotIcon /></div>}
      <div className={`max-w-md md:max-w-lg lg:max-w-xl p-4 rounded-2xl shadow-md ${messageClasses}`}>
        <p className="text-base">{message.text}</p>
      </div>
       {!isBot && <div className="flex-shrink-0"><UserIcon /></div>}
    </div>
  );
};

export default ChatMessage;
