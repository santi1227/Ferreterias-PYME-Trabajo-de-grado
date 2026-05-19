"use client";

import { useIdleLogout } from "@/app/hooks/useIdleLogout";

export default function IdleProvider({
    children,
}) {

    useIdleLogout(15 * 60 * 1000);

    return <>{children}</>;
}