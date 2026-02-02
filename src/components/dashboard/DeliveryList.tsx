import { MapPin, ChefHat, Package } from "lucide-react";
import { Delivery } from "@/types";
import { cn, formatStatus, getStatusColor } from "@/lib/utils";

interface DeliveryListProps {
  deliveries: Delivery[];
  selectedId?: string;
  onSelect: (item: Delivery) => void;
  loading: boolean;
}

export default function DeliveryList({
  deliveries,
  selectedId,
  onSelect,
  loading,
}: DeliveryListProps) {
  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 bg-gray-200 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col h-[600px]">
      <div className="p-4 border-b border-gray-100 bg-gray-50/50 rounded-t-xl">
        <h2 className="font-semibold text-gray-800 flex items-center gap-2">
          <Package className="w-4 h-4 text-blue-500" />
          Jadwal Pengiriman
          <span className="ml-auto bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">
            {deliveries.length} Aktif
          </span>
        </h2>
      </div>

      <div className="overflow-y-auto flex-1 p-3 space-y-3 custom-scrollbar">
        {deliveries.map((item) => (
          <div
            key={item._id}
            onClick={() => onSelect(item)}
            className={cn(
              "p-4 rounded-xl cursor-pointer border transition-all hover:shadow-md",
              selectedId === item._id
                ? "bg-blue-50 border-blue-500 ring-1 ring-blue-500"
                : "bg-white border-gray-100 hover:border-blue-200",
            )}
          >
            <div className="flex justify-between items-start mb-3">
              <span
                className={cn(
                  "text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-md",
                  getStatusColor(item.status),
                )}
              >
                {formatStatus(item.status)}
              </span>
              <span className="text-xs text-gray-400 font-mono">
                #{item._id.slice(-4)}
              </span>
            </div>

            <h3 className="font-bold text-gray-900 mb-1">
              {item.schoolId.name}
            </h3>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <ChefHat className="w-3 h-3" />
                <span className="truncate">{item.kitchenId.name}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <MapPin className="w-3 h-3" />
                <span>{item.schoolId.address.substring(0, 30)}...</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
