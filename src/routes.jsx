import { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import Layout from "./pages/Layout";
import SuspenseFallback from "./components/SuspenseFallback";
import ErrorPage from "./pages/ErrorPage";

// Lazy load all page components for code splitting
const HomePage = lazy(() => import("./pages/HomePage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const PlansPage = lazy(() => import("./pages/PlansPage"));
const CoachPage = lazy(() => import("./pages/CoachPage"));
const CoachLandingPage = lazy(() => import("./pages/CoachLandingPage"));
const CoachDetailPage = lazy(() => import("./pages/CoachDetailPage"));
const FindMyCoachPage = lazy(() => import("./pages/FindMyCoachPage"));
const SurveyPage = lazy(() => import("./pages/SurveyPage"));
const PrivacyPolicyPage = lazy(() => import("./pages/PrivacyPolicyPage"));
const TermsConditionsPage = lazy(() => import("./pages/TermsConditionsPage"));
const RefundPolicyPage = lazy(() => import("./pages/RefundPolicyPage"));
const PaymentCallbackPage = lazy(() => import("./pages/PaymentCallbackPage"));
const CouplePaymentPage = lazy(() => import("./pages/CouplePaymentPage"));

const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        errorElement: <ErrorPage />,
        children: [
            { path: "/start/:coachName", element: <Suspense fallback={<SuspenseFallback />}><CoachLandingPage /></Suspense> },
            { path: "/plans", element: <Suspense fallback={<SuspenseFallback />}><PlansPage /></Suspense> },
            { path: "/payment/couple", element: <Suspense fallback={<SuspenseFallback />}><CouplePaymentPage /></Suspense> },
            {
                index: true, 
                element: (
                    <Suspense fallback={<SuspenseFallback />}>
                        <HomePage />
                    </Suspense>
                )
            },
            {
                path: "/about", 
                element: (
                    <Suspense fallback={<SuspenseFallback />}>
                        <AboutPage />
                    </Suspense>
                )
            },
            {
                path: "/coaches", 
                element: (
                    <Suspense fallback={<SuspenseFallback />}>
                        <CoachPage />
                    </Suspense>
                )
            },
            {
                path: "/coaches/:coachName",
                element: (
                    <Suspense fallback={<SuspenseFallback />}>
                        <CoachDetailPage />
                    </Suspense>
                )
            },
            {
                path: "/findmycoach",
                element: (
                    <Suspense fallback={<SuspenseFallback />}>
                        <FindMyCoachPage />
                    </Suspense>
                )
            },
            {
                path: "/survey", 
                element: (
                    <Suspense fallback={<SuspenseFallback />}>
                        <SurveyPage />
                    </Suspense>
                )
            },
            {
                path: "/privacy-policy", 
                element: (
                    <Suspense fallback={<SuspenseFallback />}>
                        <PrivacyPolicyPage />
                    </Suspense>
                )
            },
            {
                path: "/terms-conditions", 
                element: (
                    <Suspense fallback={<SuspenseFallback />}>
                        <TermsConditionsPage />
                    </Suspense>
                )
            },
            {
                path: "/refund-policy", 
                element: (
                    <Suspense fallback={<SuspenseFallback />}>
                        <RefundPolicyPage />
                    </Suspense>
                )
            },
            {
                path: "/payment/callback", 
                element: (
                    <Suspense fallback={<SuspenseFallback />}>
                        <PaymentCallbackPage />
                    </Suspense>
                )
            },
        ]
    }
])

export default router
