import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SiteNav } from "./components/site-nav";
import { SiteFooter } from "./components/site-footer";
import { ScrollToTop } from "./components/scroll-to-top";
import { WhatsAppButton } from "./components/whatsapp-button";
import { GetStartedProvider } from "./components/get-started-modal";
import ProtectedRoute from "./components/ProtectedRoute";
import HomePage from "./pages/Home";
import AboutPage from "./pages/About";
import TalentPage from "./pages/Talent";
import CompaniesPage from "./pages/Companies";
import ContactPage from "./pages/Contact";
import NotFoundPage from "./pages/NotFound";
import AdminLogin from "./pages/AdminLogin";
import AdminRegister from "./pages/AdminRegister";
import OverviewPage from "./pages/admin/OverviewPage";
import HiringPage from "./pages/admin/HiringPage";
import TalentAdminPage from "./pages/admin/TalentPage";
import ContactAdminPage from "./pages/admin/ContactPage";
import SubmissionsPage from "./pages/admin/SubmissionsPage";
import VisitorsPage from "./pages/admin/VisitorsPage";
import AnalyticsPage from "./pages/admin/AnalyticsPage";

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <GetStartedProvider>
        <Routes>
          {/* Admin Routes - No nav/footer */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/register" element={<AdminRegister />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <OverviewPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/overview"
            element={
              <ProtectedRoute>
                <OverviewPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/submissions"
            element={
              <ProtectedRoute>
                <SubmissionsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/visitors"
            element={
              <ProtectedRoute>
                <VisitorsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/analytics"
            element={
              <ProtectedRoute>
                <AnalyticsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/hiring"
            element={
              <ProtectedRoute>
                <HiringPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/talent"
            element={
              <ProtectedRoute>
                <TalentAdminPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/contact"
            element={
              <ProtectedRoute>
                <ContactAdminPage />
              </ProtectedRoute>
            }
          />

          {/* Public Routes - With nav/footer */}
          <Route
            path="/*"
            element={
              <div className="flex min-h-screen flex-col bg-background">
                <SiteNav />
                <main className="flex-1">
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/about" element={<AboutPage />} />
                    {/* Talent / Why Choose Us - both routes work */}
                    <Route path="/talent" element={<TalentPage />} />
                    <Route path="/why-choose-us" element={<TalentPage />} />
                    {/* Companies / Services - both routes work */}
                    <Route path="/companies" element={<CompaniesPage />} />
                    <Route path="/services" element={<CompaniesPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="*" element={<NotFoundPage />} />
                  </Routes>
                </main>
                <SiteFooter />
                <WhatsAppButton />
              </div>
            }
          />
        </Routes>
      </GetStartedProvider>
    </BrowserRouter>
  );
}

export default App;
