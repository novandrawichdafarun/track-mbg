//? Data Lokasi (GeoJSON)
export interface Location {
  type: "Point";
  coordinates: number[]; // [Longitude, Latitude]
}

//? Data Dapur (Populated)
export interface Kitchen {
  _id: string;
  name: string;
  district: string;
  address: string;
  location: Location;
}

//? Data Sekolah (Populated)
export interface School {
  _id: string;
  name: string;
  address: string;
  location: Location;
  recipientName: string;
}

//? Data Utama: Pengiriman (Delivery)
export interface Delivery {
  _id: string;
  status:
    | "PLANNED"
    | "COOKING"
    | "PACKING"
    | "READY_TO_SHIP"
    | "ON_THE_WAY"
    | "DELIVERED"
    | "COMPLETED";
  kitchenId: Kitchen; // Object lengkap, bukan cuma ID
  schoolId: School; // Object lengkap, bukan cuma ID
  driverId?: string;

  menuItems: string[];
  totalPortions: number;

  timeline: {
    startCooking?: string;
    finishCooking?: string;
    pickedUp?: string;
    arrived?: string;
  };

  currentLocation?: {
    lat: number;
    lng: number;
    updatedAt: string;
  };
}
