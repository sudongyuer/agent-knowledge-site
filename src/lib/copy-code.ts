const copyIcon =
  '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>';
const checkIcon =
  '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>';

async function writeClipboard(text: string) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }
  // navigator.clipboard is unavailable over plain HTTP on a LAN address (e.g. `--host 0.0.0.0` preview)
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.append(textarea);
  textarea.select();
  document.execCommand('copy');
  textarea.remove();
}

function setLabel(button: HTMLButtonElement, icon: string, text: string) {
  button.innerHTML = `${icon}<span>${text}</span>`;
}

const announcer = document.createElement('span');
announcer.className = 'visually-hidden';
announcer.setAttribute('aria-live', 'polite');
document.body.append(announcer);

for (const pre of document.querySelectorAll<HTMLPreElement>('.prose pre')) {
  pre.setAttribute('translate', 'no');
  const wrapper = document.createElement('div');
  wrapper.className = 'code-block';

  const bar = document.createElement('div');
  bar.className = 'code-block__bar';

  const label = document.createElement('span');
  label.className = 'code-block__lang';
  const lang = pre.dataset.language;
  if (lang && lang !== 'plaintext' && lang !== 'text') label.textContent = lang;

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'copy-button';
  setLabel(button, copyIcon, '复制');
  button.addEventListener('click', async () => {
    try {
      await writeClipboard(pre.querySelector('code')?.innerText ?? pre.innerText);
      button.dataset.state = 'done';
      setLabel(button, checkIcon, '已复制');
      announcer.textContent = '已复制';
    } catch {
      setLabel(button, copyIcon, '复制失败');
      announcer.textContent = '复制失败，请手动选中文本复制';
    }
    setTimeout(() => {
      delete button.dataset.state;
      setLabel(button, copyIcon, '复制');
    }, 1600);
  });

  bar.append(label, button);
  pre.replaceWith(wrapper);
  wrapper.append(bar, pre);
}
