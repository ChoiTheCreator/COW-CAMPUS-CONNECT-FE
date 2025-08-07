import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function throttle<T extends (...args: any[]) => void>(
  callbackFn: T,
  timerTick: number
): T {
  let waiting = false;
  return ((...args: Parameters<T>) => {
    if (!waiting) {
      callbackFn(...args);
      waiting = true;
      setTimeout(() => (waiting = false), timerTick);
    }
  }) as T;
}
