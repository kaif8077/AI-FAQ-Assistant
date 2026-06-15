import { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';

const ChatInput = ({ onSend, isLoading, disabled = false }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !isLoading && !disabled) {
      onSend(input.trim());
      setInput('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();  // Prevents new line
      handleSubmit(e);
    }
    // Shift+Enter will naturally insert a new line (no preventDefault)
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="relative flex items-center gap-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={disabled ? "Please create a conversation first" : "Ask me anything..."}
          rows={1}
          className="w-full px-5 py-3 pr-24 rounded-2xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-200"
          disabled={isLoading || disabled}
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading || disabled}
          className="absolute right-2 p-2 rounded-xl bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-white"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </button>
      </div>
    </form>
  );
};

export default ChatInput;