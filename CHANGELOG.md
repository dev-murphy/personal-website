# Changelog

## [1.6.1](https://github.com/dev-murphy/personal-website/compare/v1.6.0...v1.6.1) (2026-06-11)

### 🧹 Miscellaneous

* remove sentry example test routes ([bfe6deb](https://github.com/dev-murphy/personal-website/commit/bfe6deb19b23c0656288b7a7a770bc4f241b29ba))

## [1.6.0](https://github.com/dev-murphy/personal-website/compare/v1.5.2...v1.6.0) (2026-06-11)

### ✨ Features

* add posthog product analytics ([dca1cea](https://github.com/dev-murphy/personal-website/commit/dca1cea0474d0cba6a1e1541a199f816b825ef2a))

### 🧹 Miscellaneous

* add sentry example test routes ([cc66d00](https://github.com/dev-murphy/personal-website/commit/cc66d000d4281060f40d617ebdc5c0f41fbd9d8a))

## [1.5.2](https://github.com/dev-murphy/personal-website/compare/v1.5.1...v1.5.2) (2026-06-11)

### 🧹 Miscellaneous

* add sentry error monitoring to project ([25e0f20](https://github.com/dev-murphy/personal-website/commit/25e0f20c1794817631c227e05decb61711a3efcb))

## [1.5.1](https://github.com/dev-murphy/personal-website/compare/v1.5.0...v1.5.1) (2026-06-11)

### 🧹 Miscellaneous

* add plausible analytics to project ([8296af6](https://github.com/dev-murphy/personal-website/commit/8296af67e93561455cda284fd1e5eef98687f237))

## [1.5.0](https://github.com/dev-murphy/personal-website/compare/v1.4.0...v1.5.0) (2026-05-31)

### ✨ Features

* **blog:** support anonymous comments and content filtering ([dc832b4](https://github.com/dev-murphy/personal-website/commit/dc832b4f7f09d907f1e88681c51d56b2207a8836))
* **projects:** add projects catalog with filtering and realtime ([001c6db](https://github.com/dev-murphy/personal-website/commit/001c6dbdfe71571496d5fd5cc3d05038e180f83d))

### 🐛 Bug Fixes

* **app:** wrapped theme toggle in client only to prevent hydration mishaps ([c7a7ce0](https://github.com/dev-murphy/personal-website/commit/c7a7ce00fda5fbaf7f3845e034f57fa3de8501c4))
* **auth:** prevent Safari popup block and force Google account chooser ([c35728c](https://github.com/dev-murphy/personal-website/commit/c35728c19fe457077d1369c6dc346ed3167c2229))

## [1.4.0](https://github.com/dev-murphy/personal-website/compare/v1.3.3...v1.4.0) (2026-05-31)

### ✨ Features

* **blog:** make likes and reactions realtime ([cd4729b](https://github.com/dev-murphy/personal-website/commit/cd4729bbbb3cefca0496d6fcf916fd959443e57c))

### ⚡ Performance Improvements

* **docker:** cache deps across deploys to speed up image builds ([ff77aa8](https://github.com/dev-murphy/personal-website/commit/ff77aa87a78deb9a160c42994f76a1a408ebd444))

## [1.3.3](https://github.com/dev-murphy/personal-website/compare/v1.3.2...v1.3.3) (2026-05-31)

### 🧹 Miscellaneous

* update octo eureka and sda hymns live site urls ([7ec8a26](https://github.com/dev-murphy/personal-website/commit/7ec8a268b102a3996fdaa7861e1ea19b6d620f54))

### 🔨 Code Refactors

* use localStorage instead of sessionStorage for session management ([0d764e2](https://github.com/dev-murphy/personal-website/commit/0d764e274d2ba91eda39a86b7aa06193456d2866))

## [1.3.2](https://github.com/dev-murphy/personal-website/compare/v1.3.1...v1.3.2) (2026-05-31)

### 🐛 Bug Fixes

* inject PocketBase URL at runtime via NUXT_PUBLIC_ prefix ([d00fe5a](https://github.com/dev-murphy/personal-website/commit/d00fe5ae68739fa83748d396e2a99a1517010c85))

## [1.3.1](https://github.com/dev-murphy/personal-website/compare/v1.3.0...v1.3.1) (2026-05-31)

### 🐛 Bug Fixes

* add blog link on landing page ([9e04209](https://github.com/dev-murphy/personal-website/commit/9e042094e361cfe8a89d2ac86df55a36444275c6))

### ⚙️ CI/CD

* add pocketbase env to compose file ([94758a8](https://github.com/dev-murphy/personal-website/commit/94758a84bb0af8eb8b0e96dda3ec47ee2a2922a5))

## [1.3.0](https://github.com/dev-murphy/personal-website/compare/v1.2.3...v1.3.0) (2026-05-31)

### ✨ Features

* add blog engagement features with PocketBase backend ([a1211a1](https://github.com/dev-murphy/personal-website/commit/a1211a1ea29e0dda45b969d0e9d504defdfa752a))
* create blog pages ([ab00060](https://github.com/dev-murphy/personal-website/commit/ab00060a625b2f31cdd5e19c29b82d8348e1f8d3))

### 🐛 Bug Fixes

* resolve type errors in BlogChart and ProsePre ([b922e8a](https://github.com/dev-murphy/personal-website/commit/b922e8ad89c0b19b7199d2ad051ea07c90b46281))

### 🧹 Miscellaneous

* add arrow and clock icon for blog pages ([5b078ae](https://github.com/dev-murphy/personal-website/commit/5b078ae6e958d3f6592bde9b563bc6e8285e7264))
* add blogs folder and schema to content config ([2025af6](https://github.com/dev-murphy/personal-website/commit/2025af657bcaa05a1245bbcdac9c4cce1a7587d5))
* add content component for blog pages ([32cf6d9](https://github.com/dev-murphy/personal-website/commit/32cf6d903cf9c16d7f7c39098dcbb45fee2ede94))
* install nuxt-charts deps to app ([54cffa1](https://github.com/dev-murphy/personal-website/commit/54cffa1afeab50a7d8567b4dee260b19a4e5db27))

### 📖 Documentation

* create first blog post ([77180d5](https://github.com/dev-murphy/personal-website/commit/77180d5dedd834da7a3c5098b82d172b93dc97b6))

### 💅 UI Updates

* configure shiki theme and markdown languages and site name ([b12bbf5](https://github.com/dev-murphy/personal-website/commit/b12bbf52eb09d95c4d276cca48f1ac9ba1c8aa39))

## [1.2.3](https://github.com/dev-murphy/personal-website/compare/v1.2.2...v1.2.3) (2026-05-29)

### 🐛 Bug Fixes

* keep section highlight working after returning to home ([80b2967](https://github.com/dev-murphy/personal-website/commit/80b2967179eb025cf9594845aad330a4bd7b6999))

## [1.2.2](https://github.com/dev-murphy/personal-website/compare/v1.2.1...v1.2.2) (2026-05-29)

### 🐛 Bug Fixes

* serve changelog from bundled server asset ([79d74e3](https://github.com/dev-murphy/personal-website/commit/79d74e3b225fbb7b6113c66596ee261dc0fdf4ee))

## [1.2.1](https://github.com/dev-murphy/personal-website/compare/v1.2.0...v1.2.1) (2026-05-29)

### 🐛 Bug Fixes

* add password for redis connection ([cafc84f](https://github.com/dev-murphy/personal-website/commit/cafc84f3db37cc0210d1fd3406db68d29a26bf8c))

## [1.2.0](https://github.com/dev-murphy/personal-website/compare/v1.1.3...v1.2.0) (2026-05-29)

### ✨ Features

* add changelog page ([23c104f](https://github.com/dev-murphy/personal-website/commit/23c104fcd6010a090aad52eb30daf468c12b1e07))

### 🐛 Bug Fixes

* add retry logic to redis connection and remove it from the build process ([6ad12fc](https://github.com/dev-murphy/personal-website/commit/6ad12fc0525637c9aae1e65247d79e6357c146bb))

### 🧹 Miscellaneous

* add home link on navbar for pages ([069a6be](https://github.com/dev-murphy/personal-website/commit/069a6be550d4937ddf4665ad423d68e4fd7ae7fa))
* add rate limiting ([cd5a055](https://github.com/dev-murphy/personal-website/commit/cd5a05557f71d5787b13b2751c4fcd4909458355))
* change to contact us meta to "Quick Replies" ([7f579bb](https://github.com/dev-murphy/personal-website/commit/7f579bba567452f692fac76852a062989a95fa67))
* update app name in header ([be46a34](https://github.com/dev-murphy/personal-website/commit/be46a342841473cf97f69694725c52e4827caee5))
* use env value for docker compose ([b9fe2fb](https://github.com/dev-murphy/personal-website/commit/b9fe2fb9a8df05dc085c59bc58825b25cc28201b))

### ⚙️ CI/CD

* add docker compose file ([4a881ec](https://github.com/dev-murphy/personal-website/commit/4a881ece757d16ad46b10d04c39b37906f069f10))

### 💅 UI Updates

* reduce heading text ([ed1ccd0](https://github.com/dev-murphy/personal-website/commit/ed1ccd01f2eae0b87223c8afeb1ad1dc5b4dd9ac))

## [1.1.3](https://github.com/dev-murphy/personal-website/compare/v1.1.2...v1.1.3) (2026-05-29)

### 🐛 Bug Fixes

* resolve 500 error from conflicting unhead versions ([22af12f](https://github.com/dev-murphy/personal-website/commit/22af12f43a806af0c8b14478362f1069a108c3f3))

## [1.1.2](https://github.com/dev-murphy/personal-website/compare/v1.1.1...v1.1.2) (2026-05-29)

### 📖 Documentation

* add basic project information ([7dfec15](https://github.com/dev-murphy/personal-website/commit/7dfec15334877ef4950f325473ae200e3b549621))

### ⚙️ CI/CD

* resolve better-sqlite3 dependency issue ([5791055](https://github.com/dev-murphy/personal-website/commit/5791055de213bf822d2286aaa9e734a588ed7522))

## [1.1.1](https://github.com/dev-murphy/personal-website/compare/v1.1.0...v1.1.1) (2026-05-29)

### ⚙️ CI/CD

* add external dependency for better-sqlite3 to Dockerfile ([dbce282](https://github.com/dev-murphy/personal-website/commit/dbce282473c91d79d836a42f85855fad307e0409))

## [1.1.0](https://github.com/dev-murphy/personal-website/compare/v1.0.1...v1.1.0) (2026-05-29)

### ✨ Features

* build portfolio landing page and theming ([09ef0e4](https://github.com/dev-murphy/personal-website/commit/09ef0e4a5afc24f5dd01e0a92a92a9466ea28eae))

### 🧹 Miscellaneous

* add [@vueuse](https://github.com/vueuse) dependencies ([b9a9043](https://github.com/dev-murphy/personal-website/commit/b9a9043a8e8cbb4fe2339e22c7512b357d8ed9f2))
* add favicon assets ([ea0891a](https://github.com/dev-murphy/personal-website/commit/ea0891a9af0dffdb1e4d1795018017ba32c99dd1))
* add needed dependencies such as nuxt-image, nuxt-content, nuxt-seo... ([3e9ef85](https://github.com/dev-murphy/personal-website/commit/3e9ef85dd9ebf0c3714ef269496657dfd82682a6))
* ignore .claude directory ([8153365](https://github.com/dev-murphy/personal-website/commit/8153365965218f6b50fc63ab57757bb9212f2250))

## [1.0.1](https://github.com/dev-murphy/personal-website/compare/v1.0.0...v1.0.1) (2026-05-24)

### 🔨 Code Refactors

* expose app on port 3002 ([f41ed6a](https://github.com/dev-murphy/personal-website/commit/f41ed6ab53b92440a15024db3aecb03af5754cad))

## 1.0.0 (2026-05-24)

### ✨ Features

* initial commit ([37c1827](https://github.com/dev-murphy/personal-website/commit/37c1827477a5e31760ca1c8308f239c158e6bbf4))

### 🐛 Bug Fixes

* add package manager to package.json ([a079d3c](https://github.com/dev-murphy/personal-website/commit/a079d3cd9c52d60193f76db6d0bdb58b0f8778ca))

### 🧹 Miscellaneous

* add .npmrc file ([f055f19](https://github.com/dev-murphy/personal-website/commit/f055f19da0bb59854c04ebc03ea73fc4d1402257))

### 📖 Documentation

* add MIT license ([58695d6](https://github.com/dev-murphy/personal-website/commit/58695d679513e5267d4a4bcfeb21c7aad27f7bb5))

### ⚙️ CI/CD

* add Dockerfile and .dockerignore to app ([90ee4fa](https://github.com/dev-murphy/personal-website/commit/90ee4fa22667f98af7dedb9dc9f6bc7d5d7c06fe))
* **semantic-release:** add release config and action to app ([707137f](https://github.com/dev-murphy/personal-website/commit/707137f42b492f8aa6fb57371d625c821560416f))
