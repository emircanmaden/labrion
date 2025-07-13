
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Award, Truck, Shield } from "lucide-react";

const About = () => {
  const features = [
    {
      icon: Heart,
      title: "Kaliteli Malzeme",
      description: "%100 pamuk ve özenle seçilmiş kumaşlarla üretim"
    },
    {
      icon: Award,
      title: "Özgün Tasarım",
      description: "Her ürün özel olarak tasarlanmış ve sınırlı sayıda üretilmiş"
    },
    {
      icon: Truck,
      title: "Hızlı Teslimat",
      description: "Türkiye geneline hızlı ve güvenli kargo hizmeti"
    },
    {
      icon: Shield,
      title: "Güvenli Alışveriş",
      description: "Shopier güvencesi ile güvenli ödeme seçenekleri"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-stone-100">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-stone-900 mb-6">
            Hakkımızda
          </h1>
          <p className="text-xl text-stone-600 max-w-3xl mx-auto leading-relaxed">
            LABRION, asil ruhun yansıması olan kaliteli ve özgün tasarımlarla 
            stilinizi yansıtmanızı sağlayan bir T-shirt markasıdır.
          </p>
        </div>

        {/* Story Section */}
        <div className="mb-16">
          <Card className="bg-white/90 backdrop-blur-sm shadow-xl">
            <CardContent className="p-8 md:p-12">
              <h2 className="text-3xl font-bold text-stone-900 mb-6 text-center">
                Hikayemiz
              </h2>
              <div className="prose prose-lg max-w-none text-stone-700 space-y-4">
                <p>
                  LABRION, modern yaşamın hızına ayak uyduran, ancak geleneksel değerleri 
                  unutmayan bireyler için doğdu. Her ürünümüz, özgün tasarımlar ve kaliteli 
                  kumaşlarla özenle hazırlanır.
                </p>
                <p>
                  Markamızın temelinde, her bireyin kendini ifade etme özgürlüğü ve 
                  kaliteli ürünlere erişim hakkı yatar. Bu nedenle, her tasarımımızda 
                  hikaye anlatır, her ürünümüzde kaliteyi ön planda tutarız.
                </p>
                <p>
                  "Rebel Spirit" koleksiyonumuzdan "Dawn Whisper" serimize kadar, 
                  her ürün farklı ruh hallerini ve yaşam tarzlarını yansıtacak 
                  şekilde tasarlanmıştır.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-stone-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-stone-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-stone-600">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Vision Section */}
        <div className="text-center">
          <Card className="bg-gradient-to-r from-stone-900 to-stone-800 text-white">
            <CardContent className="p-8 md:p-12">
              <h2 className="text-3xl font-bold mb-6">
                Vizyonumuz
              </h2>
              <p className="text-xl text-stone-200 max-w-3xl mx-auto leading-relaxed">
                Türkiye'nin en sevilen T-shirt markası olmak ve her bireyin 
                kendi tarzını özgürce ifade edebileceği kaliteli ürünler sunmak.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default About;
