import { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import Layout from "./pages/Layout";
import HomePage from "./pages/HomePage";
import CoachLandingIndex from "./pages/CoachLandingIndex";
import ErrorPage from "./pages/ErrorPage";

// Lazy load all page components for code splitting

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
            { path: "/start", element: <CoachLandingIndex/> },
            { path: "/start/:coachName", element: <Suspense fallback={null}><CoachLandingPage /></Suspense> },
            { path: "/plans", element: <Suspense fallback={null}><PlansPage /></Suspense> },
            { path: "/payment/couple", element: <Suspense fallback={null}><CouplePaymentPage /></Suspense> },
            {
                index: true, 
                element: (
                    <Suspense fallback={null}>
                        <HomePage />
                    </Suspense>
                )
            },
            {
                path: "/about", 
                element: (
                    <Suspense fallback={null}>
                        <AboutPage />
                    </Suspense>
                )
            },
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
