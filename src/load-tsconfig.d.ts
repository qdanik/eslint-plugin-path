declare module 'load-tsconfig' {
  export function loadTsConfig(dir: string, name: string): {
    data: {
      compilerOptions: {
        paths: Record<string, string[]>;
      };
    };
  };
}