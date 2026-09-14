import { Link, useLocation } from "react-router-dom";

import "./Breadcrumbs.css";

export type Crumb = {
  label: string;
  to: string;
};

export function buildCrumbs(pathname: string, search = ""): Crumb[] {
  const crumbs: Crumb[] = [{ label: "home", to: "/" }];
  const segments = pathname.replace(/\/$/, "").split("/").filter(Boolean);
  let path = "";

  for (const segment of segments) {
    path += `/${segment}`;
    crumbs.push({
      label: decodeURIComponent(segment),
      to: path,
    });
  }

  const tag = new URLSearchParams(search).get("tag");
  if (tag && segments[0] === "store") {
    crumbs.push({
      label: tag,
      to: `/store?tag=${encodeURIComponent(tag)}`,
    });
  }

  return crumbs;
}

export function Breadcrumbs() {
  const { pathname, search } = useLocation();
  const crumbs = buildCrumbs(pathname, search);

  if (crumbs.length < 2) return null;

  return (
    <div className="crumbs-bar">
      <nav className="crumbs" aria-label="Breadcrumb">
        <ol className="crumbs__list">
          {crumbs.map((crumb, index) => {
            const last = index === crumbs.length - 1;
            return (
              <li key={`${crumb.to}:${crumb.label}`} className="crumbs__item">
                {index > 0 ? (
                  <span className="crumbs__sep" aria-hidden>
                    {">"}
                  </span>
                ) : null}
                <Link to={crumb.to} aria-current={last ? "page" : undefined}>
                  {crumb.label}
                </Link>
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
}
