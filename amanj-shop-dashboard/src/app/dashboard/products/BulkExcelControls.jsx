"use client";

import { useState } from "react";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import * as XLSX from "xlsx";

function normalizeProduct(product) {
  return product?.attributes ?? product ?? {};
}

function getRelationOne(relation) {
  if (!relation) return null;
  if (relation.data) return relation.data;
  return relation;
}

function getRelationMany(relation) {
  if (!relation) return [];
  if (Array.isArray(relation.data)) return relation.data;
  if (Array.isArray(relation)) return relation;
  return [];
}

function getMediaOne(media) {
  if (!media) return null;
  if (media.data) return media.data;
  return media;
}

function getMediaMany(media) {
  if (!media) return [];
  if (Array.isArray(media.data)) return media.data;
  if (Array.isArray(media)) return media;
  return [];
}

function relationLabel(entity) {
  const attrs = normalizeProduct(entity);
  return attrs?.name ?? attrs?.title ?? attrs?.slug ?? "";
}

function parseList(value) {
  if (value == null) return [];
  if (Array.isArray(value)) return value;
  return String(value)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseJsonCell(value) {
  if (value == null || value === "") return null;
  if (typeof value === "object") return value;
  try {
    return JSON.parse(String(value));
  } catch {
    return null;
  }
}

function toSeoObject(seoValue) {
  if (!seoValue) return {};
  if (Array.isArray(seoValue)) return seoValue[0] ?? {};
  return seoValue;
}

function toSeoArray(seoValue) {
  if (!seoValue) return [];
  if (Array.isArray(seoValue)) return seoValue;
  if (typeof seoValue === "object") return [seoValue];
  return [];
}

function findProductIdentifier(product) {
  const attrs = normalizeProduct(product);
  return String(product?.id ?? product?.documentId ?? attrs?.id ?? "");
}

function buildProductLookup(products = []) {
  const byAnyKey = new Map();

  products.forEach((product) => {
    const attrs = normalizeProduct(product);
    const id = findProductIdentifier(product);
    const slug = attrs?.slug;
    const name = attrs?.name;

    if (id) byAnyKey.set(id.toLowerCase(), id);
    if (slug) byAnyKey.set(String(slug).toLowerCase(), id);
    if (name) byAnyKey.set(String(name).toLowerCase(), id);
  });

  return byAnyKey;
}

function resolveRelationId(input, lookupMap) {
  if (input == null || input === "") return null;
  const key = String(input).trim().toLowerCase();
  if (!key) return null;
  return lookupMap.get(key) ?? String(input).trim();
}

function toNumberIfNumeric(val) {
  if (val == null) return null;
  if (typeof val === "number") return val;
  const s = String(val).trim();
  if (/^\d+$/.test(s)) return Number(s);
  return val;
}

function buildRelationLookup(products = [], relationKey) {
  const lookup = new Map();

  products.forEach((product) => {
    const attrs = normalizeProduct(product);
    const entity = getRelationOne(attrs?.[relationKey]);
    if (!entity) return;

    const relAttrs = normalizeProduct(entity);
    const relId = String(entity?.id ?? relAttrs?.id ?? "");
    const relSlug = relAttrs?.slug;
    const relName = relAttrs?.name;

    if (relId) lookup.set(relId.toLowerCase(), relId);
    if (relSlug) lookup.set(String(relSlug).toLowerCase(), relId);
    if (relName) lookup.set(String(relName).toLowerCase(), relId);
  });

  return lookup;
}

function buildUpdateAttrs(row, product, lookups) {
  // Minimal updater: only support name, price, stock from Excel rows
  const updateAttrs = {};

  if (Object.prototype.hasOwnProperty.call(row, "name")) {
    updateAttrs.name = row.name;
  }

  if (Object.prototype.hasOwnProperty.call(row, "price")) {
    const p = Number(row.price);
    if (!Number.isNaN(p)) updateAttrs.price = p;
  }

  if (Object.prototype.hasOwnProperty.call(row, "stock")) {
    const s = Number(row.stock);
    if (!Number.isNaN(s)) updateAttrs.stock = s;
  }

  return updateAttrs;
}

// Helper to flatten product to a simple object for Excel
function flattenProduct(p) {
  const attrs = normalizeProduct(p);
  const category = getRelationOne(attrs?.category);
  const brand = getRelationOne(attrs?.brand);
  const linkedProducts = getRelationMany(attrs?.products);
  const relatedProducts = getRelationMany(attrs?.related_products);
  const thumbnail = getMediaOne(attrs?.thumbnail);
  const gallery = getMediaMany(attrs?.gallery);
  const seoArray = toSeoArray(attrs?.SEO);
  const seo = seoArray[0] ?? {};
  const seoShareImage = getMediaOne(seo?.shareImage);
  const descriptionValue = attrs?.description;
  const isDescriptionText = typeof descriptionValue === "string";

  return {
    id: p.id ?? p.documentId ?? attrs.id ?? "",
    documentId: p.documentId ?? attrs.documentId ?? "",
    name: attrs.name ?? "",
    slug: attrs.slug ?? "",
    description: isDescriptionText ? descriptionValue : "",
    description_json: isDescriptionText ? "" : JSON.stringify(descriptionValue ?? []),
    short_description: attrs.short_description ?? "",
    price: attrs.price ?? "",
    stock: attrs.stock ?? "",
    sku: attrs.sku ?? "",
    thumbnail_id: thumbnail?.id ?? "",
    thumbnail_name: normalizeProduct(thumbnail)?.name ?? "",
    gallery_ids: gallery.map((item) => item?.id).filter(Boolean).join(","),
    gallery_names: gallery.map((item) => normalizeProduct(item)?.name).filter(Boolean).join(","),
    category_id: category?.id ?? "",
    category_name: relationLabel(category),
    category_slug: normalizeProduct(category)?.slug ?? "",
    brand_id: brand?.id ?? "",
    brand_name: relationLabel(brand),
    brand_slug: normalizeProduct(brand)?.slug ?? "",
    specifications_json: JSON.stringify(attrs.specifications ?? []),
    seo_json: JSON.stringify(seoArray),
    seo_metaTitle: seo?.metaTitle ?? "",
    seo_metaDescription: seo?.metaDescription ?? "",
    seo_shareImage_id: seoShareImage?.id ?? "",
    products_ids: linkedProducts.map((item) => item?.id).filter(Boolean).join(","),
    products_names: linkedProducts.map(relationLabel).filter(Boolean).join(","),
    related_products_ids: relatedProducts.map((item) => item?.id).filter(Boolean).join(","),
    related_products_names: relatedProducts.map(relationLabel).filter(Boolean).join(","),
  };
}

export default function BulkExcelControls({ products = [] }) {
  const [message, setMessage] = useState(null);
  const uploadInputId = "products-bulk-upload-input";

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

      // Map products by id, documentId, or slug for quick lookup
      const byDocumentId = new Map();
      const categoryLookup = buildRelationLookup(products, "category");
      const brandLookup = buildRelationLookup(products, "brand");
      const productLookup = buildProductLookup(products);

      products.forEach((p) => {
        const attrs = p.attributes || p;
        const docId = p.documentId ?? attrs?.documentId;
        if (docId) byDocumentId.set(String(docId), p);
      });

      const results = [];

      for (const row of rows) {
        // Match exclusively by documentId provided in the Excel row
        const idRaw = row.documentId;
        let product = null;
        let id = null;
        if (idRaw) {
          const idKey = String(idRaw).trim();
          product = byDocumentId.get(idKey);
          if (product) {
            const attrs = product.attributes || product;
            id = product.documentId ?? attrs?.documentId;
            id = idRaw ? String(idRaw) : null;
          } else {
            id = null;
          }
        } else {
          id = null;
        }

        if (!id || !product) {
          results.push({ row, status: "skipped", reason: "No matching product id" });
          continue;
        }

        const updateAttrs = buildUpdateAttrs(row, product, {
          categoryLookup,
          brandLookup,
          productLookup,
        });

        if (!Object.keys(updateAttrs).length) {
          results.push({ row, status: "skipped", reason: "No editable fields found in row" });
          continue;
        }

        // Send PUT to dashboard API which proxies to Strapi (requires auth cookie)
        try {
          const res = await fetch(`/api/products/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ data: updateAttrs }),
          });
          const text = await res.text();
          let parsed;
          try {
            parsed = text ? JSON.parse(text) : null;
          } catch (error) {
            parsed = error?.message || text || `Invalid response (HTTP ${res.status})`;
          }

          if (!res.ok) {
            console.error("Failed update payload:", updateAttrs, "response:", parsed);
            results.push({ row, status: "error", reason: parsed || `HTTP ${res.status}` });
          } else {
            results.push({ row, status: "updated" });
          }
        } catch (error) {
          results.push({ row, status: "error", reason: String(error) });
        }
      }

      const updated = results.filter((r) => r.status === "updated").length;
      const skipped = results.filter((r) => r.status === "skipped").length;
      const failed = results.filter((r) => r.status === "error").length;

      setMessage({ type: "success", text: `انجام شد — بروز شد: ${updated}, نادیده گرفته شده: ${skipped}, خطا: ${failed}` });
    } catch (error) {
      console.error(error);
      setMessage({ type: "error", text: "خطا در خواندن فایل اکسل" });
    } finally {
      e.target.value = "";
    }
  };

  return (
    <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
      <Button variant="contained" color="primary" onClick={handleExport}>
        خروجی اکسل
      </Button>

      <label htmlFor={uploadInputId} style={{ display: "inline-block" }}>
        <input
          id={uploadInputId}
          type="file"
          accept=".xlsx,.xls,.csv"
          onChange={handleFile}
          style={{ display: "none" }}
        />
        <Button variant="outlined" component="span">
          آپلود اکسل برای بروزرسانی
        </Button>
      </label>

      {message && (
        <div style={{ minWidth: 260 }}>
          <Alert severity={message.type === "error" ? "error" : "success"}>{message.text}</Alert>
        </div>
      )}
    </div>
  );
}
