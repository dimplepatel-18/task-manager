const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export async function api(path, { method = 'GET', body, token } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(BASE_URL + path, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await res.text(); // read raw response
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch (err) {
    console.error('Invalid JSON response:', text);
    throw new Error('Server returned invalid JSON');
  }

  if (!res.ok) {
    const msg = data.message || `Request failed with status ${res.status}`;
    throw new Error(msg);
  }

  return data;
}
