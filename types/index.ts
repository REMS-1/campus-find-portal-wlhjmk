
export interface LostFoundItem {
  id: string;
  type: 'lost' | 'found';
  title: string;
  category: string;
  description: string;
  location: string;
  date: string;
  contactInfo: string;
  imageUri?: string;
  status: 'active' | 'resolved';
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
}

export type TabType = 'lost' | 'found' | 'my-items';

export interface FilterOptions {
  category: string;
  location: string;
  dateRange: string;
}
