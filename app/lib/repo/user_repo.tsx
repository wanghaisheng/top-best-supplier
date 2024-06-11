import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { UserModel } from "@/app/models/user_model";
import { NEXT_PUBLIC_GET_USER } from "@/constants";

export async function getIronSessionData() {
  const session = await getIronSession(cookies(), {
    password: process.env.API_SESSION_KEY as string,
    cookieName: process.env.API_COOKIE_NAME as string,
  });
  return session;
}

export default async function getUserData() {
  const sess = (await getIronSessionData()) as UserModel;
  const uid = sess?.uid;
  try {
    const url = `${process.env.NEXT_PUBLIC_BASE_URL}${NEXT_PUBLIC_GET_USER}?uid=${uid}`;

    const res = await fetch(url, {
      next: {
        revalidate: parseInt(process.env.NEXT_PUBLIC_RE_VALIDATE as string, 10),
      },
    });

    if (!res.ok) {
      console.log("Fetch failed");
      return { error: res.statusText };
    }

    const result = await res.json();
    const { data } = result;

    return data;
  } catch (error) {
    console.error(error);

    return {
      error: error.message || "Failed to fetch data",
    };
  }
}
