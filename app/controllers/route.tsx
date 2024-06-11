"use server";
import { SessionData } from "@/app/lib/route";
import { defaultSession, sessionOptions, sleep } from "@/app/lib/route";
import { getIronSession, IronSession } from "iron-session";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function getSession(shouldSleep = true) {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);

  if (!session?.isLoggedIn) {
    session.isLoggedIn = defaultSession.isLoggedIn;
    session.uid = defaultSession.uid;
  }

  if (shouldSleep) {
    // simulate looking up the user in db
    await sleep(250);
  }
  return session;
}

export async function LoginSession(uid: string | null) {
  const session = await getSession();
  session.uid = (uid as string) ?? "";
  session.isLoggedIn = true;
  await session.save();
  return {
    status: true,
  };
}

export async function logout() {
  // false => no db call for logout
  const session = await getSession(false);
  session.destroy();
  return NextResponse.json({ success: true });
}
