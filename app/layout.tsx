import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "../styles/global.css";
import { buildSchema } from "./seo/schema";
import { ConstructMetadata } from "./seo/metadata";
import {
  base_images_url,
  base_url,
  generateBreadcrumb,
  getViewUrl,
} from "./utils/custom_helpers";

const inter = Roboto({
  subsets: ["latin"],
  display: "swap",
  weight: "400",
});

export let result: any = {
  title: "Topingnow",
  canonical: base_url(),
  metadataBase: base_url() as unknown as URL,
  slug: base_url(),
  meta_description:
    "Unlock SEO success with expert tips, tools, and strategies for higher rankings and organic traffic.",
  breadcrumb: generateBreadcrumb([]),
  robots: { index: false, follow: true },
};

export async function generateMetadata({
  params,
  data,
  breadcrumbData,
}: {
  params: { slug: string };
  data: any;
  breadcrumbData: any;
}): Promise<Metadata> {
  if (breadcrumbData) {
    result.breadcrumb = generateBreadcrumb(breadcrumbData);
  }

  const meta = (await ConstructMetadata(result)) as Metadata;
  return meta;
}

export const schema = {
  data: buildSchema(
    base_url(),
    "TopingNow",
    base_images_url("logo.png"),
    result.breadcrumb,
    result
  ),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className} prefix="og: https://ogp.me/ns#">
      <head>
        <script
          id="application"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema.data),
          }}
        />
        <meta
          name="google-site-verification"
          content="DUy4Z0u_kZJCKtWp1atvH5YdJgVdKckOhCofK28NZF8"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
