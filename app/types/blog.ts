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

/** A portfolio project, stored in the `projects` PocketBase collection. */
export interface Project extends RecordModel {
  name: string;
  description: string;
  /** The tools/tech used — stored as a JSON array on the record. */
  tech_stack: string[];
  source_url?: string;
  live_url?: string;
  /** When true, the source isn't publicly available (closed source). */
  source_private: boolean;
  /** Optional logo filename; resolve to a URL with `pb.files.getURL`. */
  logo?: string;
  /** When the project was created — used for sorting and display. */
  creation_date?: string;
  /** Archived projects are hidden by default behind a "show archived" toggle. */
  is_archived: boolean;
  /** When true, the project is featured on the home page. */
  is_pinned: boolean;
  /** Categories, e.g. "web", "pwa", "npm package", "chrome extension". */
  type?: string[];
}

/** The emoji reactions a reader can leave on a post. */
export type ReactionType =
  | "heart"
  | "fire"
  | "thumbs_up"
  | "mind_blown"
  | "laugh"
  | "sad";
