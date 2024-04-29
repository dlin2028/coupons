// types/types.ts
export interface Deal {
  id: number;
  title: string;
  description: string;
  code: string;
  imageUrl: string;
  distance: number;  // distance in miles
  discountPercentage: number;  // Discount percentage
  store: string;  // Name of the store
}
