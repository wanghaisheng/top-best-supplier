"use client";

import { Button, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { auth } from "@/app/utils/firebase";
import { onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import Link from "next/link";
import { LoginSession } from "@/app/controllers/route";
import { toast } from "sonner";
import { redirect, useRouter } from "next/navigation";
import { NEXT_PUBLIC_DASHBOARD_LINK } from "@/constants";

const UploadForm = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setloading] = useState(false);
  const [uid, setUID] = useState(null);

  function setupFirebaseAuthListener() {
    const unsubscribe = onAuthStateChanged(auth, async (authUser: any) => {
      if (authUser) {
        const { uid } = authUser;
        setUID(uid);
      }
    });
    return () => unsubscribe();
  }

  useEffect(setupFirebaseAuthListener, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setloading(true);

    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      await LoginSession(uid);
      router.push(NEXT_PUBLIC_DASHBOARD_LINK as string);
    } catch (error) {
      console.log(error.code);
      if (error.code === "auth/invalid-email") {
        toast.error("Invalid email");
      } else if (error.code === "auth/wrong-password") {
        toast.error("Wrong password");
      } else if (error.code == "auth/invalid-login-credentials") {
        toast.error("Wrong password or Email");
      } else if (error.code == "auth/missing-password") {
        toast.error("missing password");
      } else {
        toast.error("Unknown error");
      }
    } finally {
      setloading(false);
    }
  };

  return (
    <div className="relative bg-white px-6 pb-8 pt-10 shadow-xl ring-1 ring-gray-900/5 sm:mx-auto sm:max-w-lg rounded-lg sm:px-10 mx-3">
      <div className="mx-auto max-w-md">
        <div className="divide-y divide-gray-300/50">
          <div className="space-y-6 py-8 text-base leading-7 text-gray-600">
            <p>Login</p>

            <form onSubmit={handleSubmit} method="POST">
              <TextField
                margin="normal"
                variant="outlined"
                label="Email"
                name="email"
                fullWidth
                onChange={(e) => setEmail(e.target.value)}
              />

              <TextField
                margin="normal"
                variant="outlined"
                label="Password"
                name="password"
                type="password"
                fullWidth
                onChange={(e) => setPassword(e.target.value)}
              />

              <Button
                variant="contained"
                color="primary"
                size="large"
                className="bg-indigo-600 hover:bg-indigo-700 text-white py-1 px-1 mt-2 rounded-lg w-full"
                disabled={loading}
                type="submit"
              >
                {loading ? "logging in..." : "Login"}
              </Button>
            </form>
          </div>

          <div className="pt-8 text-base font-semibold leading-7 text-right">
            {" dont't have account?"}
            <Link href="signup" className="text-sky-500 hover:text-sky-600">
              {"   register"} &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadForm;
