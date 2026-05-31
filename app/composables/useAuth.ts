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
    const auth = await pb
      .collection("users")
      .authWithOAuth2({ provider: "google" });
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
