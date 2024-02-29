const OLLAMA_HOST = 'ollama.host';

export const loadOllamaHost = () => {
  const host = localStorage.getItem(OLLAMA_HOST);
  if (!host?.trim()) {
    const defaultHost = "http://localhost:11434";
    localStorage.setItem(OLLAMA_HOST, defaultHost);
    return defaultHost;
  }
  return host;
}

export const saveOllamaHost = (host: string) => {
  localStorage.setItem(OLLAMA_HOST, host);
}