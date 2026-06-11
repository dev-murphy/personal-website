import type { ReactionType } from "~/types";

export const REACTION_EMOJIS: Record<ReactionType, string> = {
  heart: "❤️",
  fire: "🔥",
  thumbs_up: "👍",
  mind_blown: "🤯",
  laugh: "😂",
  sad: "😢",
};

const EMPTY_COUNTS = (): Record<ReactionType, number> => ({
  heart: 0,
  fire: 0,
  thumbs_up: 0,
  mind_blown: 0,
  laugh: 0,
  sad: 0,
});

export const useReactions = (postSlug: string) => {
  const pb = usePocketbase();
  const sessionId = useBlogSession();
  const posthog = usePostHog();

  // record id -> reaction type, for every reaction on this post. Keying by id
  // makes optimistic writes and their realtime echoes idempotent (no double
  // counting) and lets counts be derived rather than mutated by hand.
  const records = ref<Map<string, ReactionType>>(new Map());
  // reaction type -> the current session's own record id (for removal + state).
  const myRecords = ref<Map<ReactionType, string>>(new Map());
  const loading = ref<Partial<Record<ReactionType, boolean>>>({});
  const error = ref<string | null>(null);

  const counts = computed(() => {
    const c = EMPTY_COUNTS();
    for (const type of records.value.values()) c[type] += 1;
    return c;
  });
  const myReactions = computed(() => new Set(myRecords.value.keys()));

  const setRecord = (id: string, type: ReactionType) => {
    const next = new Map(records.value);
    next.set(id, type);
    records.value = next;
  };

  const deleteRecord = (id: string) => {
    const next = new Map(records.value);
    next.delete(id);
    records.value = next;
  };

  const setMine = (type: ReactionType, id: string) => {
    const next = new Map(myRecords.value);
    next.set(type, id);
    myRecords.value = next;
  };

  const deleteMine = (type: ReactionType) => {
    const next = new Map(myRecords.value);
    next.delete(type);
    myRecords.value = next;
  };

  const fetch = async () => {
    const all = await pb.collection("reactions").getFullList({
      filter: `post_slug = "${postSlug}"`,
    });
    const map = new Map<string, ReactionType>();
    const mine = new Map<ReactionType, string>();
    for (const r of all) {
      const type = r.type as ReactionType;
      map.set(r.id, type);
      if (r.session_id === sessionId.value) mine.set(type, r.id);
    }
    records.value = map;
    myRecords.value = mine;
  };

  const toggle = async (type: ReactionType) => {
    if (loading.value[type]) return;
    loading.value = { ...loading.value, [type]: true };
    error.value = null;

    const myId = myRecords.value.get(type);

    try {
      if (myId) {
        await pb.collection("reactions").delete(myId);
        deleteRecord(myId);
        deleteMine(type);
        posthog?.capture("blog_post_reaction_removed", { post_slug: postSlug, reaction_type: type });
      } else {
        const record = await pb.collection("reactions").create({
          post_slug: postSlug,
          type,
          session_id: sessionId.value,
        });
        setRecord(record.id, type);
        setMine(type, record.id);
        posthog?.capture("blog_post_reaction_added", { post_slug: postSlug, reaction_type: type });
      }
    } catch (e: any) {
      error.value = myId
        ? "Couldn't remove your reaction. Please try again."
        : "Couldn't save your reaction. Please try again.";
      // Resync to the server's truth after a failed write.
      await fetch().catch(() => {});
    } finally {
      loading.value = { ...loading.value, [type]: false };
    }
  };

  const hasReacted = (type: ReactionType) => myReactions.value.has(type);

  // Real-time updates: reflect reactions from other visitors without a reload.
  const subscribe = () => {
    pb.collection("reactions").subscribe("*", (e) => {
      if (e.record.post_slug !== postSlug) return;
      const type = e.record.type as ReactionType;

      if (e.action === "create") {
        setRecord(e.record.id, type);
        if (e.record.session_id === sessionId.value && !myRecords.value.has(type)) {
          setMine(type, e.record.id);
        }
      } else if (e.action === "delete") {
        deleteRecord(e.record.id);
        if (myRecords.value.get(type) === e.record.id) deleteMine(type);
      }
    });
  };

  const unsubscribe = () => {
    pb.collection("reactions").unsubscribe("*");
  };

  onMounted(async () => {
    await fetch();
    subscribe();
  });

  onUnmounted(unsubscribe);

  return {
    counts,
    myReactions,
    loading: readonly(loading),
    error: readonly(error),
    toggle,
    hasReacted,
    REACTION_EMOJIS,
  };
};
