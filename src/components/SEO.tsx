import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  ogImage?: string;
  ogType?: "website" | "article";
  canonical?: string;
  noindex?: boolean;
  structuredData?: Record<string, any>;
}

/**
 * SEO Component
 * Dynamically updates document meta tags and structured data for optimal search engine optimization
 */
export function SEO({
  title,
  description,
  keywords,
  ogImage = "https://rarerolestechnologies.com/og-image.jpg",
  ogType = "website",
  canonical,
  noindex = false,
  structuredData,
}: SEOProps) {
  const location = useLocation();
  const fullTitle = `${title} | RareRoles`;
  const url = canonical || `https://rarerolestechnologies.com${location.pathname}`;

  useEffect(() => {
    // Update document title
    document.title = fullTitle;

    // Update or create meta tags
    const updateMetaTag = (property: string, content: string, isProperty = false) => {
      const attribute = isProperty ? "property" : "name";
      let element = document.querySelector(`meta[${attribute}="${property}"]`);

      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attribute, property);
        document.head.appendChild(element);
      }

      element.setAttribute("content", content);
    };

    // Basic meta tags
    updateMetaTag("description", description);
    if (keywords) {
      updateMetaTag("keywords", keywords);
    }

    // Canonical URL
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonicalLink) {
      canonicalLink = document.createElement("link");
      canonicalLink.rel = "canonical";
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.href = url;

    // Robots meta
    if (noindex) {
      updateMetaTag("robots", "noindex, nofollow");
    } else {
      const robotsMeta = document.querySelector('meta[name="robots"]');
      if (robotsMeta) {
        robotsMeta.remove();
      }
    }

    // Open Graph tags
    updateMetaTag("og:title", fullTitle, true);
    updateMetaTag("og:description", description, true);
    updateMetaTag("og:url", url, true);
    updateMetaTag("og:type", ogType, true);
    updateMetaTag("og:image", ogImage, true);
    updateMetaTag("og:site_name", "RareRoles", true);

    // Twitter Card tags
    updateMetaTag("twitter:card", "summary_large_image");
    updateMetaTag("twitter:title", fullTitle);
    updateMetaTag("twitter:description", description);
    updateMetaTag("twitter:image", ogImage);

    // Structured Data (JSON-LD)
    if (structuredData) {
      let scriptTag = document.querySelector('script[type="application/ld+json"]');

      if (!scriptTag) {
        scriptTag = document.createElement("script");
        scriptTag.type = "application/ld+json";
        document.head.appendChild(scriptTag);
      }

      scriptTag.textContent = JSON.stringify(structuredData);
    }

    // Cleanup function
    return () => {
      // Keep meta tags for SPA navigation
    };
  }, [title, description, keywords, ogImage, ogType, url, noindex, structuredData, fullTitle]);

  return null; // This component doesn't render anything
}

/**
 * Predefined structured data schemas
 */
export const structuredDataSchemas = {
  organization: {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "RareRoles",
    description:
      "Specialized talent partner for hard-to-fill enterprise technology roles including AI engineers, Oracle PL/SQL developers, CCIE network engineers, and solution architects.",
    url: "https://rarerolestechnologies.com",
    logo: "https://rarerolestechnologies.com/logo.jpg",
    sameAs: ["https://www.linkedin.com/company/rareroles", "https://twitter.com/rareroles"],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+234-XXX-XXX-XXXX",
      contactType: "Customer Service",
      availableLanguage: ["English"],
    },
  },

  website: {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "RareRoles",
    url: "https://rarerolestechnologies.com",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://rarerolestechnologies.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  },

  service: {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Technical Recruitment",
    provider: {
      "@type": "Organization",
      name: "RareRoles",
      url: "https://rarerolestechnologies.com",
    },
    areaServed: {
      "@type": "Country",
      name: "Global",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Recruitment Services",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Talent Outsourcing",
            description:
              "End-to-end hiring process management for companies scaling their technical teams.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Contract Placements",
            description: "Flexible, project-based technical talent for short-term engagements.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Permanent Hiring",
            description:
              "Long-term technical talent acquisition for building stable engineering teams.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Executive Search",
            description: "C-suite and senior leadership recruitment for technology organizations.",
          },
        },
      ],
    },
  },

  breadcrumbList: (items: Array<{ name: string; url: string }>) => ({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }),

  faqPage: (faqs: Array<{ question: string; answer: string }>) => ({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  }),
};
