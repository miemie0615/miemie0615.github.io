/**
 * Rehype plugin that optimizes `<img>` elements in markdown/mdx content:
 * - Adds `loading="lazy"` and `decoding="async"` for deferred loading
 * - Preserves existing `alt` text; adds empty alt if missing for accessibility
 * - Adds CSS class `content-image` for responsive styling hooks
 *
 * Hero images (frontmatter `heroImage`) are handled separately via
 * Astro's `<Image />` component in Card.astro and the post detail page.
 * This plugin focuses on inline images inside article body text.
 */
export default function rehypeOptimizeImages() {
  return (tree: any) => {
    const visit = (node: any) => {
      if (node.tagName === "img") {
        const props = node.properties || {};

        if (!props.alt) {
          props.alt = "";
        }

        props.loading = "lazy";
        props.decoding = "async";

        const existingClass = props.className || "";
        props.className = `content-image ${existingClass}`.trim();

        node.properties = props;
      }

      if (node.children) {
        node.children.forEach(visit);
      }
    };

    visit(tree);
  };
}