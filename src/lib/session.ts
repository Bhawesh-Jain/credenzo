import { SessionOptions, getIronSession } from "iron-session";
import { cookies } from "next/headers"

export const sessionOptions: SessionOptions = {
  password: process.env.SECRET_KEY!, 
  cookieName: "2vym218dd0",
  cookieOptions: {
    httpOnly: true,
    maxAge: 24 * 60 * 60, 
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000), 
    secure: process.env.NODE_ENV === "production"
  }
}

export interface SessionData {
  user_id?: String;
  user_phone?: String;
  user_email?: String;
  user_avatar?: String;
  company_name?: String;
  company_id?: String;
  isLoggedIn: boolean;
}

export const defaultSession: SessionData = {
  isLoggedIn:false
}


export const getSession = async () => {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);
  
  return session;
}