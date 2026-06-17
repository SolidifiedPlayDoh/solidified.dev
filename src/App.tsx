import { BrowserRouter, Route, Routes } from "react-router-dom";

import { HomePage } from "./components/HomePage";
import { SiteShell } from "./components/SiteShell";
import { FemtanylOBSPage } from "./pages/FemtanylOBSPage";
import { HiPage } from "./pages/HiPage";
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

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/femtanylFNF/obs" element={<FemtanylOBSPage />} />
        <Route path="/hi" element={<HiPage />} />
        <Route path="/wow" element={<WowPage />} />
        <Route path="/store/stillweb" element={<StillwebPage />} />
        <Route path="/store" element={<StorePage />} />
        {projects.map((project) => (
          <Route
            key={project.path}
            path={project.path}
            element={<project.Component />}
          />
        ))}
        <Route path="*" element={<PortfolioHome />} />
      </Routes>
    </BrowserRouter>
  );
}
