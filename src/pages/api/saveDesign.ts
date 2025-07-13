import type { NextApiRequest, NextApiResponse } from 'next';
import { addDesign } from '@/utils/dataManager';

type DesignItem = {
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

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const designData = req.body;
    
    // Add to data manager
    const newDesign = addDesign({
      ...designData,
      createdAt: new Date().toISOString(),
      status: 'pending'
    });
    
    return res.status(200).json({ 
      success: true, 
      design: newDesign 
    });
  } catch (error) {
    console.error('Error saving design:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Error saving design' 
    });
  }
}