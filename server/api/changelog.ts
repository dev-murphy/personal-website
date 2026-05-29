export default defineEventHandler(async () => {
  // CHANGELOG.md is bundled into the server build as a Nitro server asset (see
  // the copy step in nuxt.config.ts), so it's read from storage rather than the
  // filesystem — this works regardless of the runtime working directory.
  const changelog = await useStorage("assets:server").getItem<string>(
    "CHANGELOG.md",
  );

  if (changelog == null) {
    throw createError({
      statusCode: 404,
      statusMessage: "Changelog not found",
    });
  }

  return changelog;
});
