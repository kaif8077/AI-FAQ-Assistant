    export default function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="bg-gray-100 dark:bg-gray-800 px-4 py-3 rounded-2xl rounded-tl-sm">
        <div className="flex gap-1">
          <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
          <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
          <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
        </div>
      </div>
    </div>
  );
}