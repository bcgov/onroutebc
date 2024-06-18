declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    config: any
  }
}

export const env: Record<string, any> = { ...import.meta.env, ...window.config };
