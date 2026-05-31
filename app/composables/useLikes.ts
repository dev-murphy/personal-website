export const useLikes = (postSlug: string) => {
  const pb = usePocketbase();

  const count = ref(0);
  const liked = ref(false);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const sessionId = useBlogSession();

  const fetch = async () => {
    const [records, myLike] = await Promise.all([
      pb.collection("likes").getList(1, 1, {
        filter: `post_slug = "${postSlug}"`,
      }),
      pb
        .collection("likes")
        .getFirstListItem(
          `post_slug = "${postSlug}" && session_id = "${sessionId.value}"`,
        )
        .catch(() => null),
    ]);

    count.value = records.totalItems;
    liked.value = !!myLike;
  };

  const toggle = async () => {
    if (loading.value) return;
    loading.value = true;
    error.value = null;

    try {
      if (liked.value) {
        // Find and delete own like
        const record = await pb
          .collection("likes")
          .getFirstListItem(
            `post_slug = "${postSlug}" && session_id = "${sessionId.value}"`,
          );
        await pb.collection("likes").delete(record.id);
        liked.value = false;
        count.value = Math.max(0, count.value - 1);
      } else {
        await pb.collection("likes").create({
          post_slug: postSlug,
          session_id: sessionId.value,
        });
        liked.value = true;
        count.value += 1;
      }
    } catch (e: any) {
      // Duplicate key = already liked — sync state rather than surface an error.
      if (e?.status === 400) {
        liked.value = true;
      } else {
        error.value = liked.value
          ? "Couldn't remove your like. Please try again."
          : "Couldn't save your like. Please try again.";
      }
    } finally {
      loading.value = false;
    }
  };

  onMounted(fetch);

  return {
    count: readonly(count),
    liked: readonly(liked),
    loading: readonly(loading),
    error: readonly(error),
    toggle,
  };
};
