"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";

export default function MePage() {
    const { data: session, status } = useSession();

    useEffect(() => {
        console.log("[client] useSession →", { status, session });
    }, [status, session]);

    return (
        <div className="neon-card rounded-2xl p-6">
            <h2 className="text-lg font-semibold mb-2">My Session</h2>
            <p className="text-sm bm-2">status: {status}</p>
            {/* <pre className="text-xs">{JSON.stringify(session, null, 2)}</pre> */}
        </div>
    );
}