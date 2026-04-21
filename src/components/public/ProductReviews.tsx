"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import StarRating from "./StarRating";
import Link from "next/link";

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  user: { name: string | null };
}

interface ProductReviewsProps {
  productId: string;
}

export default function ProductReviews({ productId }: ProductReviewsProps) {
  const { data: session } = useSession();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [loading, setLoading] = useState(true);

  // Form state
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const fetchReviews = async () => {
    try {
      const res = await fetch(`/api/products/${productId}/reviews`);
      if (res.ok) {
        const data = await res.json();
        setReviews(data.reviews);
        setAverageRating(data.averageRating);
        setTotalReviews(data.totalReviews);

        // Pre-fill if user already reviewed
        if (session?.user?.id) {
          const own = data.reviews.find(
            (r: Review & { userId?: string }) =>
              r.userId === session.user?.id
          );
          if (own) {
            setRating(own.rating);
            setComment(own.comment || "");
          }
        }
      }
    } catch (err) {
      console.error("Failed to fetch reviews:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      setError("Selectează un rating");
      return;
    }
    setError("");
    setSubmitting(true);

    try {
      const res = await fetch(`/api/products/${productId}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, comment: comment.trim() || undefined }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Eroare la salvare");
        setSubmitting(false);
        return;
      }

      await fetchReviews();
    } catch {
      setError("Eroare de conexiune");
    }
    setSubmitting(false);
  };

  if (loading) return null;

  return (
    <section className="mt-10">
      <div className="flex items-center gap-4 mb-6">
        <h2 className="text-xl font-bold text-darkgray">Recenzii</h2>
        {totalReviews > 0 && (
          <div className="flex items-center gap-2">
            <StarRating rating={Math.round(averageRating)} />
            <span className="text-sm text-darkgray-light">
              {averageRating} din 5 ({totalReviews}{" "}
              {totalReviews === 1 ? "recenzie" : "recenzii"})
            </span>
          </div>
        )}
      </div>

      {/* Review form */}
      {session ? (
        <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
          <h3 className="font-bold text-darkgray mb-3 text-sm">
            Lasă o recenzie
          </h3>
          <form onSubmit={handleSubmit} className="space-y-3">
            {error && (
              <div className="bg-red-50 text-red-600 text-sm p-2 rounded-lg">
                {error}
              </div>
            )}
            <div>
              <label className="block text-sm text-darkgray-light mb-1">
                Rating *
              </label>
              <StarRating rating={rating} onRate={setRating} size="md" />
            </div>
            <div>
              <label className="block text-sm text-darkgray-light mb-1">
                Comentariu (opțional)
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                maxLength={2000}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-coral focus:ring-2 focus:ring-coral/20 focus:outline-none resize-y text-sm"
                placeholder="Spune-ne ce crezi despre acest produs..."
              />
            </div>
            <button
              type="submit"
              disabled={submitting || rating === 0}
              className="bg-coral text-white font-bold px-6 py-2.5 rounded-lg text-sm hover:bg-coral-dark transition-colors disabled:opacity-50"
            >
              {submitting ? "Se salvează..." : "Trimite recenzia"}
            </button>
          </form>
        </div>
      ) : (
        <div className="bg-lightgray rounded-xl p-4 mb-6 text-center">
          <p className="text-sm text-darkgray-light">
            <Link
              href="/cont"
              className="text-coral font-medium hover:text-coral-dark"
            >
              Autentifică-te
            </Link>{" "}
            pentru a lăsa o recenzie
          </p>
        </div>
      )}

      {/* Reviews list */}
      {reviews.length === 0 ? (
        <p className="text-sm text-darkgray-light">
          Nicio recenzie încă. Fii primul care lasă o părere!
        </p>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-xl border border-gray-100 p-5"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-coral/10 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-coral">
                      {(review.user.name || "A")[0].toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-darkgray">
                      {review.user.name || "Anonim"}
                    </p>
                    <p className="text-xs text-darkgray-light">
                      {new Date(review.createdAt).toLocaleDateString("ro-RO", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                <StarRating rating={review.rating} />
              </div>
              {review.comment && (
                <p className="text-sm text-darkgray-light mt-2">
                  {review.comment}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
