export const useLikes = (postSlug: string) => {
  const pb = usePocketbase();
  const sessionId = useBlogSession();

  // Track like record ids in a Set so an optimistic write and its realtime
  // echo collapse to a single entry — the count is always the set size and can
  // never double-count.
  const ids = ref<Set<string>>(new Set());
  const myLikeId = ref<string | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const count = computed(() => ids.value.size);
  const liked = computed(() => myLikeId.value !== null);

  const addId = (id: string) => {
    const next = new Set(ids.value);
    next.add(id);
    ids.value = next;
  };

  const removeId = (id: string) => {
    const next = new Set(ids.value);
    next.delete(id);
    ids.value = next;
  };

  const fetch = async () => {
    const records = await pb.collection("likes").getFullList({
      filter: `post_slug = "${postSlug}"`,
    });
    ids.value = new Set(records.map((r) => r.id));
    myLikeId.value =
      records.find((r) => r.session_id === sessionId.value)?.id ?? null;
  };

  const toggle = async () => {
    if (loading.value) return;
    loading.value = true;
    error.value = null;

    try {
      if (myLikeId.value) {
        const id = myLikeId.value;
        await pb.collection("likes").delete(id);
        removeId(id);
        myLikeId.value = null;
      } else {
        const record = await pb.collection("likes").create({
          post_slug: postSlug,
          session_id: sessionId.value,
        });
        addId(record.id);
        myLikeId.value = record.id;
      }
    } catch (e: any) {
      // Duplicate key = already liked — resync rather than surface an error.
      if (e?.status === 400) {
        await fetch().catch(() => {});
      } else {
        error.value = myLikeId.value
          ? "Couldn't remove your like. Please try again."
          : "Couldn't save your like. Please try again.";
      }
    } finally {
      loading.value = false;
    }
  };

  // Real-time updates: reflect likes from other visitors without a reload.
  const subscribe = () => {
    pb.collection("likes").subscribe("*", (e) => {
      if (e.record.post_slug !== postSlug) return;

      if (e.action === "create") {
        addId(e.record.id);
        if (e.record.session_id === sessionId.value) myLikeId.value = e.record.id;
      } else if (e.action === "delete") {
        removeId(e.record.id);
        if (myLikeId.value === e.record.id) myLikeId.value = null;
      }
    });
  };

  const unsubscribe = () => {
    pb.collection("likes").unsubscribe("*");
  };

  onMounted(async () => {
    await fetch();
    subscribe();
  });

  onUnmounted(unsubscribe);

  return {
    count,
    liked,
    loading: readonly(loading),
    error: readonly(error),
    toggle,
  };
};
