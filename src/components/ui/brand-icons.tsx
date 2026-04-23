import type { SVGProps } from "react";

export function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

export function FacebookIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

/**
 * Official WhatsApp brand mark — green circle (#25D366) with white phone glyph.
 * Pass `mono` to render a single-color glyph that follows currentColor instead.
 */
export function WhatsAppIcon({
  mono = false,
  ...props
}: SVGProps<SVGSVGElement> & { mono?: boolean }) {
  if (mono) {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M19.05 4.91A10 10 0 0 0 12 2 10 10 0 0 0 2 12a10 10 0 0 0 1.34 5L2 22l5.16-1.32A10 10 0 0 0 12 22a10 10 0 0 0 7.05-17.09zM12 20.27a8.27 8.27 0 0 1-4.21-1.15l-.3-.18-3.06.78.82-2.98-.2-.31A8.26 8.26 0 1 1 12 20.27zm4.55-6.18c-.25-.13-1.47-.73-1.7-.81-.23-.08-.4-.13-.56.13-.17.25-.65.81-.79.98-.15.17-.29.18-.54.06a6.79 6.79 0 0 1-2-1.23 7.5 7.5 0 0 1-1.39-1.72c-.15-.25 0-.39.11-.51.11-.11.25-.29.37-.43.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.43-.06-.13-.56-1.35-.77-1.84-.2-.49-.41-.42-.57-.43h-.48a.93.93 0 0 0-.67.31 2.81 2.81 0 0 0-.88 2.09 4.86 4.86 0 0 0 1.02 2.6 11.13 11.13 0 0 0 4.27 3.78c.6.26 1.06.41 1.43.53.6.19 1.15.16 1.59.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.07-.11-.23-.17-.48-.3z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 32 32" {...props}>
      <circle cx="16" cy="16" r="16" fill="#25D366" />
      <path
        fill="#FFFFFF"
        d="M22.7 9.3A9.3 9.3 0 0 0 16 6.7 9.27 9.27 0 0 0 6.74 16a9.21 9.21 0 0 0 1.24 4.62L6.67 25.3l4.79-1.25a9.27 9.27 0 0 0 4.54 1.16h.01A9.27 9.27 0 0 0 25.27 16a9.22 9.22 0 0 0-2.57-6.7zm-6.7 14.27a7.7 7.7 0 0 1-3.92-1.07l-.28-.17-2.84.74.76-2.77-.18-.29a7.7 7.7 0 1 1 6.46 3.56zm4.23-5.77c-.23-.12-1.37-.68-1.58-.75-.21-.08-.37-.12-.52.12-.15.23-.6.75-.74.91-.14.15-.27.17-.5.06a6.32 6.32 0 0 1-1.86-1.15 7 7 0 0 1-1.29-1.6c-.13-.23.01-.36.1-.47.1-.1.23-.27.34-.4.12-.14.16-.23.23-.39.08-.15.04-.29-.02-.4-.06-.12-.52-1.25-.71-1.71-.19-.45-.38-.39-.52-.4h-.45a.86.86 0 0 0-.62.29 2.6 2.6 0 0 0-.81 1.94 4.5 4.5 0 0 0 .94 2.41 10.34 10.34 0 0 0 3.96 3.51c.55.24.98.38 1.32.49.55.17 1.06.15 1.46.09.45-.07 1.37-.56 1.56-1.1.19-.54.19-1 .14-1.1-.05-.1-.21-.16-.45-.28z"
      />
    </svg>
  );
}
