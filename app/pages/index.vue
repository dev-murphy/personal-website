<script lang="ts" setup>
import WorkExperience from "~/components/cards/WorkExperience.vue";
import Project from "~/components/cards/Project.vue";
import { frameworks, languages } from "~/components/logos";

const experiences = [
  {
    tenure: { start: "2024", end: "Present" },
    position: "Software Developer",
    company: "Osoobe Limited",
    description:
      "Building production interfaces and backend services for client engagements. Focus on type-safe Vue/Nuxt frontends, REST APIs, and shipping features end-to-end.",
  },
  {
    tenure: { start: "2021", end: "2023" },
    position: "Software Developer",
    company: "Orba Technologies Limited",
    description:
      "Shipped customer-facing web applications across the stack. Owned UI architecture, mentored junior engineers, and reduced page load times on the core product by more than half.",
  },
];

const { projects, logoUrl } = useProjects();

// The home page only features pinned projects; the full catalog lives on /projects.
const pinnedProjects = computed(() =>
  projects.value.filter((p) => p.is_pinned && !p.is_archived),
);

useSeoMeta({
  title: "Murphy Facey — Frontend Developer",
  description:
    "Frontend developer building fast, quiet interfaces for ambitious teams.",
});
</script>

<template>
  <div class="w-full px-4">
    <div class="w-full max-w-310 mx-auto">
      <!-- Hero Section -->
      <section class="pt-28 pb-20 md:pt-36 md:pb-28">
        <!-- <div
          class="hero-rise inline-flex items-center gap-x-2 px-3 py-1 border border-primary/30 rounded-full font-geist-mono text-[11px] uppercase tracking-[0.2em] text-primary"
          style="animation-delay: 0ms"
        >
          <span class="relative flex w-1.5 h-1.5">
            <span
              class="absolute inline-flex h-full w-full rounded-full bg-primary opacity-60 animate-ping"
            ></span>
            <span
              class="relative inline-flex w-1.5 h-1.5 rounded-full bg-primary"
            ></span>
          </span>
          Available for select projects · 2026
        </div> -->

        <h1
          class="mt-8 max-w-4xl text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.1] text-text-100"
        >
          <span class="hero-rise block" style="animation-delay: 80ms">
            Frontend developer building
          </span>
          <span
            class="hero-rise relative inline-block"
            style="animation-delay: 180ms"
          >
            <span
              aria-hidden="true"
              class="absolute inset-0 -z-10 bg-primary/30 blur-3xl"
            ></span>
            <span
              class="bg-linear-to-r from-primary via-emerald-400 to-teal-300 bg-clip-text text-transparent"
            >
              fast, quiet interfaces
            </span>
          </span>
          <span class="hero-rise block" style="animation-delay: 280ms">
            for ambitious teams.
          </span>
        </h1>

        <p
          class="hero-rise max-w-xl mt-6 text-base text-text-200 leading-relaxed"
          style="animation-delay: 400ms"
        >
          I'm Murphy — a frontend engineer with five years shipping production
          Vue and React. I care about type-safety, motion that means something,
          and pages that load in under a second.
        </p>

        <div
          class="hero-rise flex flex-wrap gap-x-3 gap-y-2 mt-8"
          style="animation-delay: 500ms"
        >
          <XButton variant="primary" as="a" href="#work">
            Start a project
            <IconsArrowUpRight class="w-3.5 h-3.5" />
          </XButton>
          <XButton
            variant="ghost"
            as="a"
            href="https://github.com/dev-murphy"
            target="_blank"
          >
            <IconsGithub class="w-4 h-4" />
            GitHub
          </XButton>
        </div>
      </section>

      <!-- Tech Stack -->
      <section id="stack" class="pb-24 scroll-mt-14">
        <SectionHeader
          number="01"
          kicker="tools"
          title="Tech Stack"
          :meta="`${languages.length + frameworks.length} TECHNOLOGIES`"
        />

        <FadeInSection>
          <div class="pt-10 space-y-6">
            <AppMarquee
              :tech-stack="languages"
              category="Languages"
              :speed="90"
            />
            <AppMarquee
              :tech-stack="frameworks"
              category="Frameworks"
              :speed="110"
              :delay="600"
              reverse
            />
          </div>
        </FadeInSection>
      </section>

      <!-- Experience -->
      <section id="experience" class="pb-24 scroll-mt-14">
        <SectionHeader
          number="02"
          kicker="Timeline"
          title="Experience"
          :meta="`${experiences.length} ROLES`"
        />

        <FadeInSection>
          <div class="pt-6 flex flex-col">
            <WorkExperience
              v-for="(experience, index) in experiences"
              :key="`work-exp-${index}`"
              v-bind="experience"
            />
          </div>
        </FadeInSection>
      </section>

      <!-- Projects -->
      <section id="work" class="pb-24 scroll-mt-14">
        <SectionHeader
          number="03"
          kicker="Work"
          title="Projects"
          :meta="`${pinnedProjects.length} FEATURED`"
        />

        <div class="pt-10 grid grid-cols-1 md:grid-cols-2 gap-4">
          <FadeInSection
            v-for="(project, index) in pinnedProjects"
            :key="project.id"
            :delay="index * 80"
          >
            <Project
              :project-name="project.name"
              :description="project.description"
              :tech-stack="[...(project.tech_stack ?? [])]"
              :source-url="project.source_url"
              :live-url="project.live_url"
              :logo-url="logoUrl(project)"
              :source-private="project.source_private"
              :types="[...(project.type ?? [])]"
              :creation-date="project.creation_date"
              :archived="project.is_archived"
              :pinned="project.is_pinned"
            />
          </FadeInSection>
        </div>

        <div class="pt-10 flex justify-center">
          <NuxtLink
            to="/projects"
            class="inline-flex items-center gap-x-2 py-2 px-4 border border-border-100 rounded-md font-geist-mono text-sm text-text-200 hover:text-text-100 hover:border-text-200 transition-colors"
          >
            View all projects
            <IconsArrowUpRight class="w-3.5 h-3.5" />
          </NuxtLink>
        </div>
      </section>

      <!-- Contact -->
      <section id="contact" class="pb-24 scroll-mt-14">
        <SectionHeader
          number="04"
          kicker="Reach out"
          title="Get in touch"
          meta="Quick Replies"
        />

        <FadeInSection>
          <div class="pt-10 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            <div>
              <h3
                class="text-2xl md:text-3xl font-semibold tracking-tight leading-[1.15] text-text-100"
              >
                Have an interface that deserves
                <span class="text-primary">careful engineering?</span>
              </h3>
              <p
                class="mt-6 max-w-md text-sm md:text-base text-text-200 leading-relaxed"
              >
                I take on a small number of consulting and contract engagements
                each quarter. Send a note and I'll reply within two business
                days.
              </p>
            </div>

            <div class="flex flex-col gap-y-2 md:pt-2">
              <a
                href="mailto:hello@zenithcodes.xyz"
                class="group flex items-center justify-between gap-x-3 px-4 py-3 bg-background-200 border border-border-100 rounded-md font-geist-mono text-sm text-text-100 hover:border-primary/40 transition-colors"
              >
                <span class="flex items-center gap-x-2.5">
                  <IconsMail class="w-3.5 h-3.5 text-text-300" />
                  hello@zenithcodes.xyz
                </span>
                <IconsArrowUpRight
                  class="w-3.5 h-3.5 text-text-300 group-hover:text-primary transition-colors"
                />
              </a>

              <!-- <a
                href="https://cal.com/murphy"
                target="_blank"
                class="group flex items-center justify-between gap-x-3 px-4 py-3 bg-background-200 border border-border-100 rounded-md font-geist-mono text-sm text-text-100 hover:border-primary/40 transition-colors"
              >
                <span class="flex items-center gap-x-2.5">
                  <IconsCalendar class="w-3.5 h-3.5 text-text-300" />
                  /discover
                </span>
                <IconsArrowUpRight
                  class="w-3.5 h-3.5 text-text-300 group-hover:text-primary transition-colors"
                />
              </a> -->

              <NuxtLink
                to="/blog"
                class="group flex items-center justify-between gap-x-3 px-4 py-3 font-geist-mono text-sm text-text-200 hover:text-text-100 transition-colors"
              >
                read the blog
                <IconsArrowUpRight
                  class="w-3.5 h-3.5 group-hover:text-primary transition-colors"
                />
              </NuxtLink>
            </div>
          </div>
        </FadeInSection>
      </section>
    </div>
  </div>
</template>
