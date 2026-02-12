// Minimal stub for @types/node until npm install is run
declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV?: string;
    [key: string]: string | undefined;
  }
}
declare const process: { env: NodeJS.ProcessEnv };
declare const Buffer: { isBuffer(o: unknown): boolean };
