"use server"
import { redirect } from "next/navigation";
import { getSession } from "../session";
import { UserRepository } from "../repositories/userRepository";

export type UserData = {
  user_id: string;
  user_phone: string;
  user_email: string;
  user_avatar: string;
  company_name: string;
  company_id: string;
};


export async function handleLoginForm(formData: FormData) {
  const formObject = Object.fromEntries(formData.entries());

  let { username, password, clientIp } = formObject;

  try {
    const authService = new UserRepository();

    const result = await authService.login(username.toString(), password.toString(), clientIp.toString());

    if (result.success) {
      if (result.user == null) {
        throw new Error("Invalid User!");
      }

      await login(result.user);

      return {
        success: true,
        message: "Login Succesfull!"
      }
    } else {
      return {
        success: false,
        message: result.error
      }
    }
  } catch (error) {
    console.log('auth.ts', error);

    return {
      success: false,
      message: "Login Request Not Processed!"
    };
  }
}

export async function login(userData: UserData) {
  const session = await getSession();

  Object.assign(session, {
    ...userData,
    isLoggedIn: true,
  });

  await session.save();
}

export async function logout() {
  const session = await getSession();
  session.destroy();
}