import { useAppStore } from "../hooks/useAppStore";

export function preventScaleReset(...args: any[]) {
  // Standard Decorator: (method, context)
  if (args.length === 2 && typeof args[1] === "object") {
    const [originalMethod, _context] = args;
    return async function (this: any, ...runtimeArgs: any[]) {
      let returnValue: any;
      const store = useAppStore.getState();
      if (store.isToolbarOpen) {
        returnValue = await originalMethod.apply(this, runtimeArgs);
        store.setScale(1);
      } else {
        store.setScale(1);
        returnValue = await originalMethod.apply(this, runtimeArgs);
      }
      return returnValue;
    };
  }

  // Legacy Decorator: (target, key, descriptor)
  if (args.length === 3) {
    const [_target, _key, descriptor] = args;
    const originalMethod = descriptor.value;
    descriptor.value = async function (this: any, ...runtimeArgs: any[]) {
      let returnValue: any;
      const store = useAppStore.getState();
      if (store.isToolbarOpen) {
        returnValue = await originalMethod.apply(this, runtimeArgs);
        store.setScale(1);
      } else {
        store.setScale(1);
        returnValue = await originalMethod.apply(this, runtimeArgs);
      }
      return returnValue;
    };
    return descriptor;
  }
}

export function disableHistoryRecording(...args: any[]) {
  // Standard Decorator: (method, context)
  if (args.length === 2 && typeof args[1] === "object") {
    const [originalMethod, _context] = args;
    return async function (this: any, ...runtimeArgs: any[]) {
      const store = useAppStore.getState();
      store.history.disableRecording();
      const returnValue = await originalMethod.apply(this, runtimeArgs);
      store.history.enableRecording();
      return returnValue;
    };
  }

  // Legacy Decorator: (target, key, descriptor)
  if (args.length === 3) {
    const [_target, _key, descriptor] = args;
    const originalMethod = descriptor.value;
    descriptor.value = async function (this: any, ...runtimeArgs: any[]) {
      const store = useAppStore.getState();
      store.history.disableRecording();
      const returnValue = await originalMethod.apply(this, runtimeArgs);
      store.history.enableRecording();
      return returnValue;
    };
    return descriptor;
  }
}
