<script setup lang="ts">
const { loginWithGoogle, loginWithMagicCode, verifyMagicCode } = useAuth();

// Temporarily disabled until SMTP is configured on PocketBase. Flip back to
// `true` to restore the email magic-code flow.
const MAGIC_CODE_ENABLED = false;

// "email" collects the address, "code" verifies the OTP we emailed.
const step = ref<"email" | "code">("email");
const email = ref("");
const code = ref("");
const otpId = ref("");
const pending = ref(false);
const error = ref<string | null>(null);

const sendCode = async () => {
  error.value = null;
  const address = email.value.trim();
  if (!address) {
    error.value = "Enter your email address.";
    return;
  }
  pending.value = true;
  try {
    otpId.value = await loginWithMagicCode(address);
    step.value = "code";
  } catch (e: any) {
    error.value = e?.message || "Couldn't send the code. Try again.";
  } finally {
    pending.value = false;
  }
};

const verify = async () => {
  error.value = null;
  if (!code.value.trim()) {
    error.value = "Enter the code from your email.";
    return;
  }
  pending.value = true;
  try {
    await verifyMagicCode(otpId.value, code.value.trim());
  } catch (e: any) {
    error.value = "That code is invalid or expired.";
  } finally {
    pending.value = false;
  }
};

const reset = () => {
  step.value = "email";
  code.value = "";
  otpId.value = "";
  error.value = null;
};

const google = async () => {
  error.value = null;
  pending.value = true;
  try {
    await loginWithGoogle();
  } catch (e: any) {
    error.value = e?.message || "Google sign-in failed.";
  } finally {
    pending.value = false;
  }
};

const inputClass =
  "w-full rounded-md border border-border-100 bg-background-200/60 px-3 py-2 font-geist-mono text-sm text-text-100 placeholder:text-text-300 focus:border-primary/50 focus:outline-none";
</script>

<template>
  <div class="rounded-lg border border-border-100 bg-background-200/40 p-5">
    <p class="text-sm text-text-200">
      Sign in to join the conversation.
    </p>

    <template v-if="MAGIC_CODE_ENABLED">
    <!-- Step 1: request a magic code -->
    <form v-if="step === 'email'" class="mt-4 flex flex-col gap-3" @submit.prevent="sendCode">
      <input
        v-model="email"
        type="email"
        autocomplete="email"
        placeholder="you@example.com"
        :class="inputClass"
        :disabled="pending"
      />
      <XButton as="button" type="submit" variant="primary" :disabled="pending">
        {{ pending ? "Sending…" : "Email me a code" }}
      </XButton>
    </form>

    <!-- Step 2: verify the code -->
    <form v-else class="mt-4 flex flex-col gap-3" @submit.prevent="verify">
      <p class="font-geist-mono text-xs text-text-300">
        We sent a code to <span class="text-text-100">{{ email }}</span>.
      </p>
      <input
        v-model="code"
        inputmode="numeric"
        autocomplete="one-time-code"
        placeholder="Enter code"
        :class="inputClass"
        :disabled="pending"
      />
      <div class="flex items-center gap-2">
        <XButton as="button" type="submit" variant="primary" :disabled="pending">
          {{ pending ? "Verifying…" : "Verify & sign in" }}
        </XButton>
        <XButton as="button" type="button" variant="ghost" @trigger="reset">
          Use a different email
        </XButton>
      </div>
    </form>

    <!-- OAuth divider -->
    <div class="my-4 flex items-center gap-3">
      <span class="h-px flex-1 bg-border-100" />
      <span class="font-geist-mono text-[10px] uppercase tracking-[0.2em] text-text-300">
        or
      </span>
      <span class="h-px flex-1 bg-border-100" />
    </div>
    </template>

    <XButton
      as="button"
      type="button"
      variant="ghost"
      :disabled="pending"
      class="mt-4 w-full justify-center"
      @trigger="google"
    >
      <svg class="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="#4285F4"
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1Z"
        />
        <path
          fill="#34A853"
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z"
        />
        <path
          fill="#FBBC05"
          d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84Z"
        />
        <path
          fill="#EA4335"
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15A10.99 10.99 0 0 0 2.18 7.06L5.84 9.9C6.71 7.3 9.14 5.38 12 5.38Z"
        />
      </svg>
      Continue with Google
    </XButton>

    <p v-if="error" class="mt-3 font-geist-mono text-xs text-red-500">
      {{ error }}
    </p>
  </div>
</template>
