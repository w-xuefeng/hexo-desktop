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
