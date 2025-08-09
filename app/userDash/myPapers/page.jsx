"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { paperService } from "../../services";

export default function MyPapersPage() {
  const { data: session, status } = useSession();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status !== "authenticated") return;
    setLoading(true);
    paperService.getMine()
      .then((res) => setItems(res.data || []))
      .finally(() => setLoading(false));
  }, [status]);

  if (status !== "authenticated") return <div>Please login</div>;
  if (loading) return <div>Loading...</div>;
  if (!items.length) return <div className="container py-4">No purchases yet.</div>;

  return (
    <div className="container py-4">
      <h2>My Papers</h2>
      <div className="list-group">
        {items.map((bp) => (
          <div className="list-group-item" key={bp._id}>
            <div className="d-flex justify-content-between">
              <div>
                <div className="fw-bold">{bp.paperSetId?.setTitle}</div>
                <div>Status: {bp.status} {bp.invoiceNumber ? `(Invoice: ${bp.invoiceNumber})` : ''}</div>
                <div>Child: {bp.childId?.childName}</div>
                <div>Papers: {(bp.selectedPapers || []).map(p => p.title).join(", ")}</div>
              </div>
              <div className="text-end">
                <div>Amount: £{Number(bp.amount).toFixed(2)}</div>
                <a className="btn btn-link" href={`/paper/buy/${bp.paperSetId?._id}`}>Buy more</a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}





