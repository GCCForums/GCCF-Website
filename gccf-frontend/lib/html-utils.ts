import DOMPurify from "dompurify";

/**
 * Strips HTML tags from a string, producing clean plain text for card previews,
 * metadata, or search indexing. Also decodes basic HTML entities and normalizes whitespace.
 */
export function stripHtml(html?: string | null): string {
  if (!html) return "";
  
  // Replace line breaks and block tags with a space
  const formatted = html
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<\/p>/gi, " ")
    .replace(/<\/li>/gi, " ")
    .replace(/<[^>]*>/g, "");

  // Decode common HTML entities
  const decoded = formatted
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&mdash;/g, "—")
    .replace(/&ndash;/g, "–");

  return decoded.replace(/\s+/g, " ").trim();
}

/**
 * Checks if a string contains HTML markup.
 */
export function isHtml(content?: string | null): boolean {
  if (!content) return false;
  return /<[a-z][\s\S]*>/i.test(content);
}

/**
 * Sanitizes HTML content safely, allowing rich formatting tags while preventing XSS.
 * Can be safely called on client or server.
 */
export function sanitizeHtml(html?: string | null): string {
  if (!html) return "";

  if (typeof window === "undefined") {
    // Basic server-side fallback: strip script, iframe, and dangerous event handlers
    return html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
      .replace(/on\w+="[^"]*"/gi, "")
      .replace(/on\w+='[^']*'/gi, "")
      .replace(/javascript:[^"']*/gi, "");
  }

  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      "p",
      "br",
      "strong",
      "b",
      "em",
      "i",
      "u",
      "ul",
      "ol",
      "li",
      "a",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "blockquote",
      "span",
      "hr",
    ],
    ALLOWED_ATTR: ["href", "target", "rel", "class", "title"],
    ADD_ATTR: ["target"],
    FORBID_TAGS: ["script", "style", "iframe", "object", "embed", "form", "input"],
    FORBID_ATTR: ["onerror", "onload", "onclick", "onmouseover", "style"],
  });
}
