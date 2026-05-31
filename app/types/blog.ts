import type { RecordModel } from "pocketbase";

/** A comment on a blog post, with the authoring user expanded. */
export interface Comment extends RecordModel {
  post_slug: string;
  content: string;
  user: string;
  expand?: {
    user: {
      id: string;
      name: string;
      avatar: string;
    };
  };
}

/** The emoji reactions a reader can leave on a post. */
export type ReactionType =
  | "heart"
  | "fire"
  | "thumbs_up"
  | "mind_blown"
  | "laugh"
  | "sad";
