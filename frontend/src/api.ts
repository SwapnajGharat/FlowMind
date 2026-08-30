const API_BASE = '/api';

const request = async <T>(path: string, init?: RequestInit): Promise<T> => {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...init?.headers },
    ...init,
  });
  if (!response.ok) throw new Error((await response.json().catch(() => ({}))).error || 'Request failed.');
  return response.json() as Promise<T>;
};

export const api = {
  getState: (sessionId: string) => request<{ messages: any[]; checklist: { itemId: string; status: string }[] }>(`/state/${sessionId}`),
  sendChat: (sessionId: string, text: string) => request<{ user: any; reply: any }>('/chat', { method: 'POST', body: JSON.stringify({ sessionId, text }) }),
  runAudit: (sessionId: string, query: string) => request<{ data: Record<string, unknown> }>('/audit', { method: 'POST', body: JSON.stringify({ sessionId, query }) }),
  productLookup: (sessionId: string, query: string) => request<{ details: string }>('/product-lookup', { method: 'POST', body: JSON.stringify({ sessionId, query }) }),
  findRagLabs: (sessionId: string, category: string) => request<{ labs: any[] }>(`/rag-labs?sessionId=${encodeURIComponent(sessionId)}&category=${encodeURIComponent(category)}`),
  sendVoice: async (sessionId: string, audio: File) => {
    const form = new FormData(); form.append('file', audio);
    const response = await fetch(`${API_BASE}/voice-query?sessionId=${encodeURIComponent(sessionId)}`, { method: 'POST', body: form });
    if (!response.ok) throw new Error((await response.json().catch(() => ({}))).error || 'Voice request failed.');
    return response.json() as Promise<{ user: any; reply: any; transcription: string }>;
  },
  updateChecklist: (sessionId: string, itemId: string, status: string) => request('/checklist', { method: 'POST', body: JSON.stringify({ sessionId, itemId, status }) }),
  createBooking: (sessionId: string, booking: unknown) => request('/bookings', { method: 'POST', body: JSON.stringify({ sessionId, booking }) }),
  saveProductAnalysis: (sessionId: string, analysis: unknown) => request('/product-analyses', { method: 'POST', body: JSON.stringify({ sessionId, analysis }) }),
  recordActivity: (sessionId: string, eventType: string, payload: unknown) => request('/activity', { method: 'POST', body: JSON.stringify({ sessionId, eventType, payload }) }),
};
