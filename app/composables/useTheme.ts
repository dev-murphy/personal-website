export const useTheme = () => {
  const mode = useColorMode();
  const isDark = computed(() => mode.value === "dark");

  const toggleTheme = () => {
    mode.value = isDark.value ? "light" : "dark";
  };

  return { isDark, toggleTheme };
};
