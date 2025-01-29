import { redirect } from "next/navigation";
import { getSession } from "../session";


export const login = async (
  body: {
    user_id: String,
    user_phone: String,
    user_email: String,
    user_avatar: String,
    company_name: String,
    company_id: String,
  }
) => {
  const session = await getSession();

  const user_id = body['user_id'] as string
  const user_phone = body['user_phone'] as string
  const user_email = body['user_email'] as string
  const user_avatar = body['user_avatar'] as string
  const company_name = body['company_name'] as string
  const company_id = body['company_id'] as string

  session.user_id = user_id
  session.user_phone = user_phone
  session.user_email = user_email
  session.user_avatar = user_avatar
  session.company_name = company_name
  session.company_id = company_id
  session.isLoggedIn = true

  await session.save()

  redirect("/dashboard")
}



export const logout = async () => {
  const session = await getSession()

  session.destroy()
  redirect("/")
}
