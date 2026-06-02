declare module 'sanitize-html' {
  interface IOptions {
    allowedTags?: string[] | boolean;
    allowedAttributes?: Record<string, string[]> | boolean;
    [key: string]: any;
  }
  function sanitizeHtml(html: string, options?: IOptions): string;
  export = sanitizeHtml;
}

declare module '*.css' {
  const content: { [className: string]: string } | void;
  export default content;
}
