// src/components/ProductCard.js
import Image from "next/image";
import Link from "next/link";

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:8000";

export default function ProductCard({ product }) {
  // Assuming you have these attributes from Strapi
  const thumbnail = product.thumbnail.url;
  const name = product.name;
  const price = product.price;
  // Check if thumbnail data is available
  if (!thumbnail) {
    return <div>Image not available</div>; // Or a placeholder
  }

  const imageUrl = STRAPI_URL + thumbnail;

  return (
    <Link
      href={`/products/${slug}`}
      className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="relative w-full aspect-square">
        <Image
          src={imageUrl}
          alt={name}
          fill
          style={{ objectFit: "cover" }}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div className="p-4 text-center">
        <h3 className="font-semibold text-lg">{name}</h3>
        <p className="text-gray-700 mt-1">${price}</p>
      </div>
    </Link>
  );
}
