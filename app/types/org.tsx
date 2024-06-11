interface ImageObject {
  "@type"?: string;
  "@id"?: string;
  url?: string;
  contentUrl?: string;
  caption?: string;
  inLanguage?: string;
  width?: string;
  height?: string;
}

interface PotentialAction {
  "@type"?: string;
  target?: string;
  "query-input"?: string;
}

interface WebSite {
  "@type"?: string;
  "@id"?: string;
  url?: string;
  name?: string;
  potentialAction?: PotentialAction;
  publisher?: {
    "@id"?: string;
  };
  inLanguage?: string;
}

interface BreadcrumbList {
  "@type"?: string;
  "@id"?: string;
  itemListElement?: any[]; // You might want to define a more specific type for itemListElement
}

interface WebPage {
  "@type"?: string;
  "@id"?: string;
  url?: string;
  name?: string;
  datePublished?: string;
  dateModified?: string;
  isPartOf?: {
    "@id"?: string;
  };
  primaryImageOfPage?: {
    "@id"?: string;
  };
  inLanguage?: string;
  breadcrumb?: {
    "@id"?: string;
  };
  mainEntityOfPage?: {
    "@type"?: string;
    name?: string;
    description?: string;
    relatedLink?: any[]; // You might want to define a more specific type for relatedLink
    lastReviewed?: string;
  };
}

interface Article {
  "@type"?: string;
  "@id"?: string;
  image?: {
    "@id"?: string;
  };
  headline?: string;
  description?: string;
  keywords?: string[];
  author?: {
    "@type"?: string;
    name?: string;
  };
  datePublished?: string;
  dateModified?: string;
  isPartOf?: {
    "@id"?: string;
  };
  publisher?: {
    "@id"?: string;
  };
  inLanguage?: string;
  mainEntityOfPage?: {
    "@id"?: string;
  };
}

interface OrganizationData {
  "@context"?: string;
  "@graph"?: (WebSite | ImageObject | BreadcrumbList | WebPage | Article)[];
}

interface Org {
  data: any;
}
