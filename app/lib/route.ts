
import { SessionOptions  } from "iron-session";

export interface SessionData {
  uid: string;
  isLoggedIn: boolean;
}

export const defaultSession: SessionData = {
  uid: "",
  isLoggedIn: false,
};

export const sessionOptions: SessionOptions  = {
  password: process.env.API_SESSION_KEY as string,
    cookieName: process.env.API_COOKIE_NAME as string,
  cookieOptions: {
    // secure only works in `https` environments
    // if your localhost is not on `https`, then use: `secure: process.env.NODE_ENV === "production"`
    secure: process.env.NODE_ENV === "production",
  },
};

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
