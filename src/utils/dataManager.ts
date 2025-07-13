// types
export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  images: string[];
  colors: string[];
  sizes: string[];
  shopierLink: string;
  rating: number;
  reviewCount: number;
}

export interface Comment {
  id: number;
  productId: number;
  user: string;
  comment: string;
  rating: number;
  date: string;
  status: 'pending' | 'approved';
}

export interface Design {
  id: number;
  userInfo: {
    name: string;
    surname: string;
    address: string;
    message?: string;
  };
  designData: {
    tshirt: {
      color: string;
      size: string;
    };
    items: any[];
    previewImage: string;
  };
  createdAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  date: string;
  status: 'unread' | 'read';
}

// --- Varsayılan örnek veriler ---
const defaultProducts: Product[] = [
  {
    id: 1,
    name: "Robel Spirit Baskılı Oversize T-shirt",
    price: 299,
    description: "Asi Ruh temalı tişört.",
    images: ["https://cdn.shopier.app/pictures_large/labriontr_f33a43e57e9e81087dcc99485419b805.jpg"],
    colors: ["BEYAZ"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    shopierLink: "https://www.shopier.com/37349328",
    rating: 4.8,
    reviewCount: 24
  }
];

const defaultComments: Comment[] = [
  {
    id: 1,
    productId: 1,
    user: "Ahmet K.",
    comment: "Harika bir ürün!",
    rating: 5,
    date: "2024-01-15",
    status: "approved"
  }
];

// --- Ürün Fonksiyonları ---
export const getProducts = (): Product[] => {
  const stored = localStorage.getItem('labrion_products');
  if (!stored) {
    localStorage.setItem('labrion_products', JSON.stringify(defaultProducts));
    return defaultProducts;
  }
  return JSON.parse(stored);
};

export const saveProducts = (products: Product[]): void => {
  localStorage.setItem('labrion_products', JSON.stringify(products));
};

export const addProduct = (product: Omit<Product, 'id' | 'rating' | 'reviewCount'>): Product => {
  const products = getProducts();
  const newId = Math.max(...products.map(p => p.id), 0) + 1;
  const newProduct: Product = {
    ...product,
    id: newId,
    rating: 0,
    reviewCount: 0
  };
  products.push(newProduct);
  saveProducts(products);
  return newProduct;
};

export const updateProduct = (id: number, updates: Partial<Product>): void => {
  const products = getProducts();
  const index = products.findIndex(p => p.id === id);
  if (index !== -1) {
    products[index] = { ...products[index], ...updates };
    saveProducts(products);
  }
};

export const deleteProduct = (id: number): void => {
  const products = getProducts();
  const filtered = products.filter(p => p.id !== id);
  saveProducts(filtered);
};

// --- Yorum Fonksiyonları ---
export const getComments = (): Comment[] => {
  const stored = localStorage.getItem('labrion_comments');
  if (!stored) {
    localStorage.setItem('labrion_comments', JSON.stringify(defaultComments));
    return defaultComments;
  }
  return JSON.parse(stored);
};

export const saveComments = (comments: Comment[]): void => {
  localStorage.setItem('labrion_comments', JSON.stringify(comments));
};

export const addComment = (comment: Omit<Comment, 'id' | 'date' | 'status'>): Comment => {
  const comments = getComments();
  const newId = Math.max(...comments.map(c => c.id), 0) + 1;
  const newComment: Comment = {
    ...comment,
    id: newId,
    date: new Date().toISOString().split('T')[0],
    status: 'pending'
  };
  comments.push(newComment);
  saveComments(comments);
  return newComment;
};

export const updateComment = (id: number, updates: Partial<Comment>): void => {
  const comments = getComments();
  const index = comments.findIndex(c => c.id === id);
  if (index !== -1) {
    comments[index] = { ...comments[index], ...updates };
    saveComments(comments);
  }
};

export const deleteComment = (id: number): void => {
  const comments = getComments();
  const filtered = comments.filter(c => c.id !== id);
  saveComments(filtered);
};

// --- Tasarım Fonksiyonları ---
export const getDesigns = (): Design[] => {
  const stored = localStorage.getItem('labrion_designs');
  if (!stored) {
    localStorage.setItem('labrion_designs', JSON.stringify([]));
    return [];
  }
  return JSON.parse(stored);
};

export const saveDesigns = (designs: Design[]): void => {
  localStorage.setItem('labrion_designs', JSON.stringify(designs));
};

export const addDesign = (design: Omit<Design, 'id'>): Design => {
  const designs = getDesigns();
  const newId = Math.max(...designs.map(d => d.id), 0) + 1;
  const newDesign: Design = { ...design, id: newId };
  designs.push(newDesign);
  saveDesigns(designs);
  return newDesign;
};

export const updateDesign = (id: number, updates: Partial<Design>): void => {
  const designs = getDesigns();
  const index = designs.findIndex(d => d.id === id);
  if (index !== -1) {
    designs[index] = { ...designs[index], ...updates };
    saveDesigns(designs);
  }
};

export const deleteDesign = (id: number): void => {
  const designs = getDesigns();
  const filtered = designs.filter(d => d.id !== id);
  saveDesigns(filtered);
};

// --- İletişim Mesajları Fonksiyonları ---
export const getContactMessages = (): ContactMessage[] => {
  const stored = localStorage.getItem('labrion_contact_messages');
  if (!stored) {
    localStorage.setItem('labrion_contact_messages', JSON.stringify([]));
    return [];
  }
  return JSON.parse(stored);
};

export const saveContactMessages = (messages: ContactMessage[]): void => {
  localStorage.setItem('labrion_contact_messages', JSON.stringify(messages));
};

export const addContactMessage = (message: Omit<ContactMessage, 'id' | 'date' | 'status'>): ContactMessage => {
  const messages = getContactMessages();
  const newId = Math.max(...messages.map(m => m.id), 0) + 1;
  const newMessage: ContactMessage = {
    ...message,
    id: newId,
    date: new Date().toISOString(),
    status: 'unread'
  };
  messages.push(newMessage);
  saveContactMessages(messages);
  return newMessage;
};

export const updateContactMessage = (id: number, updates: Partial<ContactMessage>): void => {
  const messages = getContactMessages();
  const index = messages.findIndex(m => m.id === id);
  if (index !== -1) {
    messages[index] = { ...messages[index], ...updates };
    saveContactMessages(messages);
  }
};

export const deleteContactMessage = (id: number): void => {
  const messages = getContactMessages();
  const filtered = messages.filter(m => m.id !== id);
  saveContactMessages(filtered);
};