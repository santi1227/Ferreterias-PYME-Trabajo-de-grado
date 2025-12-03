"use client";
import { useEffect, useState } from "react";
 
export default function useUser() {
    const [user, setUser] = useState(null);
    useEffect(() => {
        fetch("/api/auth/getUserCookie")
            .then((res) => res.json())
            .then((data) => {
                if (data.userName) {
                    setUser(data)
                } else { setUser(null) };
            })
            .catch(() => setUser(null));
    }, []);
    return user;
}