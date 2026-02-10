/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_LD_API_TOKEN: string;
  readonly VITE_LD_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
