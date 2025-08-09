"use client";
import React, { useEffect, useState } from "react";
import { paperService } from "../../services";
import { useSession } from "next-auth/react";

export default function AllPaperSetsPage() {
  const { status } = useSession();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status !== "authenticated") return;
    setLoading(true);
    // Using getAll with a simple searchUrl similar to courses
    paperService.getAll("isPublished/20/0").then((res) => setItems(res.data || [])).finally(() => setLoading(false));
  }, [status]);

  if (status !== "authenticated") return <div>Please login</div>;
  if (loading) return <div>Loading...</div>;
  return (
    <div className="container py-4">
      <h2>All Paper Sets</h2>
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Published</th>
              <th>Papers</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it) => (
              <tr key={it._id}>
                <td>{it.setTitle}</td>
                <td>{it.isPublished ? "Yes" : "No"}</td>
                <td>{it.papers?.length || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}





