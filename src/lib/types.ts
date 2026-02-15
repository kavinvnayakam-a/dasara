export interface MenuItem {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  image: string;
  available: boolean;
  showImage?: boolean;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface Order {
  id: string;
  tableId: string; // Used as composite "Screen X - Seat Y"
  screenId?: string;
  seatId?: string;
  items: CartItem[];
  totalPrice: number;
  status: 'Pending' | 'Received' | 'Preparing' | 'Served' | 'Completed';
  timestamp: any;
  orderNumber?: string;
  helpRequested?: boolean;
}
