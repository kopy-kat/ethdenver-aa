declare namespace NodeJS {
  export interface ProcessEnv {
    NOTION_API_TOKEN: string;
    NOTION_DATABASE_ID: string;
    GOOGLE_CLIENT_ID: string;
    GOOGLE_CLIENT_SECRET: string;
    NEXTAUTH_URL: string;
    NEXTAUTH_SECRET: string;
    DATABASE_URL: string;
  }
}
