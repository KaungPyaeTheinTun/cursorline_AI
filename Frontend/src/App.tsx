import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import ToastContainer from "./components/ui/ToastContainer";
import { useAuthStore } from "./stores/authStore";
import Navbar from "./components/layout/Navbar";
import Hero from "./components/sections/Hero";
import StackStrip from "./components/sections/StackStrip";
import Features from "./components/sections/Features";
import HowItWorks from "./components/sections/HowItWorks";
import CodeDemo from "./components/sections/CodeDemo";
import Testimonials from "./components/sections/Testimonials";
import Pricing from "./components/sections/Pricing";
import FAQ from "./components/sections/FAQ";
import FinalCTA from "./components/sections/FinalCTA";
import Footer from "./components/layout/Footer";
import ChatWidget from "./components/chat/ChatWidget";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import VerifyCodePage from "./pages/VerifyCodePage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import PaymentSuccessPage from "./pages/PaymentSuccessPage";
import PaymentCancelPage from "./pages/PaymentCancelPage";
import OAuthCallbackPage from "./pages/OAuthCallbackPage";
import RoadMapPage from "./pages/RoadMapPage";
import BlogPage from "./pages/BlogPage";
import DocsPage from "./pages/DocsPage";
import ChangeLogPage from "./pages/ChangeLogPage";
import CommunityPage from "./pages/CommunityPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import BuildPage from "./pages/BuildPage";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import AdminRoute from "./components/admin/AdminRoute";
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminFaqPage from "./pages/admin/AdminFaqPage";
import AdminPlanPage from "./pages/admin/AdminPlanPage";
import AdminProfilePage from "./pages/admin/AdminProfilePage";
import NotFoundPage from "./pages/NotFoundPage";

function LandingPage() {
  return (
    <>
      <Hero />
      <StackStrip />
      <Features />
      <HowItWorks />
      <CodeDemo />
      <Testimonials />
      <Pricing />
      <FAQ />
      <FinalCTA />
    </>
  );
}

const NO_FOOTER_ROUTES = ["/build"];

function AppLayout() {
  const { pathname } = useLocation();
  const hideFooter = NO_FOOTER_ROUTES.includes(pathname);

  return (
    <div className="min-h-screen bg-bg text-ink">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/verify-code" element={<VerifyCodePage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/build" element={<ProtectedRoute><BuildPage /></ProtectedRoute>} />
          <Route path="/payment/success" element={<PaymentSuccessPage />} />
          <Route path="/payment/cancel" element={<PaymentCancelPage />} />
          <Route path="/auth/callback" element={<OAuthCallbackPage />} />
          <Route path="/roadmap" element={<RoadMapPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/docs" element={<DocsPage />} />
          <Route path="/changelog" element={<ChangeLogPage />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      {!hideFooter && <Footer />}
      {!hideFooter && <ChatWidget />}
    </div>
  );
}

function AdminLayout_() {
  return (
    <AdminRoute>
      <AdminLayout />
    </AdminRoute>
  );
}

function AuthInit() {
  const init = useAuthStore((s) => s.init);
  useEffect(() => { init(); }, [init]);
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthInit />
      <ToastContainer />
      <Routes>
        <Route path="/admin/*" element={<AdminLayout_ />}>
          <Route index element={<AdminDashboardPage />} />
          <Route path="faqs" element={<AdminFaqPage />} />
          <Route path="plans" element={<AdminPlanPage />} />
          <Route path="profile" element={<AdminProfilePage />} />
        </Route>
        <Route path="*" element={<AppLayout />} />
      </Routes>
    </BrowserRouter>
  );
}
