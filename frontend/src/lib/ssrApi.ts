import axios from "axios";
import { getAuthCookie } from "./actions/auth/auth-cookies";

export async function createSSRApi() {
  const token = await getAuthCookie();

  return axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
      Cookie: `access_token=${token}`,
    },
  });
}
