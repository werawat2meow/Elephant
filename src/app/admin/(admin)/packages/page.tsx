"use client";
import { useEffect, useState } from "react";
import AdminPackageForm from "./AdminPackageForm";

export default function AdminPackages() {
  const [packages, setPackages] = useState<any[]>([]);
  const [selected, setSelected] = useState<any | null>(null);

  async function load() {
    const res = await fetch("/api/packages");
    const j = await res.json();
    if (j?.ok) setPackages(j.data || []);
  }

  useEffect(() => {
    load();
  }, []);

  async function remove(id: string) {
    if (!confirm("Delete this package?")) return;
    await fetch("/api/admin/packages", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setSelected(null);
    await load();
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Manage Tour Packages</h1>
      <p className="mb-6">Here you can add, edit, or delete tour packages.</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-1">
          <div className="bg-white rounded shadow p-4 max-h-[70vh] overflow-auto">
            <h3 className="font-semibold mb-2">Existing packages</h3>
            <div className="space-y-3">
              {packages.length === 0 && (
                <p className="text-sm text-gray-500">No packages yet.</p>
              )}
              {packages.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between p-2 border rounded"
                >
                  <div
                    className="cursor-pointer"
                    onClick={() => setSelected(p)}
                  >
                    <div className="font-medium">{p.title}</div>
                    <div className="text-xs text-gray-500">
                      {p.duration} • ฿
                      {Number(p.priceAdult || 0).toLocaleString()}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      className="text-sm text-red-600"
                      onClick={() => remove(p.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-span-1 lg:col-span-2">
          <div className="bg-white rounded shadow p-6">
            <AdminPackageForm initialData={selected} onSaved={load} />
          </div>
        </div>
      </div>
    </div>
  );
}
