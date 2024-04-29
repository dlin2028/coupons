// types/SquareItemTypes.ts

interface PriceMoney {
    amount: number;
    currency: string;
  }
  
  interface ItemVariationData {
    item_id: string;
    name: string;
    pricing_type: string;
    price_money: PriceMoney;
    track_inventory: boolean;
    stockable: boolean;
    sellable: boolean;
  }
  
  interface ItemVariation {
    type: string;
    item_variation_data: ItemVariationData;
  }
  
  interface ItemData {
    name: string;
    description?: string;
    variations: ItemVariation[];
  }
  
  interface SquareItem {
    type: string;
    item_data: ItemData;
  }
  
  export type { SquareItem, ItemVariation, ItemData, ItemVariationData };
  