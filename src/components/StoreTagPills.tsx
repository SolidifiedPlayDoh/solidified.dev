import { Link } from "react-router-dom";

type StoreTagPillsProps = {
  tags: string[];
  activeTag?: string | null;
  compact?: boolean;
};

export function StoreTagPills({
  tags,
  activeTag,
  compact = false,
}: StoreTagPillsProps) {
  return (
    <ul
      className={`store-tag-pills${compact ? " store-tag-pills--compact" : ""}`}
      aria-label="Product categories"
    >
      {tags.map((tag) => (
        <li key={tag}>
          <Link
            to={`/store?tag=${encodeURIComponent(tag)}`}
            className={activeTag === tag ? "store-tag-pill store-tag-pill--active" : "store-tag-pill"}
            aria-current={activeTag === tag ? "page" : undefined}
          >
            #{tag}
          </Link>
        </li>
      ))}
    </ul>
  );
}
