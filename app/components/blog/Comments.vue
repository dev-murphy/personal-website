<script setup lang="ts">
import type { Comment } from "~/types";

const props = defineProps<{ slug: string }>();

const { user, isLoggedIn, logout } = useAuth();
const { comments, loading, error, add, remove, update } = useComments(props.slug);

const draft = ref("");
const submitting = ref(false);
const submitError = ref<string | null>(null);

// Inline editing state, keyed by comment id.
const editingId = ref<string | null>(null);
const editDraft = ref("");

const isOwn = (comment: Comment) => comment.user === user.value?.id;

const submit = async () => {
  submitError.value = null;
  if (!draft.value.trim()) return;
  submitting.value = true;
  try {
    await add(draft.value);
    draft.value = "";
  } catch (e: any) {
    submitError.value = e?.message || "Couldn't post your comment.";
  } finally {
    submitting.value = false;
  }
};

const startEdit = (comment: Comment) => {
  editingId.value = comment.id;
  editDraft.value = comment.content;
};

const cancelEdit = () => {
  editingId.value = null;
  editDraft.value = "";
};

const saveEdit = async (comment: Comment) => {
  if (!editDraft.value.trim()) return;
  await update(comment.id, editDraft.value);
  cancelEdit();
};

const onDelete = async (comment: Comment) => {
  await remove(comment.id);
};

const initial = (name?: string) => (name?.trim()?.[0] || "?").toUpperCase();

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
</script>

<template>
  <section>
    <div class="flex items-center gap-x-3">
      <span class="h-px w-6 md:w-10 bg-primary" />
      <span
        class="font-geist-mono text-[11px] uppercase tracking-[0.25em] text-primary"
      >
        // Discussion
      </span>
    </div>
    <h2
      class="mt-3 font-syne text-2xl md:text-3xl font-extrabold tracking-tight text-text-100"
    >
      Comments
      <span class="font-geist-mono text-base font-normal text-text-300">
        ({{ comments.length }})
      </span>
    </h2>

    <!-- Composer / auth gate -->
    <div class="mt-8">
      <div
        v-if="isLoggedIn"
        class="rounded-lg border border-border-100 bg-background-200/40 p-5"
      >
        <div class="mb-3 flex items-center justify-between gap-x-3">
          <span class="font-geist-mono text-xs text-text-300">
            Commenting as
            <span class="text-text-100">{{
              user?.name || user?.email || "you"
            }}</span>
          </span>
          <button
            type="button"
            class="font-geist-mono text-xs text-text-300 underline-offset-4 hover:text-text-100 hover:underline"
            @click="logout"
          >
            Sign out
          </button>
        </div>
        <form class="flex flex-col gap-3" @submit.prevent="submit">
          <textarea
            v-model="draft"
            rows="3"
            placeholder="Share your thoughts…"
            class="w-full resize-y rounded-md border border-border-100 bg-background-100/60 px-3 py-2 text-sm text-text-100 placeholder:text-text-300 focus:border-primary/50 focus:outline-none"
            :disabled="submitting"
          />
          <div class="flex items-center justify-end">
            <XButton
              as="button"
              type="submit"
              variant="primary"
              :disabled="submitting || !draft.trim()"
            >
              {{ submitting ? "Posting…" : "Post comment" }}
            </XButton>
          </div>
          <p v-if="submitError" class="font-geist-mono text-xs text-red-500">
            {{ submitError }}
          </p>
        </form>
      </div>

      <BlogAuthPanel v-else />
    </div>

    <!-- Comment list -->
    <div class="mt-10">
      <p v-if="loading" class="font-geist-mono text-sm text-text-300">
        Loading comments…
      </p>
      <p v-else-if="error" class="font-geist-mono text-sm text-red-500">
        {{ error }}
      </p>
      <p
        v-else-if="comments.length === 0"
        class="font-geist-mono text-sm text-text-300"
      >
        No comments yet — be the first.
      </p>

      <ul v-else class="flex flex-col gap-y-6">
        <li
          v-for="comment in comments"
          :key="comment.id"
          class="flex gap-x-4"
        >
          <div
            class="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border-100 bg-background-200 font-geist-mono text-sm text-text-200"
          >
            {{ initial(comment.expand?.user?.name) }}
          </div>

          <div class="min-w-0 flex-1">
            <div class="flex flex-wrap items-center gap-x-2 gap-y-0.5">
              <span class="text-sm font-medium text-text-100">
                {{ comment.expand?.user?.name || "Anonymous" }}
              </span>
              <span class="font-geist-mono text-[11px] text-text-300">
                {{ formatDate(comment.created) }}
              </span>
            </div>

            <!-- Editing -->
            <form
              v-if="editingId === comment.id"
              class="mt-2 flex flex-col gap-2"
              @submit.prevent="saveEdit(comment)"
            >
              <textarea
                v-model="editDraft"
                rows="3"
                class="w-full resize-y rounded-md border border-border-100 bg-background-100/60 px-3 py-2 text-sm text-text-100 focus:border-primary/50 focus:outline-none"
              />
              <div class="flex items-center gap-2">
                <XButton as="button" type="submit" variant="primary">
                  Save
                </XButton>
                <XButton
                  as="button"
                  type="button"
                  variant="ghost"
                  @trigger="cancelEdit"
                >
                  Cancel
                </XButton>
              </div>
            </form>

            <!-- Display -->
            <template v-else>
              <p
                class="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-text-200"
              >
                {{ comment.content }}
              </p>
              <div
                v-if="isOwn(comment)"
                class="mt-2 flex items-center gap-x-3 font-geist-mono text-[11px] text-text-300"
              >
                <button
                  type="button"
                  class="underline-offset-4 hover:text-text-100 hover:underline"
                  @click="startEdit(comment)"
                >
                  Edit
                </button>
                <button
                  type="button"
                  class="underline-offset-4 hover:text-red-500 hover:underline"
                  @click="onDelete(comment)"
                >
                  Delete
                </button>
              </div>
            </template>
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>
