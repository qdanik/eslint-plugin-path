declare module 'load-tsconfig' {
  export function loadTsConfig(path: string): {
    data: {
      compilerOptions: {
        paths: Record<string, string[]>;
      };
    };
  };
}