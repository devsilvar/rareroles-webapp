import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SiteNav } from "./components/site-nav";
import { SiteFooter } from "./components/site-footer";
import { ScrollToTop } from "./components/scroll-to-top";
import { RouteTransitionBar } from "./components/route-transition-bar";
import { WhatsAppButton } from "./components/whatsapp-button";
import { GetStartedProvider } from "./components/get-started-modal";
import ProtectedRoute from "./components/ProtectedRoute";
import { Toaster } from "./components/ui/sonner";
import MarketingScriptsProvider from "./components/MarketingScriptsProvider";
import { prefetchCoreRoutesOnIdle } from "./lib/route-prefetch";

// Lazy load all pages for code splitting
const HomePage = lazy(() => import("./pages/Home"));
const AboutPage = lazy(() => import("./pages/About"));
const TalentPage = lazy(() => import("./pages/Talent"));
const CompaniesPage = lazy(() => import("./pages/Companies"));
const ContactPage = lazy(() => import("./pages/Contact"));
const NotFoundPage = lazy(() => import("./pages/NotFound"));

// Admin pages - code split separately
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const AdminResetPassword = lazy(() => import("./pages/AdminResetPassword"));
const OverviewPage = lazy(() => import("./pages/admin/OverviewPage"));
const HiringPage = lazy(() => import("./pages/admin/HiringPage"));
const TalentAdminPage = lazy(() => import("./pages/admin/TalentPage"));
const ContactAdminPage = lazy(() => import("./pages/admin/ContactPage"));
const SubmissionsPage = lazy(() => import("./pages/admin/SubmissionsPage"));
const VisitorsPage = lazy(() => import("./pages/admin/VisitorsPage"));
const AnalyticsPage = lazy(() => import("./pages/admin/AnalyticsPage"));
const MarketingScriptsPage = lazy(() => import("./pages/admin/MarketingScriptsPage"));
const ChangePasswordPage = lazy(() => import("./pages/admin/ChangePasswordPage"));

// Loading fallback component
function PageLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent" />
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}

function App() {
  useEffect(() => {
    prefetchCoreRoutesOnIdle();
  }, []);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <RouteTransitionBar />
      <Toaster richColors position="top-right" />
      <GetStartedProvider>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Admin Routes - No nav/footer */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/reset-password" element={<AdminResetPassword />} />
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
            <Route
              path="/admin/marketing"
              element={
                <ProtectedRoute>
                  <MarketingScriptsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/change-password"
              element={
                <ProtectedRoute>
                  <ChangePasswordPage />
                </ProtectedRoute>
              }
            />

            {/* Public Routes - With nav/footer */}
            <Route
              path="/*"
              element={
                <div className="flex min-h-screen flex-col bg-background">
                  {/* Public pages only — never on /admin (see provider) */}
                  <MarketingScriptsProvider />
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
        </Suspense>
      </GetStartedProvider>
    </BrowserRouter>
  );
}

export default App;
