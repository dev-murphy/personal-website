import type { Project } from "~/types";

export const useProjects = () => {
  const pb = usePocketbase();

  const projects = ref<Project[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Newest first by the project's own creation_date, falling back to the
  // record's created timestamp for any project missing one. Mirrors the server
  // sort so realtime inserts land in the right place.
  const sortProjects = () => {
    projects.value.sort(
      (a, b) =>
        (b.creation_date ?? "").localeCompare(a.creation_date ?? "") ||
        (b.created ?? "").localeCompare(a.created ?? ""),
    );
  };

  const fetch = async () => {
    loading.value = true;
    error.value = null;
    try {
      projects.value = await pb.collection("projects").getFullList<Project>({
        sort: "-creation_date,-created",
      });
    } catch (e: any) {
      error.value = e.message;
    } finally {
      loading.value = false;
    }
  };

  /** Resolve a project's logo filename to a served file URL, if it has one. */
  const logoUrl = (project: Pick<Project, "logo"> & Record<string, any>) =>
    project.logo ? pb.files.getURL(project, project.logo) : null;

  // Real-time updates: reflect project changes without a reload. The realtime
  // record carries everything we render (including the logo file ref), so no
  // expand/refetch is needed.
  const subscribe = () => {
    pb.collection("projects").subscribe<Project>("*", (e) => {
      if (e.action === "create") {
        if (!projects.value.find((p) => p.id === e.record.id)) {
          projects.value.unshift(e.record);
          sortProjects();
        }
      } else if (e.action === "update") {
        const index = projects.value.findIndex((p) => p.id === e.record.id);
        if (index !== -1) {
          projects.value[index] = e.record;
          sortProjects();
        }
      } else if (e.action === "delete") {
        projects.value = projects.value.filter((p) => p.id !== e.record.id);
      }
    });
  };

  const unsubscribe = () => {
    pb.collection("projects").unsubscribe("*");
  };

  onMounted(async () => {
    await fetch();
    subscribe();
  });

  onUnmounted(() => {
    unsubscribe();
  });

  return {
    projects: readonly(projects),
    loading: readonly(loading),
    error: readonly(error),
    logoUrl,
    refresh: fetch,
  };
};
