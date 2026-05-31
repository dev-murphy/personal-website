/**
 * Validate persisted auth on app load.
 *
 * PocketBase's browser auth store survives in localStorage across visits, so a
 * token can outlive the user record it points to — it expires, or (common in
 * dev) the PocketBase DB gets reset and that user no longer exists. When that
 * happens the client still believes it's logged in and attaches a now-dangling
 * `user` id to likes/reactions/comments. PocketBase rejects the write with
 * "Failed to find all relation records with the provided ids" while logging the
 * request as unauthenticated (auth: N/A), since the token it received was dead.
 *
 * Refreshing here confirms the record still exists and swaps in a fresh token;
 * any failure means the persisted auth is no good, so we clear it.
 */
export default defineNuxtPlugin(async () => {
  const pb = usePocketbase();

  if (!pb.authStore.token && !pb.authStore.record) return;

  if (!pb.authStore.isValid) {
    pb.authStore.clear();
    return;
  }

  try {
    await pb.collection("users").authRefresh();
  } catch {
    pb.authStore.clear();
  }
});
