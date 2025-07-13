
// JSON dosyası simülasyonu için localStorage kullanacağız
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

// Varsayılan ürünler
const defaultProducts: Product[] = [
  {
    id: 1,
    name: "Robel Spirit Baskılı Oversize T-shirt",
    price: 299,
    description: "Bu tişört, \"Rebel Spirit\" (Asi Ruh) temasıyla tasarlanmış modern ve dikkat çekici bir üründür. Arka kısmında zengin renkli, geleneksel bir halı deseni ve bu deseni ikiye bölen cesur bir çizgi yer alır.",
    images: [
      "https://cdn.shopier.app/pictures_large/labriontr_f33a43e57e9e81087dcc99485419b805.jpg",
      "https://cdn.shopier.app/pictures_large/labriontr_764477f15e11efce2c5a350eaea548f7.jpg",
      "https://cdn.shopier.app/pictures_large/labriontr_a97568108e150e65ad89967b7022d8fb.jpg",
      "https://cdn.shopier.app/pictures_large/labriontr_2de7c932abf440b514a82d6ffdb79ebe.jpg"
    ],
    colors: ["BEYAZ"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    shopierLink: "https://www.shopier.com/37349328",
    rating: 4.8,
    reviewCount: 24
  },
  {
    id: 2,
    name: "Rahat Fit Beyaz Ribanalı Eşofman Altı",
    price: 179,
    description: "Günlük şıklık ve konforun buluştuğu Rahat Fit Beyaz Ribanalı Eşofman Altı ile tarzınızı tamamlayın. Yumuşak dokusu ve nefes alan kumaşı sayesinde gün boyu konfor sağlar.",
    images: [
      "https://cdn.shopier.app/pictures_large/labriontr_c5862d91c5380b90d60a2933201dee71.jpg",
      "https://cdn.shopier.app/pictures_large/labriontr_60ec962b4f4fceb1fff3d7360d7915c2.jpg",
      "https://cdn.shopier.app/pictures_large/labriontr_a3d3d2c641841cb0766705d7f8da7385.jpg",
      "https://cdn.shopier.app/pictures_large/labriontr_eccc200e58f827acb4d4a785455cb0d4.jpg",
      "https://cdn.shopier.app/pictures_large/labriontr_b0eb37ba71c5177d7ee0e2108604c4dc.jpg"
    ],
    colors: ["BEYAZ"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    shopierLink: "https://www.shopier.com/37289578",
    rating: 4.6,
    reviewCount: 18
  },
  {
    id: 3,
    name: "Dawn Whisper Baskılı Unisex Oversize T-Shirt A-Kalite",
    price: 249,
    description: "Bu soft gri T-shirt, sabahın ilk ışıklarını yansıtan sakin ve zarif bir tasarıma sahiptir. Üzerinde \"Dawn Whisper\" yazısı ve nazik dalga motifleriyle süslenmiş minimalist bir baskı bulunur.",
    images: [
      "https://cdn.shopier.app/pictures_large/labriontr_30e6a059257bdac4ed94d70fb6d9257c.jpg",
      "https://cdn.shopier.app/pictures_large/labriontr_9d1ead18f454db2b69b42582cf09913f.jpg"
    ],
    colors: ["KIRMIZI"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    shopierLink: "https://www.shopier.com/37278285",
    rating: 4.9,
    reviewCount: 31
  }
];

const defaultComments: Comment[] = [
  {
    id: 1,
    productId: 1,
    user: "Ahmet K.",
    comment: "Harika bir ürün! Kumaşı çok yumuşak.",
    rating: 5,
    date: "2024-01-15",
    status: "approved"
  },
  {
    id: 2,
    productId: 1,
    user: "Zeynep M.",
    comment: "Tasarımı çok beğendim.",
    rating: 4,
    date: "2024-01-10",
    status: "pending"
  }
];

// Veri yönetim fonksiyonları
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

interface Design {
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

const getDesigns = (): Design[] => {
  const stored = localStorage.getItem('labrion_designs');
  if (!stored) {
    localStorage.setItem('labrion_designs', JSON.stringify([]));
    return [];
  }
  return JSON.parse(stored);
};

const saveDesigns = (designs: Design[]): void => {
  localStorage.setItem('labrion_designs', JSON.stringify(designs));
};

export const addDesign = (design: Omit<Design, "id">): Design => {
  const designs = getDesigns();
  const newDesign: Design = {
    ...design,
    id: Math.max(...designs.map(d => d.id), 0) + 1,
  };
  designs.push(newDesign);
  saveDesigns(designs);
  return newDesign;
};
