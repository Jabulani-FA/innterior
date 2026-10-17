const isLocalhost = ['localhost', '127.0.0.1'].includes(window.location.hostname);
const configuredApiBase = process.env.REACT_APP_API_BASE?.replace(/\/+$/, '');

export const apiBase = configuredApiBase && (!isLocalhost || /^https?:\/\//i.test(configuredApiBase))
  ? configuredApiBase
  : isLocalhost
    ? 'http://localhost:8000/api'
    : '/api';