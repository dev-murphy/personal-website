<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your Nuxt 4 personal website. The `@posthog/nuxt` module was installed and configured, a server-side PostHog utility was created, and 15 events were instrumented across 8 files covering blog engagement, user authentication, project browsing, and homepage conversion actions. Users are identified on both Google OAuth and magic-code login paths. Automatic client-side and server-side error tracking is enabled via the module.

## Events instrumented

| Event | Description | File |
|---|---|---|
| `blog_post_viewed` | Fired when a visitor lands on a blog post page. Top of the content engagement funnel. | `app/pages/blog/[...slug].vue` |
| `blog_post_liked` | Fired when a visitor likes a blog post. | `app/composables/useLikes.ts` |
| `blog_post_unliked` | Fired when a visitor removes their like from a blog post. | `app/composables/useLikes.ts` |
| `blog_post_reaction_added` | Fired when a visitor adds an emoji reaction to a blog post. | `app/composables/useReactions.ts` |
| `blog_post_reaction_removed` | Fired when a visitor removes their emoji reaction from a blog post. | `app/composables/useReactions.ts` |
| `blog_comment_submitted` | Fired when a logged-in user successfully submits a comment on a blog post. | `app/composables/useComments.ts` |
| `user_logged_in` | Fired on successful authentication (Google OAuth or magic code). Also calls `posthog.identify()`. | `app/composables/useAuth.ts` |
| `user_logged_out` | Fired when a user logs out. Also calls `posthog.reset()`. | `app/composables/useAuth.ts` |
| `hero_cta_clicked` | Fired when a visitor clicks the "Start a project" CTA in the homepage hero. | `app/pages/index.vue` |
| `github_link_clicked` | Fired when a visitor clicks the GitHub link in the hero section. | `app/pages/index.vue` |
| `contact_email_clicked` | Fired when a visitor clicks the email address in the contact section. | `app/pages/index.vue` |
| `view_all_projects_clicked` | Fired when a visitor clicks "View all projects" on the homepage. | `app/pages/index.vue` |
| `project_live_site_clicked` | Fired when a visitor clicks the "Live Site" button on a project card. | `app/components/cards/Project.vue` |
| `project_source_clicked` | Fired when a visitor clicks the source code link on a project card. | `app/components/cards/Project.vue` |
| `project_filter_applied` | Fired when a visitor applies a tech or type filter on the projects page. | `app/pages/projects/index.vue` |
| `related_post_clicked` | Fired when a visitor clicks a related post at the bottom of a blog post. | `app/pages/blog/[...slug].vue` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/466460/dashboard/1701691)
- [Blog engagement funnel (wizard)](https://us.posthog.com/project/466460/insights/8z5ASz1n) — Conversion from post view → like, reaction, or comment
- [Blog content engagement over time (wizard)](https://us.posthog.com/project/466460/insights/VVPjRf1m) — Daily trend of views, likes, reactions, and comments
- [Contact conversion signals (wizard)](https://us.posthog.com/project/466460/insights/dhScbfGJ) — Hero CTA clicks and email contact clicks
- [User sign-ins (wizard)](https://us.posthog.com/project/466460/insights/m6tQWxDo) — Daily sign-ins broken down by provider
- [Project clicks (wizard)](https://us.posthog.com/project/466460/insights/mU6slAhM) — Live site and source code link clicks

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nuxt-4/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
