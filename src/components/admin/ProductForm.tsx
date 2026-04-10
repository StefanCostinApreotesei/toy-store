"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { generateSlug } from "@/lib/utils";
import ImageUploader from "./ImageUploader";

interface Subcategory {
  id: string;
  name: string;
  category: { id: string; name: string };
}

interface Spec {
  key: string;
  value: string;
}

interface ProductImage {
  id: string;
  url: string;
  alt: string | null;
  displayOrder: number;
}

interface ProductFormProps {
  product?: {
    id: string;
    name: string;
    slug: string;
    description: string;
    shortDescription: string | null;
    price: number;
    oldPrice: number | null;
    sku: string | null;
    stock: number;
    featured: boolean;
    recommendedAge: string | null;
    specifications: string | null;
    subcategoryId: string;
    images?: ProductImage[];
  };
  subcategories: Subcategory[];
}

export default function ProductForm({ product, subcategories }: ProductFormProps) {
  const router = useRouter();
  const isEdit = !!product;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [name, setName] = useState(product?.name || "");
  const [slug, setSlug] = useState(product?.slug || "");
  const [description, setDescription] = useState(product?.description || "");
  const [shortDescription, setShortDescription] = useState(product?.shortDescription || "");
  const [price, setPrice] = useState(product?.price?.toString() || "");
  const [oldPrice, setOldPrice] = useState(product?.oldPrice?.toString() || "");
  const [sku, setSku] = useState(product?.sku || "");
  const [stock, setStock] = useState(product?.stock?.toString() || "0");
  const [featured, setFeatured] = useState(product?.featured || false);
  const [recommendedAge, setRecommendedAge] = useState(product?.recommendedAge || "");
  const [subcategoryId, setSubcategoryId] = useState(product?.subcategoryId || "");
  const [specs, setSpecs] = useState<Spec[]>(() => {
    if (product?.specifications) {
      try { return JSON.parse(product.specifications); } catch { return []; }
    }
    return [];
  });
  const [images, setImages] = useState<ProductImage[]>(product?.images || []);

  useEffect(() => {
    if (!isEdit && name) {
      setSlug(generateSlug(name));
    }
  }, [name, isEdit]);

  const addSpec = () => setSpecs([...specs, { key: "", value: "" }]);
  const removeSpec = (index: number) => setSpecs(specs.filter((_, i) => i !== index));
  const updateSpec = (index: number, field: "key" | "value", value: string) => {
    setSpecs(specs.map((s, i) => (i === index ? { ...s, [field]: value } : s)));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const validSpecs = specs.filter((s) => s.key && s.value);

    const body = {
      name,
      slug,
      description: description || "<p>Descriere produs</p>",
      shortDescription: shortDescription || undefined,
      price: parseFloat(price),
      oldPrice: oldPrice ? parseFloat(oldPrice) : null,
      sku: sku || null,
      stock: parseInt(stock),
      featured,
      recommendedAge: recommendedAge || null,
      specifications: validSpecs.length > 0 ? validSpecs : undefined,
      subcategoryId,
    };

    try {
      const res = await fetch(
        isEdit ? `/api/products/${product.id}` : "/api/products",
        {
          method: isEdit ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Eroare la salvare");
        setLoading(false);
        return;
      }

      router.push("/admin/produse");
      router.refresh();
    } catch {
      setError("Eroare de conexiune");
      setLoading(false);
    }
  };

  // Group subcategories by category
  const grouped = subcategories.reduce((acc, sub) => {
    const catName = sub.category.name;
    if (!acc[catName]) acc[catName] = [];
    acc[catName].push(sub);
    return acc;
  }, {} as Record<string, Subcategory[]>);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">{error}</div>
      )}

      {/* General */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h2 className="font-bold text-darkgray mb-4">Informații generale</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-darkgray mb-1">
              Nume produs *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-coral focus:ring-2 focus:ring-coral/20 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-darkgray mb-1">
              Slug (URL)
            </label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-coral focus:ring-2 focus:ring-coral/20 focus:outline-none font-mono text-sm"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-darkgray mb-1">
              Descriere scurtă
            </label>
            <input
              type="text"
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-coral focus:ring-2 focus:ring-coral/20 focus:outline-none"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-darkgray mb-1">
              Descriere completă (HTML)
            </label>
            <textarea
              rows={6}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-coral focus:ring-2 focus:ring-coral/20 focus:outline-none resize-y font-mono text-sm"
            />
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h2 className="font-bold text-darkgray mb-4">Prețuri și stoc</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-darkgray mb-1">
              Preț (Lei) *
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              required
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-coral focus:ring-2 focus:ring-coral/20 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-darkgray mb-1">
              Preț vechi (opțional)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={oldPrice}
              onChange={(e) => setOldPrice(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-coral focus:ring-2 focus:ring-coral/20 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-darkgray mb-1">
              SKU
            </label>
            <input
              type="text"
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-coral focus:ring-2 focus:ring-coral/20 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-darkgray mb-1">
              Stoc *
            </label>
            <input
              type="number"
              min="0"
              required
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-coral focus:ring-2 focus:ring-coral/20 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Categorization */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h2 className="font-bold text-darkgray mb-4">Categorizare</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-darkgray mb-1">
              Subcategorie *
            </label>
            <select
              required
              value={subcategoryId}
              onChange={(e) => setSubcategoryId(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-coral focus:ring-2 focus:ring-coral/20 focus:outline-none"
            >
              <option value="">Selectează...</option>
              {Object.entries(grouped).map(([catName, subs]) => (
                <optgroup key={catName} label={catName}>
                  {subs.map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      {sub.name}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-darkgray mb-1">
              Vârstă recomandată
            </label>
            <input
              type="text"
              value={recommendedAge}
              onChange={(e) => setRecommendedAge(e.target.value)}
              placeholder="ex: 3-6 ani"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-coral focus:ring-2 focus:ring-coral/20 focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-3 pt-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-coral focus:ring-coral"
              />
              <span className="text-sm font-medium text-darkgray">Produs recomandat</span>
            </label>
          </div>
        </div>
      </div>

      {/* Specifications */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-darkgray">Specificații</h2>
          <button
            type="button"
            onClick={addSpec}
            className="text-sm text-coral font-medium hover:text-coral-dark"
          >
            + Adaugă specificație
          </button>
        </div>
        {specs.length === 0 ? (
          <p className="text-sm text-darkgray-light">Nicio specificație adăugată</p>
        ) : (
          <div className="space-y-2">
            {specs.map((spec, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Cheie (ex: Material)"
                  value={spec.key}
                  onChange={(e) => updateSpec(index, "key", e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg border border-gray-300 focus:border-coral focus:ring-2 focus:ring-coral/20 focus:outline-none text-sm"
                />
                <input
                  type="text"
                  placeholder="Valoare (ex: Lemn)"
                  value={spec.value}
                  onChange={(e) => updateSpec(index, "value", e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg border border-gray-300 focus:border-coral focus:ring-2 focus:ring-coral/20 focus:outline-none text-sm"
                />
                <button
                  type="button"
                  onClick={() => removeSpec(index)}
                  className="px-3 text-red-400 hover:text-red-600"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Images */}
      {isEdit && product && (
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="font-bold text-darkgray mb-4">Imagini produs</h2>
          <ImageUploader
            productId={product.id}
            images={images}
            onImagesChange={setImages}
          />
        </div>
      )}

      {!isEdit && (
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="font-bold text-darkgray mb-4">Imagini produs</h2>
          <p className="text-sm text-darkgray-light">
            Salvează produsul mai întâi, apoi vei putea adăuga imagini din pagina de editare.
          </p>
        </div>
      )}

      {/* Submit */}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="bg-coral text-white font-bold px-8 py-3 rounded-lg hover:bg-coral-dark transition-colors disabled:opacity-50"
        >
          {loading
            ? "Se salvează..."
            : isEdit
            ? "Salvează modificările"
            : "Creează produs"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="border border-gray-300 text-darkgray font-medium px-6 py-3 rounded-lg hover:bg-lightgray transition-colors"
        >
          Anulează
        </button>
      </div>
    </form>
  );
}
