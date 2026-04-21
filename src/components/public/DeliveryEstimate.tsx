interface DeliveryEstimateProps {
  stock: number;
  price: number;
}

export default function DeliveryEstimate({ stock, price }: DeliveryEstimateProps) {
  const freeDelivery = price >= 200;

  // Estimate delivery: in stock = 1-3 days, out of stock = unavailable
  const today = new Date();
  const minDate = new Date(today);
  minDate.setDate(today.getDate() + 1);
  const maxDate = new Date(today);
  maxDate.setDate(today.getDate() + 3);

  const formatDate = (d: Date) =>
    d.toLocaleDateString("ro-RO", { weekday: "short", day: "numeric", month: "short" });

  if (stock === 0) return null;

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 space-y-3">
      <div className="flex items-start gap-3">
        <span className="text-lg">🚚</span>
        <div>
          <p className="text-sm font-medium text-darkgray">
            Livrare estimată: {formatDate(minDate)} – {formatDate(maxDate)}
          </p>
          {freeDelivery ? (
            <p className="text-xs text-green font-medium mt-0.5">
              Livrare gratuită
            </p>
          ) : (
            <p className="text-xs text-darkgray-light mt-0.5">
              Cost livrare: de la 15,99 Lei ·{" "}
              <span className="text-green">Gratuită peste 200 Lei</span>
            </p>
          )}
        </div>
      </div>

      <div className="flex items-start gap-3">
        <span className="text-lg">↩️</span>
        <div>
          <p className="text-sm font-medium text-darkgray">Retur gratuit 30 zile</p>
          <p className="text-xs text-darkgray-light mt-0.5">
            Poți returna produsul în 30 de zile de la primire
          </p>
        </div>
      </div>

      <div className="flex items-start gap-3">
        <span className="text-lg">🔒</span>
        <div>
          <p className="text-sm font-medium text-darkgray">Plată securizată</p>
          <p className="text-xs text-darkgray-light mt-0.5">
            Card bancar sau ramburs la curier
          </p>
        </div>
      </div>
    </div>
  );
}
