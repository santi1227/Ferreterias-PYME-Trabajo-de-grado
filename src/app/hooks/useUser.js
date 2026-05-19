"use client";

import { useEffect, useState } from "react";

export default function useUser() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const getUser = async () => {
            try {
                const res = await fetch("/api/auth/getUserCookie");

                // Token expirado o inválido
                if (res.status === 401) {
                    document.cookie = "token=; Max-Age=0; path=/";
                    window.location.href = "/login";
                    return;
                }

                const data = await res.json();

                if (data.userName) {
                    setUser(data);
                } else {
                    setUser(null);
                }
            } catch (error) {
                setUser(null);
                window.location.href = "/login";
            }
        };

        getUser();
    }, []);

    return user;
}