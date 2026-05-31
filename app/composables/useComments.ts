import type { Comment } from "~/types";

export const useComments = (postSlug: string) => {
  const pb = usePocketbase();
  const { user, isLoggedIn } = useAuth();

  const comments = ref<Comment[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const fetch = async () => {
    loading.value = true;
    error.value = null;
    try {
      const records = await pb.collection("comments").getFullList<Comment>({
        filter: `post_slug = "${postSlug}"`,
        sort: "-created",
        expand: "user",
      });
      comments.value = records;
    } catch (e: any) {
      error.value = e.message;
    } finally {
      loading.value = false;
    }
  };

  const add = async (content: string, isAnonymous = false) => {
    if (!isLoggedIn.value) throw new Error("Must be logged in to comment");
    const trimmed = content.trim();
    if (!trimmed) throw new Error("Comment cannot be empty");

    const spam = checkSpam(trimmed);
    if (spam.isSpam) throw new Error(spam.reason!);

    const record = await pb.collection("comments").create<Comment>(
      {
        post_slug: postSlug,
        content: censorProfanity(trimmed),
        user: user.value!.id,
        is_anonymous: isAnonymous,
      },
      { expand: "user" },
    );

    comments.value.unshift(record);
    return record;
  };

  const remove = async (commentId: string) => {
    if (!isLoggedIn.value) throw new Error("Must be logged in");

    await pb.collection("comments").delete(commentId);
    comments.value = comments.value.filter((c) => c.id !== commentId);
  };

  const update = async (commentId: string, content: string) => {
    if (!isLoggedIn.value) throw new Error("Must be logged in");
    const trimmed = content.trim();
    if (!trimmed) throw new Error("Comment cannot be empty");

    const spam = checkSpam(trimmed);
    if (spam.isSpam) throw new Error(spam.reason!);

    const record = await pb.collection("comments").update<Comment>(
      commentId,
      {
        content: censorProfanity(trimmed),
      },
      { expand: "user" },
    );

    const index = comments.value.findIndex((c) => c.id === commentId);
    if (index !== -1) comments.value[index] = record;

    return record;
  };

  // Subscribe to real-time updates
  const subscribe = () => {
    pb.collection("comments").subscribe<Comment>("*", async (e) => {
      if (e.record.post_slug !== postSlug) return;

      if (e.action === "create") {
        // Fetch with expand since realtime doesn't expand
        const full = await pb
          .collection("comments")
          .getOne<Comment>(e.record.id, { expand: "user" });
        if (!comments.value.find((c) => c.id === full.id)) {
          comments.value.unshift(full);
        }
      } else if (e.action === "update") {
        const full = await pb
          .collection("comments")
          .getOne<Comment>(e.record.id, { expand: "user" });
        const index = comments.value.findIndex((c) => c.id === full.id);
        if (index !== -1) comments.value[index] = full;
      } else if (e.action === "delete") {
        comments.value = comments.value.filter((c) => c.id !== e.record.id);
      }
    });
  };

  const unsubscribe = () => {
    pb.collection("comments").unsubscribe("*");
  };

  // Auto-fetch and subscribe on mount
  onMounted(async () => {
    await fetch();
    subscribe();
  });

  onUnmounted(() => {
    unsubscribe();
  });

  return {
    comments: readonly(comments),
    loading: readonly(loading),
    error: readonly(error),
    add,
    remove,
    update,
    refresh: fetch,
  };
};
