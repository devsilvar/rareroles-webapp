import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SiteNav } from "./components/site-nav";
import { SiteFooter } from "./components/site-footer";
import { ScrollToTop } from "./components/scroll-to-top";
import { WhatsAppButton } from "./components/whatsapp-button";
import { GetStartedProvider } from "./components/get-started-modal";
import HomePage from "./pages/Home";
import AboutPage from "./pages/About";
import TalentPage from "./pages/Talent";
import CompaniesPage from "./pages/Companies";
import ContactPage from "./pages/Contact";
import NotFoundPage from "./pages/NotFound";

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <GetStartedProvider>
        <div className="flex min-h-screen flex-col bg-background">
          <SiteNav />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/talent" element={<TalentPage />} />
              <Route path="/companies" element={<CompaniesPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <SiteFooter />
          <WhatsAppButton />
        </div>
      </GetStartedProvider>
    </BrowserRouter>
  );
}

export default App;
