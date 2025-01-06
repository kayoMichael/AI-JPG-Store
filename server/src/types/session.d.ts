import 'express-session';

declare module 'express-session' {
  interface SessionData {
    userId: string;
    user: {
      name: string;
      email: string;
    };
  }
}
