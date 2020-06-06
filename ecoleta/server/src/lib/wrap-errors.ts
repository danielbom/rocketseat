export const wrap = (fn: (...args: any) => Promise<any>) => (...args: any[]) =>
  fn(...args).catch(args[2]);
