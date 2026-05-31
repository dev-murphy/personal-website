const SESSION_KEY = "blog_session_id";

export const useBlogSession = () => {
  const sessionId = useState<string>("blog_session_id", () => "");

  // Populate on the client during setup (before any onMounted fetch runs).
  // On the server it stays empty — likes/reactions only query in the browser.
  if (import.meta.client && !sessionId.value) {
    let id = localStorage.getItem(SESSION_KEY);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(SESSION_KEY, id);
    }
    sessionId.value = id;
  }

  return sessionId;
};
