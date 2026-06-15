import { useState, useEffect, useCallback, useRef } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import ChatMessage from './components/ChatMessage';
import ChatInput from './components/ChatInput';
import TypingIndicator from './components/TypingIndicator';
import SearchBar from './components/SearchBar';
import DarkModeToggle from './components/DarkModeToggle';
import { sendQuestion, fetchConversations, fetchSessions, deleteConversation } from './services/api';
import { MessageSquare, Sparkles, Trash2, Plus } from 'lucide-react';

function App() {
  const [sessions, setSessions] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const hasLoadedSessions = useRef(false);

  // Format a timestamp into a human-readable string (like ChatGPT)
  const formatSessionTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const isToday = date >= today;
    const isYesterday = date >= yesterday && date < today;
    
    const timeStr = date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    
    if (isToday) return `Today ${timeStr}`;
    if (isYesterday) return `Yesterday ${timeStr}`;
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' }) + ` ${timeStr}`;
  };

  // Generate a readable name from sessionId
  const getSessionDisplayName = (sessionId) => {
    if (!sessionId) return 'Unknown';
    if (sessionId === 'default') return '📁 Old Chats';
    const parts = sessionId.split('_');
    if (parts.length < 2) return '💬 New Chat';
    const timestamp = parseInt(parts[1]);
    if (isNaN(timestamp)) return '💬 New Chat';
    return `💬 ${formatSessionTime(timestamp)}`;
  };

  // Load sessions from backend and enrich with display name
  const loadSessions = async () => {
    try {
      const data = await fetchSessions();
      if (data.success && Array.isArray(data.sessions) && data.sessions.length > 0) {
        const enriched = data.sessions.map(s => ({
          ...s,
          displayName: getSessionDisplayName(s.sessionId)
        }));
        setSessions(enriched);
        if (!currentSessionId) {
          setCurrentSessionId(enriched[0].sessionId);
        }
      } else {
        setSessions([]);
        setCurrentSessionId(null);
      }
    } catch (error) {
      console.error('Failed to load sessions:', error);
      setSessions([]);
      setCurrentSessionId(null);
    }
  };

  useEffect(() => {
    if (hasLoadedSessions.current) return;
    hasLoadedSessions.current = true;
    loadSessions();
  }, []);

  const createNewSession = () => {
    const newId = `session_${Date.now()}`;
    setCurrentSessionId(newId);
    setMessages([]);
    const newSession = {
      sessionId: newId,
      lastUpdated: new Date(),
      count: 0,
      displayName: getSessionDisplayName(newId)
    };
    setSessions(prev => [newSession, ...prev]);
    toast.success('New conversation started');
  };

  const loadMessagesForSession = useCallback(async (sessionId, search) => {
    if (!sessionId) return;
    try {
      const data = await fetchConversations(sessionId, search);
      if (data.success && Array.isArray(data.conversations)) {
        const flattened = data.conversations
          .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
          .flatMap(conv => [
            { id: `${conv._id}-q`, type: 'user', content: conv.question, timestamp: conv.timestamp },
            { id: `${conv._id}-a`, type: 'bot', content: conv.answer, timestamp: conv.timestamp },
          ]);
        setMessages(flattened);
      } else {
        setMessages([]);
      }
    } catch (error) {
      console.error('Failed to load messages:', error);
      setMessages([]);
    }
  }, []);

  useEffect(() => {
    if (currentSessionId) {
      loadMessagesForSession(currentSessionId, searchQuery);
    }
  }, [currentSessionId, searchQuery, loadMessagesForSession]);

  const handleSend = async (question) => {
    if (!currentSessionId) {
      toast.error('Please create a new conversation first');
      return;
    }
    const userMsg = {
      id: Date.now(),
      type: 'user',
      content: question,
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      await sendQuestion(question, currentSessionId);
      await loadMessagesForSession(currentSessionId, searchQuery);
      // Refresh sessions to update message count (but we no longer display it)
      const data = await fetchSessions();
      if (data.success && Array.isArray(data.sessions)) {
        const enriched = data.sessions.map(s => ({
          ...s,
          displayName: getSessionDisplayName(s.sessionId)
        }));
        setSessions(enriched);
      }
      toast.success('Answer received!');
    } catch (err) {
      toast.error(err.message || 'Failed to get response');
      setMessages(prev => prev.filter(m => m.id !== userMsg.id));
    } finally {
      setIsLoading(false);
    }
  };

  const switchSession = (sessionId) => {
    if (!sessionId) return;
    setCurrentSessionId(sessionId);
    setSearchQuery('');
  };

  const clearCurrentSession = async () => {
    if (!currentSessionId) return;
    if (window.confirm('Delete ALL messages in this conversation? This cannot be undone.')) {
      try {
        const data = await fetchConversations(currentSessionId, '');
        if (data.success && Array.isArray(data.conversations)) {
          for (const conv of data.conversations) {
            await deleteConversation(conv._id);
          }
        }
        await loadMessagesForSession(currentSessionId, searchQuery);
        const sessionsData = await fetchSessions();
        if (sessionsData.success && Array.isArray(sessionsData.sessions)) {
          const enriched = sessionsData.sessions.map(s => ({
            ...s,
            displayName: getSessionDisplayName(s.sessionId)
          }));
          setSessions(enriched);
        }
        toast.success('Conversation cleared');
      } catch (err) {
        toast.error('Failed to clear conversation');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Toaster position="top-right" />
      
      <header className="sticky top-0 backdrop-blur-lg border-b dark:border-gray-700 p-4 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-blue-500" />
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            AI FAQ Assistant
          </h1>
        </div>
        <div className="flex gap-2">
          {messages.length > 0 && (
            <button onClick={clearCurrentSession} className="p-2 rounded-xl bg-red-100 dark:bg-red-900/30 text-red-600 hover:bg-red-200 dark:hover:bg-red-900/50 transition" title="Clear current conversation">
              <Trash2 className="w-5 h-5" />
            </button>
          )}
          <DarkModeToggle />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-4 flex-col md:flex-row">
          {/* Sidebar */}
          <div className="md:w-64 bg-gray-100/50 dark:bg-gray-800/50 rounded-2xl backdrop-blur-sm p-3 h-[70vh] overflow-y-auto border dark:border-gray-700">
            <button onClick={createNewSession} className="w-full mb-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition">
              <Plus className="w-4 h-4" /> New Conversation
            </button>
            <div className="space-y-2">
              {sessions.map(s => (
                <div
                  key={s.sessionId}
                  onClick={() => switchSession(s.sessionId)}
                  className={`p-2 rounded-xl cursor-pointer transition ${
                    currentSessionId === s.sessionId
                      ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300'
                      : 'hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  <div className="text-sm font-medium truncate">
                    {s.displayName}
                  </div>
                  {/* Message count removed - no numbers shown */}
                </div>
              ))}
              {sessions.length === 0 && (
                <div className="text-center text-gray-500 text-sm py-4">
                  No conversations yet<br/>
                  <button onClick={createNewSession} className="text-blue-500 underline mt-1">Create one</button>
                </div>
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 bg-white/50 dark:bg-gray-900/50 rounded-2xl shadow-xl backdrop-blur-sm border dark:border-gray-700 overflow-hidden">
            <div className="p-4 border-b dark:border-gray-700">
              <SearchBar onSearch={setSearchQuery} value={searchQuery} />
            </div>
            <div className="h-[60vh] overflow-y-auto p-6 space-y-4">
              {!currentSessionId && (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <MessageSquare className="w-16 h-16 text-blue-400 mb-4" />
                  <h3 className="text-xl font-semibold">No conversation selected</h3>
                  <p className="text-gray-500 mb-4">Click "New Conversation" to start chatting.</p>
                  <button onClick={createNewSession} className="bg-blue-500 text-white px-4 py-2 rounded-lg">Start New Chat</button>
                </div>
              )}
              {currentSessionId && messages.length === 0 && !isLoading && (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <MessageSquare className="w-16 h-16 text-blue-400 mb-4" />
                  <h3 className="text-xl font-semibold">Start a conversation</h3>
                  <p className="text-gray-500">Ask anything – I'm powered by AI.</p>
                </div>
              )}
              {messages.map(msg => (
                <ChatMessage key={msg.id} message={msg.content} type={msg.type} timestamp={msg.timestamp} />
              ))}
              {isLoading && <TypingIndicator />}
            </div>
            <div className="border-t dark:border-gray-700 p-4 bg-white/30">
              <ChatInput onSend={handleSend} isLoading={isLoading} disabled={!currentSessionId} />
              <p className="text-xs text-center text-gray-500 mt-2">Enter to send, Shift+Enter for new line</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;