import { BrowserRouter, Navigate, Route, Routes, useParams } from "react-router-dom";

import { HomePage } from "./components/HomePage";
import { SiteShell } from "./components/SiteShell";
import { ATypeFontPage } from "./pages/ATypeFontPage";
import { HiPage } from "./pages/HiPage";
import { MusicRedirect } from "./pages/MusicRedirect";
import { NotFoundPage } from "./pages/NotFoundPage";
import { StillwebPage } from "./pages/StillwebPage";
import { StorePage } from "./pages/StorePage";
import { WowPage } from "./pages/WowPage";
import { projects } from "./projects/registry";

function PortfolioHome() {
  return (
    <SiteShell>
      <main id="main">
        <HomePage />
      </main>
    </SiteShell>
  );
}

function LegacyATypeFontRedirect() {
  const { slug = "" } = useParams();
  return <Navigate to={`/store/atype/${slug}`} replace />;
}

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/femtanylFNF/*" element={<Navigate to="/" replace />} />
        <Route path="/" element={<PortfolioHome />} />
        <Route path="/hi" element={<HiPage />} />
        <Route path="/wow" element={<WowPage />} />
        <Route path="/store/stillweb" element={<StillwebPage />} />
        <Route path="/store/atype/:slug" element={<ATypeFontPage />} />
        <Route path="/store" element={<StorePage />} />
        <Route path="/atype/:slug" element={<LegacyATypeFontRedirect />} />
        <Route path="/music" element={<MusicRedirect />} />
        {projects.map((project) =>
          project.Component ? (
            <Route
              key={project.path}
              path={project.path}
              element={<project.Component />}
            />
          ) : null,
        )}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
