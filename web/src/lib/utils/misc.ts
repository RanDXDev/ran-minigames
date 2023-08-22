export const isEnvBrowser = (): boolean => !(window as any).invokeNative;

export async function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
