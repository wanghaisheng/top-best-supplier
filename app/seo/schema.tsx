import { base_url, getViewUrl } from "../utils/custom_helpers";

export const buildSchema = (url, name, logoUrl, breadcrumb, article) => {
  const baseUrl = base_url();

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["Organization"],
        "@id": `${url}#organization`,
        name,
        url,
        logo: {
          "@type": "ImageObject",
          "@id": `${url}#logo`,
          url: logoUrl,
          contentUrl: logoUrl,
          caption: name,
          inLanguage: "en-US",
          width: "250",
          height: "250",
        },
      },
      {
        "@type": "WebSite",
        "@id": `${baseUrl}/search/#website`,
        url,
        name,
        potentialAction: {
          "@type": "SearchAction",
          target: `${url}/search/{search_term_string}`,
          "query-input": "required name=search_term_string",
        },
        publisher: {
          "@id": `${baseUrl}#organization`,
        },
        inLanguage: "en-US",
      },
      {
        "@type": "ImageObject",
        "@id": logoUrl,
        url: logoUrl,
        width: "141",
        height: "250",
        inLanguage: "en-US",
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: breadcrumb,
      },
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url: `${url}#webpage`,
        name: `${article.title} - ${name}`,
        isPartOf: {
          "@id": `${url}#website`,
        },
        primaryImageOfPage: {
          "@id": logoUrl,
        },
        inLanguage: "en-US",
        breadcrumb: {
          "@id": `${url}#breadcrumb`,
        },
        mainEntityOfPage: {
          "@type": "SearchResultsPage",
          name: "Find your latest",
          description: "Find your latest",
          relatedLink: [],
          lastReviewed: new Date(article.updated_at ?? false).toISOString(),
        },
      },
      {
        "@type": "Article",
        "@id": `${url}#schema-50750`,
        image: {
          "@id": logoUrl,
        },
        headline: article.title,
        description: article.meta?.description ?? "",
        keywords: [],
        author: {
          "@type": "Person",
          name: article.author,
        },

        isPartOf: {
          "@id": `${url}#webpage`,
        },
        publisher: {
          "@id": `${url}#organization`,
        },
        inLanguage: "en-US",
        mainEntityOfPage: {
          "@id": `${url}#webpage`,
        },
      },
    ],
  };
};
