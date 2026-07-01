// src/helpers/authHelper
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Loading from '@/components/Loading/Loading';
import { usePathname } from "next/navigation";

export default function ProtectedRoute({ children, allowedRoles = [] }) {
    const { user, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const loginUrl = `/login?callbackurl=${pathname}`;
    useEffect(() => {
        if (loading) return;

        if (!user) {
            router.replace(loginUrl);
            return;
        }

        const roleType = user?.role?.type;

        if (allowedRoles.length > 0 && !allowedRoles.includes(roleType)) {
            router.replace("/403"); // یا /403
        }
    }, [user, loading, router, allowedRoles]);

    if (loading) return <Loading />;

    return children;
}
