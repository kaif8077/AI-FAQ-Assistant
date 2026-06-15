import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 30000,
});

// Send a question with optional sessionId
export const sendQuestion = async (question, sessionId) => {
  const { data } = await api.post('/chat', { question, sessionId });
  return data;
};

// Fetch conversations for a specific session (with optional search)
export const fetchConversations = async (sessionId, search = '') => {
  const params = { sessionId };
  if (search) params.search = search;
  const { data } = await api.get('/conversations', { params });
  return data;
};

// Fetch all conversation sessions (list of threads)
export const fetchSessions = async () => {
  const { data } = await api.get('/conversations/sessions');
  return data;
};

// Delete a single conversation by ID
export const deleteConversation = async (id) => {
  const { data } = await api.delete(`/conversations/${id}`);
  return data;
};