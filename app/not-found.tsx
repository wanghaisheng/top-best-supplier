import Link from "next/link";
import Layout from "./[slug]/layout";

export default function NotFound() {
  return (
    <Layout>
      <div className="flex h-screen">
        <div className="m-auto text-center">
          <h2>Not Found</h2>
          <p>Could not find requested page</p>
        </div>
      </div>
    </Layout>
  );
}
