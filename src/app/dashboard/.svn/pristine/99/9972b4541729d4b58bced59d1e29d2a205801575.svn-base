// components/BarChart.tsx
"use client";


interface TableCardProps {
  title: string;
  column: string[];
  type: string;
  subtitle: string;
  data: Record<string, any>[]
}

export default function TableCard({ title, column, type, subtitle, data }: TableCardProps) {

  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-lg font-semibold">{title}</h2>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>
        <div className="flex gap-2">
          <select className="border rounded px-2 py-1 text-sm">
            <option>Top 10</option>
            <option>Top 20</option>
          </select>
          <button className="border rounded px-2 py-1 text-sm">
            Column Filters ▾
          </button>
        </div>
      </div>

      {/* Table */}
      <table className="w-full text-sm">
        <thead className="border-b">
          <tr className="text-left">
            {column.map((item, idx) => (
              <th key={idx} className="py-2">{item}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {type == "lowQuantityStock" ?
            data.map((item, idx) => (
              <tr key={idx} className="border-b last:border-0">
                <td className="py-2">
                  <div className="font-medium">{item.name}</div>
                  <div className="text-green-600 text-sm">{item.price}</div>
                </td>
                <td className="py-2">
                  <div className="font-semibold">{item.actual}</div>
                  <div className="text-xs text-gray-500">UNITS</div>
                </td>
                <td className="py-2">
                  <div className="font-semibold">{item.expected}</div>
                  <div className="text-xs text-gray-500">UNITS</div>
                </td>
                <td className="py-2">{item.supplierCode}</td>
              </tr>
            )) : type == "stockExpiration" ?

              data.map((item, idx) => (
                <tr key={idx} className="border-b last:border-0">
                  <td className="py-2">
                    <div className="font-medium">{item.name}</div>
                    <div className="text-green-600 text-sm">{item.price}</div>
                  </td>
                  <td className="py-2">
                    <div className="font-semibold border border-red-200 rounded-lg bg-red-200 text-center text-red-600">{item.dayToExpiry}</div>
                  </td>
                  <td className="py-2">
                    <div className="font-semibold">{item.quantity}</div>
                    <div className="text-xs text-gray-500">UNITS</div>
                  </td>
                  <td className="py-2">{item.batchNumber}</td>
                </tr>
              )) : data.map((item, idx) => (
                <tr key={idx} className="border-b last:border-0">
                  <td className="py-2">
                    <div className="font-medium">{item.name}</div>
                    <div className="text-green-600 text-sm">{item.price}</div>
                  </td>
                  <td className="py-2">
                    <div className="font-semibold border border-green-200 rounded-lg bg-green-200 text-center text-green-600">{item.dayInStock}</div>
                  </td>
                  <td className="py-2">
                    <div className="font-semibold">{item.batchNumber}</div>
                  </td>
                  <td className="py-2">{item.supplierCode}</td>
                </tr>
              ))


          }

        </tbody>
      </table>
    </div>
  );
};



