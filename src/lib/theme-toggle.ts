const root = document.documentElement;
const themeColors = { light: '#ffffff', dark: '#0a0a0a' };
const systemDark = window.matchMedia('(prefers-color-scheme: dark)');

function currentTheme() {
  return root.dataset.theme ?? (systemDark.matches ? 'dark' : 'light');
}

for (const button of document.querySelectorAll<HTMLButtonElement>('.theme-toggle')) {
  button.addEventListener('click', () => {
    const next = currentTheme() === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    for (const meta of document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]')) {
      meta.content = themeColors[next];
    }
    try {
      localStorage.setItem('theme', next);
    } catch {}
  });
}
