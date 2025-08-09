"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { paperService } from "../../../services";

export default function PaperPurchaseReportPage() {
  const { status } = useSession();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState({});

  const load = () => {
    setLoading(true);
    paperService.adminListPurchases(filter).then((res) => setItems(res.data || [])).finally(() => setLoading(false));
  };

  useEffect(() => {
    if (status === "authenticated") load();
  }, [status]);

  const updateFlag = async (id, patch) => {
    await paperService.adminUpdateProcess(id, patch);
    load();
  };

  const notify = async (id) => {
    await paperService.adminNotifyParent(id);
    alert("Email sent");
  };

  if (status !== "authenticated") return <div>Please login</div>;
  if (loading) return <div>Loading...</div>;
  return (
    <div className="container py-4">
      <h2>Paper Purchases</h2>
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th>Set</th>
              <th>User</th>
              <th>Child</th>
              <th>Status</th>
              <th>Invoice</th>
              <th>Flags</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it) => (
              <tr key={it._id}>
                <td>{it.paperSetId?.setTitle}</td>
                <td>{it.user?.firstName} {it.user?.lastName}</td>
                <td>{it.childId?.childName}</td>
                <td>{it.status}</td>
                <td>{it.invoiceNumber || '-'}</td>
                <td>
                  <div className="form-check">
                    <input type="checkbox" className="form-check-input" checked={!!it.processStatus?.paperSentToUser} onChange={(e) => updateFlag(it._id, { paperSentToUser: e.target.checked, paperSentAt: e.target.checked ? new Date() : null })} id={`s-${it._id}`} />
                    <label className="form-check-label" htmlFor={`s-${it._id}`}>Sent</label>
                  </div>
                  <div className="form-check">
                    <input type="checkbox" className="form-check-input" checked={!!it.processStatus?.paperReceivedFromParent} onChange={(e) => updateFlag(it._id, { paperReceivedFromParent: e.target.checked, paperReceivedAt: e.target.checked ? new Date() : null })} id={`r-${it._id}`} />
                    <label className="form-check-label" htmlFor={`r-${it._id}`}>Received</label>
                  </div>
                  <div className="form-check">
                    <input type="checkbox" className="form-check-input" checked={!!it.processStatus?.oneOnOneMeetingCompleted} onChange={(e) => updateFlag(it._id, { oneOnOneMeetingCompleted: e.target.checked, oneOnOneCompletedAt: e.target.checked ? new Date() : null })} id={`m-${it._id}`} />
                    <label className="form-check-label" htmlFor={`m-${it._id}`}>1:1 Done</label>
                  </div>
                </td>
                <td>
                  <button className="btn btn-sm btn-outline-primary" onClick={() => notify(it._id)}>Notify</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}





