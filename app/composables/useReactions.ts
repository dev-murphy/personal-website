import type { ReactionType } from "~/types";

export const REACTION_EMOJIS: Record<ReactionType, string> = {
  heart: "❤️",
  fire: "🔥",
  thumbs_up: "👍",
  mind_blown: "🤯",
  laugh: "😂",
  sad: "😢",
};

export const useReactions = (postSlug: string) => {
  const pb = usePocketbase();

  // { heart: 4, fire: 1, ... }
  const counts = ref<Record<ReactionType, number>>({
    heart: 0,
    fire: 0,
    thumbs_up: 0,
    mind_blown: 0,
    laugh: 0,
    sad: 0,
  });

  // Which types the current session has reacted with
  const myReactions = ref<Set<ReactionType>>(new Set());
  const loading = ref<Partial<Record<ReactionType, boolean>>>({});
  const error = ref<string | null>(null);

  const sessionId = useBlogSession();

  const fetch = async () => {
    const [all, mine] = await Promise.all([
      pb.collection("reactions").getFullList({
        filter: `post_slug = "${postSlug}"`,
      }),
      pb.collection("reactions").getFullList({
        filter: `post_slug = "${postSlug}" && session_id = "${sessionId.value}"`,
      }),
    ]);

    // Reset and tally
    const tally: Record<string, number> = {};
    for (const r of all) {
      tally[r.type] = (tally[r.type] || 0) + 1;
    }
    counts.value = {
      heart: tally.heart || 0,
      fire: tally.fire || 0,
      thumbs_up: tally.thumbs_up || 0,
      mind_blown: tally.mind_blown || 0,
      laugh: tally.laugh || 0,
      sad: tally.sad || 0,
    };

    myReactions.value = new Set(mine.map((r) => r.type as ReactionType));
  };

  const toggle = async (type: ReactionType) => {
    if (loading.value[type]) return;
    loading.value[type] = true;
    error.value = null;

    const hasReacted = myReactions.value.has(type);

    // Optimistic update
    if (hasReacted) {
      myReactions.value.delete(type);
      counts.value[type] = Math.max(0, counts.value[type] - 1);
    } else {
      myReactions.value.add(type);
      counts.value[type] += 1;
    }

    try {
      if (hasReacted) {
        const record = await pb
          .collection("reactions")
          .getFirstListItem(
            `post_slug = "${postSlug}" && type = "${type}" && session_id = "${sessionId.value}"`,
          );
        await pb.collection("reactions").delete(record.id);
      } else {
        await pb.collection("reactions").create({
          post_slug: postSlug,
          type,
          session_id: sessionId.value,
        });
      }
    } catch (e: any) {
      // Roll back optimistic update on failure
      if (hasReacted) {
        myReactions.value.add(type);
        counts.value[type] += 1;
      } else {
        myReactions.value.delete(type);
        counts.value[type] = Math.max(0, counts.value[type] - 1);
      }
      error.value = hasReacted
        ? "Couldn't remove your reaction. Please try again."
        : "Couldn't save your reaction. Please try again.";
    } finally {
      loading.value[type] = false;
    }
  };

  const hasReacted = (type: ReactionType) => myReactions.value.has(type);

  onMounted(fetch);

  return {
    counts: readonly(counts),
    myReactions: readonly(myReactions),
    loading: readonly(loading),
    error: readonly(error),
    toggle,
    hasReacted,
    REACTION_EMOJIS,
  };
};
