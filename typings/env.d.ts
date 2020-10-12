declare namespace NodeJS {
  export interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test';
    DISCORD__BOT_TOKEN: string;
    DB_URI: string;
    PREFIX: string;
  }
}
