import { useEffect, type ReactNode } from "react";

type SiteShellProps = {
  children: ReactNode;
};

export function SiteShell({ children }: SiteShellProps) {
  useEffect(() => {
    document.body.classList.add("phase-site");
    return () => document.body.classList.remove("phase-site");
  }, []);

  return (
    <>
      <a className="skip-to-main" href="#main">
        Skip to content
      </a>
      {children}
    </>
  );
}
