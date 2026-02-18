'use client';

export interface Column<T> {
  key: keyof T | string;
  label: string;
  render?: (item: T) => React.ReactNode;
}

interface DataTableProps<T extends { id: number }> {
  columns: Column<T>[];
  data: T[];
  onEdit: (item: T) => void;
  onDelete: (item: T) => void;
}

export default function DataTable<T extends { id: number }>({
  columns,
  data,
  onEdit,
  onDelete,
}: DataTableProps<T>) {
  return (
    <>
      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-200">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              {columns.map((col) => (
                <th
                  key={String(col.key)}
                  className="text-left px-4 py-3 font-medium text-gray-600"
                >
                  {col.label}
                </th>
              ))}
              <th className="text-right px-4 py-3 font-medium text-gray-600">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr
                key={item.id}
                className="border-b border-gray-100 hover:bg-gray-50 transition"
              >
                {columns.map((col) => (
                  <td key={String(col.key)} className="px-4 py-3 text-gray-700">
                    {col.render
                      ? col.render(item)
                      : String((item as Record<string, unknown>)[String(col.key)] ?? '-')}
                  </td>
                ))}
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => onEdit(item)}
                      className="px-3 py-1.5 text-xs bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => onDelete(item)}
                      className="px-3 py-1.5 text-xs bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length + 1}
                  className="text-center py-8 text-gray-400"
                >
                  No hay datos
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {data.length === 0 && (
          <div className="text-center py-8 text-gray-400 bg-white rounded-xl shadow-sm border border-gray-200">
            No hay datos
          </div>
        )}
        {data.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 space-y-2"
          >
            {columns.map((col) => (
              <div key={String(col.key)} className="flex justify-between text-sm">
                <span className="text-gray-500 font-medium">{col.label}</span>
                <span className="text-gray-700 text-right">
                  {col.render
                    ? col.render(item)
                    : String((item as Record<string, unknown>)[String(col.key)] ?? '-')}
                </span>
              </div>
            ))}
            <div className="flex gap-2 pt-2 border-t border-gray-100">
              <button
                onClick={() => onEdit(item)}
                className="flex-1 px-3 py-2 text-xs bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition"
              >
                Editar
              </button>
              <button
                onClick={() => onDelete(item)}
                className="flex-1 px-3 py-2 text-xs bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
