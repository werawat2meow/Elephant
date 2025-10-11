"use client";

import { useEffect, useState } from "react";

export type Approver = {
    id: string;
    empNo: string;
    name: string;
    dept?: string;
    level?: string;
};

export default function ApproverListModal({
    open,
    onClose,
    approvers,
    onSelect,
}: {
    open: boolean;
    onClose: () => void;
    approvers: Approver[];
    onSelect?: (p: Approver) => void;
}) {
    const [q, setQ] = useState("");

    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open, onClose]);
    
    if (!open) return null;
    
    const list = approvers.filter(a =>
        [a.empNo, a.name, a.dept ?? "", a.level ?? ""]
    .join(" ")
    .toLowerCase()
    .includes(q.toLowerCase())
    );
    
}