export function loadExternalJsFile(url: string, name?: string) {
  return new Promise<string | undefined>((resolve, reject) => {
    if (name && globalThis[name as keyof typeof globalThis]) {
      resolve(name);
      return;
    }
    const dom = document.createElement('script');
    dom.src = url;
    dom.type = 'text/javascript';
    dom.onload = () => {
      resolve(name);
    };
    dom.onerror = () => {
      reject();
    };
    document.head.appendChild(dom);
    setTimeout(() => {
      if (name && !globalThis[name as keyof typeof globalThis]) {
        reject();
      }
    }, 3000);
  });
}

export function forbiddenRefresh() {
  document.addEventListener('keydown', (e) => {
    const key = e.key.toLocaleLowerCase();
    if ((e.ctrlKey && key === 'r') || (e.metaKey && key === 'r') || key === 'f5') {
      e.preventDefault();
      console.log('刷新快捷键被禁用');
    }
  });
}
