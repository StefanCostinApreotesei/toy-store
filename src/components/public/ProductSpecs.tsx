import type { Specification } from "@/types/product";

interface ProductSpecsProps {
  specifications: Specification[];
}

export default function ProductSpecs({ specifications }: ProductSpecsProps) {
  if (specifications.length === 0) return null;

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      <h3 className="text-lg font-bold text-darkgray px-6 py-4 border-b border-gray-100">
        Specificații
      </h3>
      <table className="w-full">
        <tbody>
          {specifications.map((spec, index) => (
            <tr
              key={index}
              className={index % 2 === 0 ? "bg-lightgray/50" : "bg-white"}
            >
              <td className="px-6 py-3 text-sm font-medium text-darkgray w-1/3">
                {spec.key}
              </td>
              <td className="px-6 py-3 text-sm text-darkgray-light">
                {spec.value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
