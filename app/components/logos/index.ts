import Git from "~/components/logos/Git.vue";
import Tailwindcss from "~/components/logos/Tailwindcss.vue";
import Docker from "~/components/logos/Docker.vue";
import PostgreSQL from "~/components/logos/PostgreSQL.vue";

// Frameworks and Libraries
import Nuxt from "~/components/logos/Nuxt.vue";
import React from "~/components/logos/React.vue";
import NextJs from "~/components/logos/NextJs.vue";
import FastApi from "~/components/logos/FastApi.vue";
import Node from "~/components/logos/Node.vue";
import Bun from "~/components/logos/Bun.vue";
import Pnpm from "~/components/logos/Pnpm.vue";

// Languages
import Python from "~/components/logos/Python.vue";
import Typescript from "~/components/logos/Typescript.vue";
import Javascript from "~/components/logos/Javascript.vue";
import Html from "~/components/logos/Html.vue";
import Css from "~/components/logos/Css.vue";
import Php from "~/components/logos/Php.vue";
import Go from "~/components/logos/Go.vue";

export type TechItem = { logo: Component; name: string };

export const languages: TechItem[] = [
  { logo: Javascript, name: "JavaScript" },
  { logo: Typescript, name: "TypeScript" },
  { logo: Html, name: "HTML5" },
  { logo: Css, name: "CSS3" },
  { logo: Python, name: "Python" },
  { logo: Php, name: "PHP" },
  { logo: Go, name: "Go" },
];

export const frameworks: TechItem[] = [
  { logo: Nuxt, name: "Nuxt" },
  { logo: React, name: "React" },
  { logo: NextJs, name: "Next.js" },
  { logo: FastApi, name: "FastAPI" },
  { logo: Node, name: "Node.js" },
  { logo: Bun, name: "Bun" },
  { logo: Pnpm, name: "pnpm" },
];

export const tools: TechItem[] = [
  { logo: Git, name: "Git" },
  { logo: Docker, name: "Docker" },
  { logo: Tailwindcss, name: "Tailwind CSS" },
  { logo: PostgreSQL, name: "PostgreSQL" },
];
