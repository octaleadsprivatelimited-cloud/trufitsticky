import { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import Layout from "./pages/Layout";
import HomePage from "./pages/HomePage";
import LegacyCoachLanding from "./pages/LegacyCoachLanding";
import CoachLandingIndex from "./pages/CoachLandingIndex";
import ErrorPage from "./pages/ErrorPage";

// Lazy load all page components for code splitting

const CoachWorkspacePage = lazy(() => import("./pages/CoachWorkspacePage"));
const TeamPanelPage = lazy(() => import("./pages/TeamPanelPage"));
const SignInPage = lazy(() => import("./pages/SignInPage"));
const BlogPage = lazy(() => import("./pages/BlogPage"));
const BmiCalculatorPage = lazy(() => import("./pages/BmiCalculatorPage"));
const CalorieCalculatorPage = lazy(() => import("./pages/CalorieCalculatorPage"));
const BlogPostPage = lazy(() => import("./pages/BlogPostPage"));
const CoachPage = lazy(() => import("./pages/CoachPage"));
const CoachLandingPage = lazy(() => import("./pages/CoachLandingPage"));
const CoachDetailPage = lazy(() => import("./pages/CoachDetailPage"));
const FindMyCoachPage = lazy(() => import("./pages/FindMyCoachPage"));
const SurveyPage = lazy(() => import("./pages/SurveyPage"));
const PrivacyPolicyPage = lazy(() => import("./pages/PrivacyPolicyPage"));
const TermsConditionsPage = lazy(() => import("./pages/TermsConditionsPage"));
const RefundPolicyPage = lazy(() => import("./pages/RefundPolicyPage"));
const PaymentCallbackPage = lazy(() => import("./pages/PaymentCallbackPage"));
const PaymentSuccessPage = lazy(() => import("./pages/PaymentSuccessPage"));
const CouplePaymentPage = lazy(() => import("./pages/CouplePaymentPage"));
const CustomerPortalPage = lazy(() => import("./pages/CustomerPortalPage"));
const ReferralPage = lazy(() => import("./pages/ReferralPage"));

const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        errorElement: <ErrorPage />,
        children: [
            { path: "/team", element: <Suspense fallback={null}><TeamPanelPage /></Suspense> },
            { path: "/team/customers", element: <Suspense fallback={null}><TeamPanelPage /></Suspense> },
            { path: "/team/coaches", element: <Suspense fallback={null}><TeamPanelPage /></Suspense> },
            { path: "/team/blog", element: <Suspense fallback={null}><TeamPanelPage /></Suspense> },
            { path: "/team/blog/new", element: <Suspense fallback={null}><TeamPanelPage /></Suspense> },
            { path: "/team/blog/:postId/edit", element: <Suspense fallback={null}><TeamPanelPage /></Suspense> },
            { path: "/coach", element: <Suspense fallback={null}><CoachWorkspacePage /></Suspense> },
            { path: "/coach/:coachSlug", element: <Suspense fallback={null}><CoachWorkspacePage /></Suspense> },
            { path: "/coach/:coachSlug/customers", element: <Suspense fallback={null}><CoachWorkspacePage /></Suspense> },
            { path: "/coach/:coachSlug/customers/:customerId", element: <Suspense fallback={null}><CoachWorkspacePage /></Suspense> },
            { path: "/team/products", element: <Suspense fallback={null}><TeamPanelPage /></Suspense> },
            { path: "/team/customers/:customerId", element: <Suspense fallback={null}><TeamPanelPage /></Suspense> },
            { path: "/signin", element: <Suspense fallback={null}><SignInPage /></Suspense> },
            { path: "/signup", element: <Suspense fallback={null}><SignInPage /></Suspense> },
            { path: "/start", element: <CoachLandingIndex/> },
            { path: "/start/:coachName", element: <LegacyCoachLanding /> },
            { path: "/lp/:coachName", element: <Suspense fallback={null}><CoachLandingPage /></Suspense> },
            { path: "/plans", element: <Navigate to="/coaches" replace/> },
            { path: "/payment/couple", element: <Suspense fallback={null}><CouplePaymentPage /></Suspense> },
            { path: "/payment/success", element: <Suspense fallback={null}><PaymentSuccessPage /></Suspense> },
            { path: "/portal/:section?", element: <Suspense fallback={null}><CustomerPortalPage /></Suspense> },
            { path: "/refer/:code", element: <Suspense fallback={null}><ReferralPage /></Suspense> },
            {
                index: true, 
                element: (
                    <Suspense fallback={null}>
                        <HomePage />
                    </Suspense>
                )
            },
            { path: "/about", element: <Navigate to="/blog" replace/> },
            { path: "/blog", element: <Suspense fallback={null}><BlogPage /></Suspense> },
            { path: "/bmi-calculator", element: <Suspense fallback={null}><BmiCalculatorPage /></Suspense> },
            { path: "/calorie-calculator", element: <Suspense fallback={null}><CalorieCalculatorPage /></Suspense> },
            { path: "/blog/:slug", element: <Suspense fallback={null}><BlogPostPage /></Suspense> },
            {
                path: "/coaches", 
                element: (
                    <Suspense fallback={null}>
                        <CoachPage />
                    </Suspense>
                )
            },
            {
                path: "/coaches/:coachName",
                element: (
                    <Suspense fallback={null}>
                        <CoachDetailPage />
                    </Suspense>
                )
            },
            {
                path: "/findmycoach",
                element: (
                    <Suspense fallback={null}>
                        <FindMyCoachPage />
                    </Suspense>
                )
            },
            {
                path: "/survey", 
                element: (
                    <Suspense fallback={null}>
                        <SurveyPage />
                    </Suspense>
                )
            },
            {
                path: "/privacy-policy", 
                element: (
                    <Suspense fallback={null}>
                        <PrivacyPolicyPage />
                    </Suspense>
                )
            },
            {
                path: "/terms-conditions", 
                element: (
                    <Suspense fallback={null}>
                        <TermsConditionsPage />
                    </Suspense>
                )
            },
            {
                path: "/refund-policy", 
                element: (
                    <Suspense fallback={null}>
                        <RefundPolicyPage />
                    </Suspense>
                )
            },
            {
                path: "/payment/callback", 
                element: (
                    <Suspense fallback={null}>
                        <PaymentCallbackPage />
                    </Suspense>
                )
            },
        ]
    }
])

export default router
