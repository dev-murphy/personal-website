const SESSION_KEY = "blog_session_id";

/**
 * A stable, anonymous identifier for the current browsing session.
 *
 * Used to attribute likes and reactions to a visitor without requiring login.
 * The id is a UUID tied to the session instance — it lives in `sessionStorage`,
 * so it survives reloads and navigation within the same tab but is regenerated
 * for a fresh session. Shared app-wide via `useState` so every composable that
 * needs it reads the same value.
 */
export const useBlogSession = () => {
  const sessionId = useState<string>("blog_session_id", () => "");

  // Populate on the client during setup (before any onMounted fetch runs).
  // On the server it stays empty — likes/reactions only query in the browser.
  if (import.meta.client && !sessionId.value) {
    let id = sessionStorage.getItem(SESSION_KEY);
    if (!id) {
      id = crypto.randomUUID();
      sessionStorage.setItem(SESSION_KEY, id);
    }
    sessionId.value = id;
  }

  return sessionId;
};
