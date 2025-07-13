import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Edit, Trash2, Eye, Save, X } from "lucide-react";
import Header from "@/components/Header";
import { useToast } from "@/hooks/use-toast";
import { PasswordModal } from "@/components/PasswordModal";
import { 
  getProducts, 
  addProduct, 
  updateProduct, 
  deleteProduct,
  getComments,
  updateComment,
  deleteComment,
  getDesigns,
  updateDesign,
  deleteDesign,
  Product,
  Comment,
  Design
} from "@/utils/dataManager";

const Admin = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [designs, setDesigns] = useState<Design[]>([]);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    description: "",
    colors: "",
    sizes: "",
    shopierLink: "",
    imageUrls: ""
  });
  const { toast } = useToast();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("admin_authenticated") === "true";
    setAuthenticated(isAuthenticated);
    if (isAuthenticated) {
      loadData();
    }
  }, []);

  const loadData = () => {
    setProducts(getProducts());
    setComments(getComments());
    setDesigns(getDesigns());
  };

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.price || !newProduct.shopierLink) {
      toast({
        title: "Hata",
        description: "Lütfen gerekli alanları doldurun.",
        variant: "destructive"
      });
      return;
    }

    try {
      const imageArray = newProduct.imageUrls 
        ? newProduct.imageUrls.split(",").map(url => url.trim()).filter(url => url)
        : [];

      addProduct({
        name: newProduct.name,
        price: parseInt(newProduct.price),
        description: newProduct.description,
        colors: newProduct.colors.split(",").map(c => c.trim()).filter(c => c),
        sizes: newProduct.sizes.split(",").map(s => s.trim()).filter(s => s),
        shopierLink: newProduct.shopierLink,
        images: imageArray.length > 0 ? imageArray : ["https://via.placeholder.com/400"]
      });

      setNewProduct({
        name: "",
        price: "",
        description: "",
        colors: "",
        sizes: "",
        shopierLink: "",
        imageUrls: ""
      });

      loadData();

      toast({
        title: "Başarılı",
        description: "Ürün başarıyla eklendi."
      });
    } catch (error) {
      toast({
        title: "Hata",
        description: "Ürün eklenirken bir hata oluştu.",
        variant: "destructive"
      });
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct({
      ...product,
      colors: product.colors.join(", "),
      sizes: product.sizes.join(", "),
      imageUrls: product.images.join(", ")
    });
  };

  const handleUpdateProduct = () => {
    if (!editingProduct) return;

    try {
      const imageArray = editingProduct.imageUrls 
        ? editingProduct.imageUrls.split(",").map((url: string) => url.trim()).filter((url: string) => url)
        : [];

      updateProduct(editingProduct.id, {
        name: editingProduct.name,
        price: parseInt(editingProduct.price),
        description: editingProduct.description,
        colors: editingProduct.colors.split(",").map((c: string) => c.trim()).filter((c: string) => c),
        sizes: editingProduct.sizes.split(",").map((s: string) => s.trim()).filter((s: string) => s),
        shopierLink: editingProduct.shopierLink,
        images: imageArray.length > 0 ? imageArray : editingProduct.images
      });

      setEditingProduct(null);
      loadData();
      
      toast({
        title: "Başarılı",
        description: "Ürün başarıyla güncellendi."
      });
    } catch (error) {
      toast({
        title: "Hata",
        description: "Ürün güncellenirken bir hata oluştu.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteProduct = (id: number) => {
    try {
      deleteProduct(id);
      loadData();
      toast({
        title: "Başarılı",
        description: "Ürün başarıyla silindi."
      });
    } catch (error) {
      toast({
        title: "Hata",
        description: "Ürün silinirken bir hata oluştu.",
        variant: "destructive"
      });
    }
  };

  const handleApproveComment = (id: number) => {
    try {
      updateComment(id, { status: 'approved' });
      loadData();
      toast({
        title: "Başarılı",
        description: "Yorum onaylandı."
      });
    } catch (error) {
      toast({
        title: "Hata",
        description: "Yorum onaylanırken bir hata oluştu.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteComment = (id: number) => {
    try {
      deleteComment(id);
      loadData();
      toast({
        title: "Başarılı",
        description: "Yorum silindi."
      });
    } catch (error) {
      toast({
        title: "Hata",
        description: "Yorum silinirken bir hata oluştu.",
        variant: "destructive"
      });
    }
  };

  const handleApproveDesign = (id: number) => {
    try {
      updateDesign(id, { status: 'approved' });
      loadData();
      toast({
        title: "Başarılı",
        description: "Tasarım onaylandı."
      });
    } catch (error) {
      toast({
        title: "Hata",
        description: "Tasarım onaylanırken bir hata oluştu.",
        variant: "destructive"
      });
    }
  };

  const handleRejectDesign = (id: number) => {
    try {
      updateDesign(id, { status: 'rejected' });
      loadData();
      toast({
        title: "Başarılı",
        description: "Tasarım reddedildi."
      });
    } catch (error) {
      toast({
        title: "Hata",
        description: "Tasarım reddedilirken bir hata oluştu.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteDesign = (id: number) => {
    try {
      deleteDesign(id);
      loadData();
      toast({
        title: "Başarılı",
        description: "Tasarım silindi."
      });
    } catch (error) {
      toast({
        title: "Hata",
        description: "Tasarım silinirken bir hata oluştu.",
        variant: "destructive"
      });
    }
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-stone-100">
        <Header />
        <PasswordModal onSuccess={() => {
          setAuthenticated(true);
          loadData();
        }} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-stone-100">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-stone-900 mb-2">Admin Paneli</h1>
            <p className="text-stone-600">Ürünlerinizi ve yorumları yönetin</p>
          </div>
        </div>

        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-[600px]">
            <TabsTrigger value="products">Ürün Yönetimi</TabsTrigger>
            <TabsTrigger value="comments">Yorum Yönetimi</TabsTrigger>
            <TabsTrigger value="designs">Tasarım Talepleri ({designs.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="space-y-6">
            {/* Add New Product */}
            <Card className="bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Plus className="h-5 w-5 mr-2" />
                  Yeni Ürün Ekle
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Ürün Adı *</Label>
                    <Input
                      id="name"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                      placeholder="Ürün adını girin"
                    />
                  </div>
                  <div>
                    <Label htmlFor="price">Fiyat (₺) *</Label>
                    <Input
                      id="price"
                      type="number"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                      placeholder="299"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Açıklama</Label>
                  <Textarea
                    id="description"
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                    placeholder="Ürün açıklaması"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="colors">Renkler (virgülle ayırın)</Label>
                    <Input
                      id="colors"
                      value={newProduct.colors}
                      onChange={(e) => setNewProduct({...newProduct, colors: e.target.value})}
                      placeholder="BEYAZ, SİYAH, KIRMIZI"
                    />
                  </div>
                  <div>
                    <Label htmlFor="sizes">Bedenler (virgülle ayırın)</Label>
                    <Input
                      id="sizes"
                      value={newProduct.sizes}
                      onChange={(e) => setNewProduct({...newProduct, sizes: e.target.value})}
                      placeholder="S, M, L, XL, XXL"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="shopierLink">Shopier Linki *</Label>
                  <Input
                    id="shopierLink"
                    value={newProduct.shopierLink}
                    onChange={(e) => setNewProduct({...newProduct, shopierLink: e.target.value})}
                    placeholder="https://www.shopier.com/..."
                  />
                </div>

                <div>
                  <Label htmlFor="imageUrls">Görsel URL'leri (virgülle ayırın)</Label>
                  <Textarea
                    id="imageUrls"
                    value={newProduct.imageUrls}
                    onChange={(e) => setNewProduct({...newProduct, imageUrls: e.target.value})}
                    placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                    rows={2}
                  />
                </div>

                <Button onClick={handleAddProduct} className="bg-stone-900 hover:bg-stone-800">
                  <Plus className="h-4 w-4 mr-2" />
                  Ürün Ekle
                </Button>
              </CardContent>
            </Card>

            {/* Products List */}
            <Card className="bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Mevcut Ürünler ({products.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {products.map((product) => (
                    <div key={product.id} className="border rounded-lg p-4 bg-white">
                      {editingProduct?.id === product.id ? (
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label>Ürün Adı</Label>
                              <Input
                                value={editingProduct.name}
                                onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
                              />
                            </div>
                            <div>
                              <Label>Fiyat</Label>
                              <Input
                                type="number"
                                value={editingProduct.price}
                                onChange={(e) => setEditingProduct({...editingProduct, price: e.target.value})}
                              />
                            </div>
                          </div>
                          <div>
                            <Label>Açıklama</Label>
                            <Textarea
                              value={editingProduct.description}
                              onChange={(e) => setEditingProduct({...editingProduct, description: e.target.value})}
                              rows={2}
                            />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label>Renkler</Label>
                              <Input
                                value={editingProduct.colors}
                                onChange={(e) => setEditingProduct({...editingProduct, colors: e.target.value})}
                              />
                            </div>
                            <div>
                              <Label>Bedenler</Label>
                              <Input
                                value={editingProduct.sizes}
                                onChange={(e) => setEditingProduct({...editingProduct, sizes: e.target.value})}
                              />
                            </div>
                          </div>
                          <div>
                            <Label>Shopier Linki</Label>
                            <Input
                              value={editingProduct.shopierLink}
                              onChange={(e) => setEditingProduct({...editingProduct, shopierLink: e.target.value})}
                            />
                          </div>
                          <div>
                            <Label>Görsel URL'leri</Label>
                            <Textarea
                              value={editingProduct.imageUrls}
                              onChange={(e) => setEditingProduct({...editingProduct, imageUrls: e.target.value})}
                              rows={2}
                            />
                          </div>
                          <div className="flex space-x-2">
                            <Button onClick={handleUpdateProduct} size="sm" className="bg-green-600 hover:bg-green-700">
                              <Save className="h-4 w-4 mr-1" />
                              Kaydet
                            </Button>
                            <Button onClick={() => setEditingProduct(null)} variant="outline" size="sm">
                              <X className="h-4 w-4 mr-1" />
                              İptal
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-semibold text-stone-900">{product.name}</h3>
                              <p className="text-stone-600 text-sm">{product.description}</p>
                              <p className="text-lg font-bold text-stone-900 mt-1">₺{product.price}</p>
                            </div>
                            <div className="flex space-x-2">
                              <Button onClick={() => handleEditProduct(product)} variant="outline" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button onClick={() => handleDeleteProduct(product.id)} variant="destructive" size="sm">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <div>
                            <div className="flex flex-wrap gap-2 mb-2">
                              <span className="text-sm text-stone-600">Renkler:</span>
                              {product.colors.map((color: string) => (
                                <Badge key={color} variant="outline" className="text-xs">
                                  {color}
                                </Badge>
                              ))}
                            </div>
                            <div className="flex flex-wrap gap-2">
                              <span className="text-sm text-stone-600">Bedenler:</span>
                              {product.sizes.map((size: string) => (
                                <Badge key={size} variant="secondary" className="text-xs">
                                  {size}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="comments" className="space-y-6">
            <Card className="bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Eye className="h-5 w-5 mr-2" />
                  Yorum Yönetimi ({comments.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {comments.length === 0 ? (
                    <p className="text-stone-500 text-center py-8">Henüz yorum bulunmuyor.</p>
                  ) : (
                    comments.map((comment) => (
                      <div key={comment.id} className="border rounded-lg p-4 bg-white">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h4 className="font-semibold text-stone-900">{comment.user}</h4>
                              <Badge 
                                variant={comment.status === "approved" ? "default" : "secondary"}
                                className="text-xs"
                              >
                                {comment.status === "approved" ? "Onaylandı" : "Bekliyor"}
                              </Badge>
                              <span className="text-sm text-stone-500">{comment.date}</span>
                            </div>
                            <p className="text-stone-600 mb-2">{comment.comment}</p>
                            <div className="flex items-center">
                              <span className="text-sm text-stone-500 mr-2">Puan:</span>
                              <div className="text-yellow-400">
                                {"★".repeat(comment.rating)}{"☆".repeat(5 - comment.rating)}
                              </div>
                            </div>
                          </div>
                          <div className="flex space-x-2 ml-4">
                            {comment.status === "pending" && (
                              <Button 
                                onClick={() => handleApproveComment(comment.id)} 
                                variant="outline" 
                                size="sm"
                                className="text-green-600 border-green-600 hover:bg-green-50"
                              >
                                Onayla
                              </Button>
                            )}
                            <Button 
                              onClick={() => handleDeleteComment(comment.id)} 
                              variant="destructive" 
                              size="sm"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="designs" className="space-y-6">
            <Card className="bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Tasarım Talepleri ({designs.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {designs.length === 0 ? (
                    <p className="text-stone-500 text-center py-8">Henüz tasarım talebi bulunmuyor.</p>
                  ) : (
                    designs.map((design) => (
                      <div key={design.id} className="border rounded-lg p-4 bg-white">
                        <div className="flex flex-col md:flex-row gap-4">
                          <div className="md:w-1/3">
                            <img 
                              src={design.designData.previewImage} 
                              alt="Tasarım Önizleme" 
                              className="w-full rounded border"
                            />
                          </div>
                          <div className="md:w-2/3">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-bold text-lg">
                                  {design.userInfo.name} {design.userInfo.surname}
                                </h3>
                                <p className="text-sm text-gray-600">
                                  {new Date(design.createdAt).toLocaleString()}
                                </p>
                                <Badge 
                                  variant={
                                    design.status === 'approved' ? 'default' : 
                                    design.status === 'rejected' ? 'destructive' : 'secondary'
                                  }
                                  className="mt-2"
                                >
                                  {design.status === 'pending' ? 'Bekliyor' : 
                                   design.status === 'approved' ? 'Onaylandı' : 'Reddedildi'}
                                </Badge>
                              </div>
                              <div className="flex gap-2">
                                {design.status === 'pending' && (
                                  <>
                                    <Button 
                                      size="sm" 
                                      variant="outline"
                                      onClick={() => handleApproveDesign(design.id)}
                                    >
                                      Onayla
                                    </Button>
                                    <Button 
                                      size="sm" 
                                      variant="destructive"
                                      onClick={() => handleRejectDesign(design.id)}
                                    >
                                      Reddet
                                    </Button>
                                  </>
                                )}
                                <Button 
                                  size="sm" 
                                  variant="ghost"
                                  onClick={() => handleDeleteDesign(design.id)}
                                >
                                  <Trash2 className="h-4 w-4 text-red-600" />
                                </Button>
                              </div>
                            </div>
                            
                            <div className="mt-4 space-y-2">
                              <p><strong>Adres:</strong> {design.userInfo.address}</p>
                              {design.userInfo.message && (
                                <p><strong>Mesaj:</strong> {design.userInfo.message}</p>
                              )}
                              <p><strong>Tişört Rengi:</strong> 
                                <span className="inline-block w-4 h-4 rounded-full ml-2 border" 
                                      style={{backgroundColor: design.designData.tshirt.color}} />
                              </p>
                              <p><strong>Beden:</strong> {design.designData.tshirt.size}</p>
                              <p><strong>Öğe Sayısı:</strong> {design.designData.items.length}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;