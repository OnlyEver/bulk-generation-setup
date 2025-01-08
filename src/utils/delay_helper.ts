export const delay = (seconds: number) =>
    new Promise<void>((res, rej) => setTimeout(() => res(), seconds * 1000));