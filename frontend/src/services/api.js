import axios from "axios";

const API_BASE = "http://localhost:5000/api";

export const createSession = async () => {
  const res = await axios.post(`${API_BASE}/session`);
  return res.data;
};

export const sendMessage = async (sessionId, message) => {
  const res = await axios.post(`${API_BASE}/chat`, {
    session_id: sessionId,
    message: message,
  });
  return res.data;
};

export const resetSession = async (sessionId) => {
  const res = await axios.post(`${API_BASE}/reset`, {
    session_id: sessionId,
  });
  return res.data;
};