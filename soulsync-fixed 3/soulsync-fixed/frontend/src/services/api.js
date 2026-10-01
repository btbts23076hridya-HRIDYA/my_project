const API_BASE = 'https://my-project-f-ndo2.onrender.com';
const getToken = () => localStorage.getItem('soulsync_token');

const authFetch = async (endpoint, options = {}) => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };
  const res = await fetch(`${API_BASE}/api/${endpoint}`, { ...options, headers });
  const data = await res.json();
  if (res.status === 401) {
    localStorage.removeItem('soulsync_token');
    window.location.reload();
  }
  return { ok: res.ok, status: res.status, data };
};

export const authAPI = {
  sendEmailOTP:   (email) => authFetch('auth/send-email-otp',  { method: 'POST', body: JSON.stringify({ email }) }),
  verifyEmailOTP: (email, otp) => authFetch('auth/verify-email-otp', { method: 'POST', body: JSON.stringify({ email, otp }) }),
  signup:         (userData) => authFetch('auth/signup',        { method: 'POST', body: JSON.stringify(userData) }),
  resendOTP:      (email) => authFetch('auth/resend-otp',       { method: 'POST', body: JSON.stringify({ email }) }),
  login:          (email, password) => authFetch('auth/login',  { method: 'POST', body: JSON.stringify({ email, password }) }),
  getMe:          () => authFetch('auth/me'),
  updateProfile:  (updates) => authFetch('auth/profile',        { method: 'PUT',  body: JSON.stringify(updates) }),
};

export const chatAPI = {
  send:       (message) => authFetch('chat/send', { method: 'POST', body: JSON.stringify({ message }) }),
  getToday:   () => authFetch('chat/today'),
  getHistory: () => authFetch('chat/history'),
};

export const journalAPI = {
  create:  (entry) => authFetch('journal/create',      { method: 'POST',   body: JSON.stringify(entry) }),
  getAll:  (page=1)=> authFetch(`journal?page=${page}`),
  getOne:  (id)    => authFetch(`journal/${id}`),
  update:  (id, u) => authFetch(`journal/update/${id}`, { method: 'PUT',   body: JSON.stringify(u) }),
  delete:  (id)    => authFetch(`journal/delete/${id}`, { method: 'DELETE' }),
};

export const moodAPI = {
  add:        (mood, emoji, note='') => authFetch('mood/add', { method: 'POST', body: JSON.stringify({ mood, emoji, note }) }),
  getToday:   () => authFetch('mood/today'),
  getHistory: () => authFetch('mood/history'),
};
