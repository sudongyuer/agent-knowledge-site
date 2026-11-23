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

for (const block of document.querySelectorAll<HTMLElement>('.code-block')) {
  const pre = block.querySelector('pre');
  const button = block.querySelector<HTMLButtonElement>('.copy-button');
  if (!pre || !button) continue;
  const idle = button.innerHTML;
  let timer: number | undefined;
  button.addEventListener('click', async () => {
    window.clearTimeout(timer);
    try {
      await writeClipboard(pre.querySelector('code')?.innerText ?? pre.innerText);
      button.dataset.state = 'done';
      setLabel(button, checkIcon, '已复制');
      announcer.textContent = '已复制';
    } catch {
      button.innerHTML = idle.replace('复制', '复制失败');
      announcer.textContent = '复制失败，请手动选中文本复制';
    }
    timer = window.setTimeout(() => {
      delete button.dataset.state;
      button.innerHTML = idle;
    }, 1600);
  });
}
