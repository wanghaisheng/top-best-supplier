import getUserData from "@/app/lib/repo/user_repo";
import { redirect } from "next/navigation";
import UploadForm from "../components/S3_upload_form";

const page = async () => {
  const user = await getUserData();
  if (!user) {
    redirect("/auth/login");
  }
  return (
    <div className="p-4">
      welcome {user.name}
      <br />
      <UploadForm />
    </div>
  );
};

export default page;
