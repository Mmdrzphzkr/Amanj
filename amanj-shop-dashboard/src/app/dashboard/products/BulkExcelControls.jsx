"use client";

import { useState } from "react";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import * as XLSX from "xlsx";

// Helper to flatten product to a simple object for Excel
function flattenProduct(p) {
  const attrs = p.attributes || p;
  return {
    id: p.id ?? p.documentId ?? attrs?.id,
    title: attrs?.title || attrs?.name || p.name || "",
    slug: attrs?.slug || p.slug || "",
    price: attrs?.price ?? p.price ?? "",
    stock: attrs?.stock ?? p.stock ?? attrs?.stock ?? "",
    sku: attrs?.sku || "",
    description: attrs?.description || attrs?.short_description || "",
    category: attrs?.category?.data?.attributes?.name || attrs?.category || "",
  };
}

export default function BulkExcelControls({ products = [] }) {
  const [message, setMessage] = useState(null);

  const handleExport = () => {
    try {
      const rows = products.map(flattenProduct);
      const ws = XLSX.utils.json_to_sheet(rows);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Products");
      XLSX.writeFile(wb, "products.xlsx");
      setMessage({ type: "success", text: "خروجی اکسل ایجاد شد." });
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "خطا در ساخت اکسل" });
    }
  };

  const handleFile = async (e) => {
    setMessage(null);
    const file = e.target.files[0];
    if (!file) return;

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const sheetName = workbook.SheetNames[0];
      const rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

      if (!rows || rows.length === 0) {
        setMessage({ type: "error", text: "فایل خالی است" });
        return;
      }

      // Map products by id or slug for quick lookup
      const byId = new Map();
      const bySlug = new Map();
      products.forEach((p) => {
        const attrs = p.attributes || p;
        const id = p.id ?? p.documentId ?? attrs?.id;
        const slug = attrs?.slug || p.slug || attrs?.name || p.name;
        if (id) byId.set(String(id), p);
        if (slug) bySlug.set(String(slug), p);
      });

      const results = [];

      for (const row of rows) {
        // Expecting an 'id' column ideally; fall back to slug/title
        const idRaw = row.id ?? row.ID ?? row.documentId ?? row._id;
        let product = null;
        let id = null;
        if (idRaw) {
          id = String(idRaw);
          product = byId.get(id);
        } else if (row.slug) {
          product = bySlug.get(String(row.slug));
          id = product ? product.id ?? product.documentId ?? product.attributes?.id : null;
        } else if (row.title || row.name) {
          product = bySlug.get(String(row.title)) || bySlug.get(String(row.name));
          id = product ? product.id ?? product.documentId ?? product.attributes?.id : null;
        }

        if (!id || !product) {
          results.push({ row, status: "skipped", reason: "No matching product id/slug" });
          continue;
        }

        // Build attributes to update from row (exclude id)
        const updateAttrs = { ...row };
        delete updateAttrs.id;
        delete updateAttrs.ID;
        delete updateAttrs.documentId;
        delete updateAttrs._id;

        // Send PUT to dashboard API which proxies to Strapi (requires auth cookie)
        try {
          const res = await fetch(`/api/products/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ data: updateAttrs }),
          });
          const json = await res.json();
          if (!res.ok) {
            results.push({ row, status: "error", reason: json?.error || JSON.stringify(json) });
          } else {
            results.push({ row, status: "updated" });
          }
        } catch (err) {
          results.push({ row, status: "error", reason: String(err) });
        }
      }

      const updated = results.filter((r) => r.status === "updated").length;
      const skipped = results.filter((r) => r.status === "skipped").length;
      const failed = results.filter((r) => r.status === "error").length;

      setMessage({ type: "success", text: `انجام شد — بروز شد: ${updated}, نادیده گرفته شده: ${skipped}, خطا: ${failed}` });
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "خطا در خواندن فایل اکسل" });
    }
  };

  return (
    <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
      <Button variant="contained" color="primary" onClick={handleExport}>
        خروجی اکسل
      </Button>

      <label style={{ display: "inline-block" }}>
        <input type="file" accept=".xlsx,.xls,.csv" onChange={handleFile} style={{ display: "none" }} />
        <Button variant="outlined">آپلود اکسل برای به‌روزرسانی</Button>
      </label>

      {message && (
        <div style={{ minWidth: 260 }}>
          <Alert severity={message.type === "error" ? "error" : "success"}>{message.text}</Alert>
        </div>
      )}
    </div>
  );
}
