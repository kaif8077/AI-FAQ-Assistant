import { format } from 'date-fns';

export default function ChatMessage({ message, type, timestamp }) {
  const isUser = type === 'user';
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-fade-in`}>
      <div className={`max-w-[80%] px-4 py-3 rounded-2xl shadow-md ${isUser ? 'bg-blue-500 text-white rounded-tr-sm' : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-tl-sm'}`}>
        <div className="break-words">{message}</div>
        {timestamp && <div className={`text-xs mt-1 opacity-70 ${isUser ? 'text-blue-100' : 'text-gray-500'}`}>{format(new Date(timestamp), 'h:mm a')}</div>}
      </div>
    </div>
  );
}