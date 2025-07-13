export type DesignItem = {
  id: string;
  type: "image" | "text";
  content: string;
  color?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  side: string;
};

export type Design = {
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
    items: DesignItem[];
    previewImage: string;
  };
  createdAt: string;
  status: 'pending' | 'approved' | 'rejected';
};