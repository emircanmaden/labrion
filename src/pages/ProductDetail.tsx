
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Star, ShoppingCart, ArrowLeft, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getProducts, getComments, addComment, Product, Comment } from "@/utils/dataManager";
import { useToast } from "@/hooks/use-toast";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [product, setProduct] = useState<Product | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [newComment, setNewComment] = useState({
    user: "",
    comment: "",
    rating: 5
  });

  useEffect(() => {
    const products = getProducts();
    const foundProduct = products.find(p => p.id === parseInt(id || "0"));
    if (foundProduct) {
      setProduct(foundProduct);
      setSelectedColor(foundProduct.colors[0]);
      setSelectedSize(foundProduct.sizes[0]);
    }

    const allComments = getComments();
    const productComments = allComments.filter(c => 
      c.productId === parseInt(id || "0") && c.status === 'approved'
    );
    setComments(productComments);
  }, [id]);

  const handleAddComment = () => {
    if (!newComment.user.trim() || !newComment.comment.trim()) {
      toast({
        title: "Hata",
        description: "Lütfen adınızı ve yorumunuzu girin.",
        variant: "destructive"
      });
      return;
    }

    addComment({
      productId: parseInt(id || "0"),
      user: newComment.user,
      comment: newComment.comment,
      rating: newComment.rating
    });

    setNewComment({ user: "", comment: "", rating: 5 });
    
    toast({
      title: "Başarılı",
      description: "Yorumunuz alınmıştır. Onaylandıktan sonra görüntülenecektir."
    });
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-stone-100">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-stone-900 mb-4">Ürün bulunamadı</h1>
            <Button onClick={() => navigate("/")} className="bg-stone-900 hover:bg-stone-800">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Ana Sayfaya Dön
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-stone-100">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button 
          onClick={() => navigate(-1)}
          variant="ghost" 
          className="mb-6 text-stone-600 hover:text-stone-900"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Geri Dön
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-2xl bg-white shadow-lg">
              <img
                src={product.images[currentImageIndex]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`aspect-square overflow-hidden rounded-lg border-2 transition-all ${
                      index === currentImageIndex 
                        ? "border-stone-900 ring-2 ring-stone-200" 
                        : "border-stone-200 hover:border-stone-400"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-stone-900 mb-4">
                {product.name}
              </h1>
              <div className="flex items-center space-x-4 mb-6">
                <span className="text-3xl font-bold text-stone-900">₺{product.price}</span>
                <div className="flex items-center space-x-1">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-5 w-5 ${
                          star <= product.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-stone-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-stone-600">({product.reviewCount} değerlendirme)</span>
                </div>
              </div>
              <p className="text-stone-600 text-lg leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Color Selection */}
            <div>
              <h3 className="text-lg font-semibold text-stone-900 mb-3">Renk</h3>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 rounded-full border transition-all ${
                      selectedColor === color
                        ? "border-stone-900 bg-stone-900 text-white"
                        : "border-stone-300 bg-white text-stone-700 hover:border-stone-500"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div>
              <h3 className="text-lg font-semibold text-stone-900 mb-3">Beden</h3>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 rounded-full border transition-all ${
                      selectedSize === size
                        ? "border-stone-900 bg-stone-900 text-white"
                        : "border-stone-300 bg-white text-stone-700 hover:border-stone-500"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Purchase Button */}
            <div className="pt-6">
              <Button
                onClick={() => window.open(product.shopierLink, '_blank')}
                className="w-full bg-stone-900 hover:bg-stone-800 text-white py-4 text-lg rounded-full transition-all transform hover:scale-105"
                size="lg"
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Satın Al - ₺{product.price}
              </Button>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Add Comment */}
          <Card className="bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Send className="h-5 w-5 mr-2" />
                Yorum Yap
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="userName">Adınız</Label>
                <Input
                  id="userName"
                  value={newComment.user}
                  onChange={(e) => setNewComment({...newComment, user: e.target.value})}
                  placeholder="Adınızı girin"
                />
              </div>

              <div>
                <Label htmlFor="rating">Puan</Label>
                <div className="flex space-x-1 mt-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setNewComment({...newComment, rating: star})}
                      className="p-1"
                    >
                      <Star
                        className={`h-6 w-6 transition-colors ${
                          star <= newComment.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-stone-300 hover:text-yellow-400"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="comment">Yorumunuz</Label>
                <Textarea
                  id="comment"
                  value={newComment.comment}
                  onChange={(e) => setNewComment({...newComment, comment: e.target.value})}
                  placeholder="Ürün hakkındaki düşüncelerinizi paylaşın..."
                  rows={4}
                />
              </div>

              <Button 
                onClick={handleAddComment}
                className="w-full bg-stone-900 hover:bg-stone-800"
              >
                <Send className="h-4 w-4 mr-2" />
                Yorum Gönder
              </Button>
            </CardContent>
          </Card>

          {/* Comments List */}
          <Card className="bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Müşteri Yorumları ({comments.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {comments.length === 0 ? (
                  <p className="text-stone-500 text-center py-8">
                    Henüz yorum yapılmamış. İlk yorumu siz yapın!
                  </p>
                ) : (
                  comments.map((comment) => (
                    <div key={comment.id} className="border-b border-stone-200 pb-4 last:border-b-0">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-stone-900">{comment.user}</h4>
                        <span className="text-sm text-stone-500">{comment.date}</span>
                      </div>
                      <div className="flex items-center mb-2">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-4 w-4 ${
                                star <= comment.rating
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-stone-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-stone-600">{comment.comment}</p>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetail;
