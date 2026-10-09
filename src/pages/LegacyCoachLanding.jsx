import { Navigate, useLocation, useParams } from "react-router-dom";

export default function LegacyCoachLanding() {
    const { coachName } = useParams();
    const { search, hash } = useLocation();
    return <Navigate to={`/lp/${encodeURIComponent(coachName)}${search}${hash}`} replace />;
}

