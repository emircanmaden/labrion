
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Star, Search, ShoppingBag } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getProducts, Product } from "@/utils/dataManager";

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const allProducts = getProducts();
    // Ana sayfada sadece ilk 3 ürünü göster
    const firstThreeProducts = allProducts.slice(0, 3);
    setProducts(firstThreeProducts);
    setFilteredProducts(firstThreeProducts);
  }, []);

  useEffect(() => {
    const filtered = products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  const handleProductClick = (productId: number) => {
    navigate(`/product/${productId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-stone-100">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-stone-300 bg-clip-text text-transparent">
              LABRION
            </h1>
            <p className="text-xl md:text-2xl text-stone-300 mb-8 max-w-2xl mx-auto">
              Asil ruhun yansıması, kaliteli kumaşlar ve özgün tasarımlar
            </p>
            <Button 
              className="bg-white text-stone-900 hover:bg-stone-100 text-lg px-8 py-3 rounded-full font-semibold transition-all transform hover:scale-105"
              onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Koleksiyonu Keşfet
            </Button>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-12 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Ürün ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-3 w-full rounded-full border-stone-200 focus:border-stone-400 focus:ring-stone-400"
            />
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-4">
              Öne Çıkan Ürünlerimiz
            </h2>
            <p className="text-lg text-stone-600 max-w-2xl mx-auto">
              En beğenilen ürünlerimizden seçmeler
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <Card 
                key={product.id} 
                className="group overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer border-0 bg-white/90 backdrop-blur-sm hover:scale-105"
                onClick={() => handleProductClick(product.id)}
              >
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-stone-900 text-white">
                      ₺{product.price}
                    </Badge>
                  </div>
                  <div className="absolute bottom-4 left-4 flex items-center space-x-1 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-full">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-white text-sm font-medium">{product.rating}</span>
                    <span className="text-white/70 text-sm">({product.reviewCount})</span>
                  </div>
                </div>
                
                <CardContent className="p-6">
                  <h3 className="font-semibold text-stone-900 mb-2 line-clamp-2 text-lg">
                    {product.name}
                  </h3>
                  <p className="text-stone-600 text-sm mb-4 line-clamp-2">
                    {product.description}
                  </p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex flex-wrap gap-1">
                      {product.colors.map((color) => (
                        <Badge key={color} variant="outline" className="text-xs">
                          {color}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {product.sizes.slice(0, 3).map((size) => (
                        <Badge key={size} variant="secondary" className="text-xs">
                          {size}
                        </Badge>
                      ))}
                      {product.sizes.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{product.sizes.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full bg-stone-900 hover:bg-stone-800 text-white rounded-full py-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleProductClick(product.id);
                    }}
                  >
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    İncele
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-stone-500 text-lg">Aradığınız kriterlere uygun ürün bulunamadı.</p>
            </div>
          )}

          <div className="text-center mt-12">
            <Button 
              onClick={() => navigate('/products')}
              className="bg-stone-900 hover:bg-stone-800 text-white px-8 py-3 rounded-full text-lg"
            >
              Tüm Ürünleri Gör
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
