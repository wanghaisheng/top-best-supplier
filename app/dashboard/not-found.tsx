import Link from "next/link";
import UserLayout from "./layout";
export default function NotFound() {
  return (
    <div className="flex h-screen">
      <div className="m-auto text-center">
        <h2>Not Found</h2>
        <p>Could not find requested page</p>
      </div>
    </div>
  );
}
