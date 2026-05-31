import type { RecordModel } from "pocketbase";

export const useAuth = () => {
  const pb = usePocketbase();

  const user = useState<RecordModel | null>(
    "auth_user",
    () => pb.authStore.record,
  );
  const isLoggedIn = computed(() => !!user.value);

  pb.authStore.onChange((_token, record) => {
    user.value = record;
  });

  const loginWithGoogle = async () => {
    // Pre-open a blank popup synchronously so Safari doesn't block it (this is
    // what PocketBase's default urlCallback does internally).
    const popup =
      typeof window !== "undefined" ? window.open("", "_blank") : null;

    const auth = await pb.collection("users").authWithOAuth2({
      provider: "google",
      // Append `prompt=select_account` to Google's consent URL so the account
      // chooser always shows, instead of silently reusing the last session.
      urlCallback: (url) => {
        const target = new URL(url);
        target.searchParams.set("prompt", "select_account");
        if (popup) popup.location.href = target.href;
        else window.location.href = target.href;
      },
    });
    user.value = auth.record;
    return auth;
  };

  /**
   * Request a magic code. PocketBase emails the visitor a one-time code (and
   * link) and returns an `otpId` that must be paired with the code they enter
   * in `verifyMagicCode`.
   */
  const loginWithMagicCode = async (email: string) => {
    const req = await pb.collection("users").requestOTP(email);
    return req.otpId;
  };

  const verifyMagicCode = async (otpId: string, code: string) => {
    const auth = await pb.collection("users").authWithOTP(otpId, code);
    user.value = auth.record;
    return auth;
  };

  const logout = () => {
    pb.authStore.clear();
    user.value = null;
  };

  return {
    user: readonly(user),
    isLoggedIn,
    loginWithGoogle,
    loginWithMagicCode,
    verifyMagicCode,
    logout,
  };
};
