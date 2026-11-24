export type Product = {
  _id: string;
  slug: string;
  title: string;
  description?: string;
  price: number;
  images?: { url: string }[];
  category?: { name?: string };
  brand?: string;
  color?: string;
  ratings?: { star: number }[];
  count?: number;
};

export type Maker = {
  _id: string;
  shopName?: string;
  displayName?: string;
  serviceArea?: string;
  description?: string;
  productTypes?: string[];
  specialties?: string[];
  portfolioLink?: string;
  startingPrice?: number;
};

export type RoomDesign = {
  summary: string;
  palette: string;
  image: string;
  budget: number;
  total: number;
  remaining: number;
  products: Product[];
};