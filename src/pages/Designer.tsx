import { useState, useRef, ChangeEvent, FormEvent } from "react";
import { Rnd } from "react-rnd";
import html2canvas from "html2canvas";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Constants
const tshirtSides = [
  { id: "front", label: "Ön", imgSrc: "/images/ön.png" },
  { id: "back", label: "Arka", imgSrc: "/images/arka.png" },
  { id: "inside_neck", label: "İç Boyun", imgSrc: "/images/ic-boyun.png" },
  { id: "outside_neck", label: "Dış Boyun", imgSrc: "/images/dis-boyun.png" },
  { id: "left_sleeve", label: "Sol Kol", imgSrc: "/images/sol-kol.png" },
  { id: "right_sleeve", label: "Sağ Kol", imgSrc: "/images/sag-kol.png" },
];

const tshirtColors = [
  { id: "white", label: "Beyaz", colorCode: "#ffffff" },
  { id: "black", label: "Siyah", colorCode: "#000000" },
  { id: "red", label: "Kırmızı", colorCode: "#f44336" },
  { id: "blue", label: "Mavi", colorCode: "#2196f3" },
  { id: "green", label: "Yeşil", colorCode: "#4caf50" },
  { id: "yellow", label: "Sarı", colorCode: "#ffeb3b" },
  { id: "orange", label: "Turuncu", colorCode: "#ff9800" },
];

const tshirtSizes = ["S", "M", "L", "XL", "XXL"];

// Types
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

type LoadedDesign = {
  tshirt: any;
  designs: DesignItem[];
  tshirtImage: string;
  timestamp: string;
};

export default function App() {
  const [mode, setMode] = useState<"select" | "upload" | "preview" | "create">("select");
  const [jsonFile, setJsonFile] = useState<File | null>(null);
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [jsonContent, setJsonContent] = useState<LoadedDesign | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    address: "",
    message: "",
  });

  const [selectedSide, setSelectedSide] = useState("front");
  const [designItems, setDesignItems] = useState<DesignItem[]>([]);
  const [selectedColor, setSelectedColor] = useState(tshirtColors[0].colorCode);
  const [selectedSize, setSelectedSize] = useState(tshirtSizes[1]);
  const [selectedTextColor, setSelectedTextColor] = useState("#000000");
  const [previewMode, setPreviewMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const tshirtRef = useRef<HTMLDivElement>(null);

  const [loadedDesign, setLoadedDesign] = useState<LoadedDesign | null>(null);
  const [userInfo, setUserInfo] = useState<{ name: string; surname: string; address: string; message: string } | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setJsonError(null);
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.name.endsWith(".json")) {
      setJsonError("Lütfen JSON dosyası seçin.");
      setJsonFile(null);
      setJsonContent(null);
      return;
    }
    setJsonFile(file);

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const text = evt.target?.result as string;
        const data = JSON.parse(text);
        if (!data.tshirt || !data.designs) {
          setJsonError("Geçersiz tasarım dosyası.");
          setJsonContent(null);
          return;
        }
        setJsonContent(data);
      } catch {
        setJsonError("Dosya JSON olarak okunamadı.");
        setJsonContent(null);
      }
    };
    reader.readAsText(file);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!jsonContent) {
      alert("Lütfen geçerli bir JSON dosyası yükleyin.");
      return;
    }
    if (!formData.name || !formData.surname || !formData.address) {
      alert("Lütfen tüm zorunlu alanları doldurun.");
      return;
    }

    setIsSubmitting(true);
    try {
      // Create preview image
      setPreviewMode(true);
      await new Promise((res) => setTimeout(res, 100));
      
      const canvas = await html2canvas(tshirtRef.current!, {
        scrollX: -window.scrollX,
        scrollY: -window.scrollY,
        useCORS: true,
      });
      const previewImage = canvas.toDataURL("image/png");
      setPreviewMode(false);

      // Prepare data for API
      const designData = {
        userInfo: formData,
        designData: {
          tshirt: {
            color: selectedColor,
            size: selectedSize,
          },
          items: designItems,
          previewImage,
        },
      };

      // Send to API
      const response = await fetch('/api/saveDesign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(designData),
      });

      if (!response.ok) {
        throw new Error('Tasarım kaydedilemedi');
      }

      const result = await response.json();
      console.log('Design saved:', result);

      // Show preview
      setLoadedDesign(jsonContent);
      setUserInfo(formData);
      setMode("preview");

      alert("Tasarım başarıyla gönderildi ve admin onayına sunuldu!");
    } catch (error) {
      console.error('Error saving design:', error);
      alert("Tasarım gönderilirken bir hata oluştu: " + (error as Error).message);
    } finally {
      setPreviewMode(false);
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          const newItem: DesignItem = {
            id: Date.now().toString(),
            type: "image",
            content: reader.result,
            x: 50,
            y: 50,
            width: 100,
            height: 100,
            side: selectedSide,
          };
          setDesignItems((prev) => [...prev, newItem]);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const addTextItem = () => {
    const text = prompt("Eklemek istediğiniz metni yazın:");
    if (!text) return;

    const newItem: DesignItem = {
      id: Date.now().toString(),
      type: "text",
      content: text,
      color: selectedTextColor,
      x: 50,
      y: 50,
      width: 150,
      height: 50,
      side: selectedSide,
    };
    setDesignItems((prev) => [...prev, newItem]);
  };

  const updateDesignItem = (
    id: string,
    data: Partial<Omit<DesignItem, "id" | "type" | "content">>
  ) => {
    setDesignItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, ...data, side: selectedSide } : item
      )
    );
  };

  const deleteDesignItem = (id: string) => {
    setDesignItems((items) => items.filter((item) => item.id !== id));
  };

  const handleSideChange = (sideId: string) => {
    setSelectedSide(sideId);
  };

  const saveDesign = async () => {
    if (!tshirtRef.current) return;

    try {
      setPreviewMode(true);
      await new Promise((res) => setTimeout(res, 100));

      const canvas = await html2canvas(tshirtRef.current, {
        scrollX: -window.scrollX,
        scrollY: -window.scrollY,
        useCORS: true,
      });

      const tshirtImage = canvas.toDataURL("image/png");

      const designData = {
        tshirt: {
          color: {
            code: selectedColor,
            name:
              tshirtColors.find((c) => c.colorCode === selectedColor)?.label ||
              "Bilinmeyen",
          },
          size: selectedSize,
          side: {
            id: selectedSide,
            name:
              tshirtSides.find((s) => s.id === selectedSide)?.label || "Bilinmeyen",
          },
        },
        designs: designItems.map((item) => ({
          type: item.type,
          content: item.type === "text" ? item.content : "image",
          color: item.color,
          position: {
            x: item.x,
            y: item.y,
            width: item.width,
            height: item.height,
          },
          side: {
            id: item.side,
            name:
              tshirtSides.find((s) => s.id === item.side)?.label || "Bilinmeyen",
          },
        })),
        tshirtImage: tshirtImage,
        timestamp: new Date().toISOString(),
      };

      const dataStr = JSON.stringify(designData, null, 2);
      const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

      const exportFileDefaultName = `tshirt-design-${new Date()
        .toISOString()
        .slice(0, 10)}.json`;

      const linkElement = document.createElement("a");
      linkElement.setAttribute("href", dataUri);
      linkElement.setAttribute("download", exportFileDefaultName);
      linkElement.click();

      alert("Tasarım başarıyla kaydedildi ve indirildi.");
    } catch (err) {
      console.error("Kaydetme hatası:", err);
      alert("Bir hata oluştu: " + (err as Error).message);
    } finally {
      setPreviewMode(false);
    }
  };

  // Render functions
  const renderSelectScreen = () => (
    <div className="flex flex-col items-center justify-center min-h-screen gap-8 bg-stone-100">
      <h1 className="text-4xl font-bold mt-20">Tişört Tasarım Atolyesi</h1>
      <div className="flex gap-6">
        <button
          onClick={() => setMode("upload")}
          className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition"
        >
          Tasarım Yükle
        </button>
        <button
          onClick={() => setMode("create")}
          className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 transition"
        >
          Tasarım Oluştur
        </button>
      </div>
    </div>
  );

  const renderUploadScreen = () => (
    <div className="max-w-md mx-auto p-4 bg-white rounded shadow mt-10">
      <button onClick={() => setMode("select")} className="mb-4 text-blue-600 underline">
        {"< Geri"}
      </button>
      <h2 className="text-2xl font-bold mb-4">Tasarım Yükle</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block mb-1 font-semibold">JSON Dosyası</label>
          <input type="file" accept=".json" onChange={handleFileChange} />
          {jsonError && <p className="text-red-600 mt-1">{jsonError}</p>}
          {jsonContent && (
            <p className="text-green-600 mt-1">Dosya başarıyla yüklendi: {jsonFile?.name}</p>
          )}
        </div>

        <div>
          <label className="block mb-1 font-semibold">İsim*</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            className="w-full border rounded px-2 py-1"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Soyisim*</label>
          <input
            type="text"
            name="surname"
            value={formData.surname}
            onChange={handleInputChange}
            required
            className="w-full border rounded px-2 py-1"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Adres*</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            required
            className="w-full border rounded px-2 py-1"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Mesaj</label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            rows={3}
            className="w-full border rounded px-2 py-1"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
        >
          {isSubmitting ? "Gönderiliyor..." : "Gönder ve Tasarımı Görüntüle"}
        </button>
      </form>
    </div>
  );

  const renderPreviewScreen = () => (
    <div className="max-w-md mx-auto p-4 bg-white rounded shadow mt-10">
      <button onClick={() => setMode("select")} className="mb-4 text-blue-600 underline">
        {"< Geri"}
      </button>

      <h2 className="text-2xl font-bold mb-4">Yüklenen Tasarım</h2>

      <p>
        <strong>İsim:</strong> {userInfo?.name} {userInfo?.surname}
      </p>
      <p>
        <strong>Adres:</strong> {userInfo?.address}
      </p>
      {userInfo?.message && (
        <p>
          <strong>Mesaj:</strong> {userInfo.message}
        </p>
      )}

      <div className="mt-4 border rounded p-2">
        <img src={loadedDesign?.tshirtImage} alt="Tişört Tasarımı" className="w-full object-contain" />
      </div>

      <p className="mt-4 text-gray-700 text-sm">
        Tasarım Zamanı: {new Date(loadedDesign?.timestamp || "").toLocaleString()}
      </p>
    </div>
  );

  const renderCreateScreen = () => (
    <div className="p-4 mt-10">
      <button onClick={() => setMode("select")} className="mb-4 text-blue-600 underline">
        {"< Geri"}
      </button>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Left panel */}
        <div className="md:w-1/4 bg-white rounded p-4 shadow">
          <h3 className="font-semibold mb-2">Tişört Rengi</h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {tshirtColors.map((color) => (
              <button
                key={color.id}
                onClick={() => setSelectedColor(color.colorCode)}
                className={`w-8 h-8 rounded-full border-2 ${
                  selectedColor === color.colorCode ? "border-black" : "border-transparent"
                }`}
                style={{ backgroundColor: color.colorCode }}
                title={color.label}
              />
            ))}
          </div>

          <h3 className="font-semibold mb-2">Tişört Büyüklüğü</h3>
          <select
            value={selectedSize}
            onChange={(e) => setSelectedSize(e.target.value)}
            className="w-full mb-4 border rounded px-2 py-1"
          >
            {tshirtSizes.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>

          <h3 className="font-semibold mb-2">Tişört Yüzü</h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {tshirtSides.map((side) => (
              <button
                key={side.id}
                onClick={() => handleSideChange(side.id)}
                className={`px-2 py-1 rounded border ${
                  selectedSide === side.id ? "border-black font-bold" : "border-gray-300"
                }`}
              >
                {side.label}
              </button>
            ))}
          </div>

          <h3 className="font-semibold mb-2">Yazı Rengi</h3>
          <input
            type="color"
            value={selectedTextColor}
            onChange={(e) => setSelectedTextColor(e.target.value)}
            className="w-full mb-4 h-8 cursor-pointer"
          />

          <div className="flex flex-col gap-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            >
              Resim Yükle
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <button
              onClick={addTextItem}
              className="bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
            >
              Metin Ekle
            </button>
            <button
              onClick={saveDesign}
              className="bg-purple-600 text-white py-2 rounded hover:bg-purple-700 transition"
            >
              Tasarımı Kaydet
            </button>
          </div>
        </div>

        {/* Right panel (tshirt and design) */}
        <div
          ref={tshirtRef}
          className={`relative md:w-3/4 min-h-[500px] rounded shadow-lg p-4 transition-all ${
            previewMode ? "bg-white" : ""
          }`}
          style={{ backgroundColor: previewMode ? "#fff" : selectedColor }}
        >
          <img
            src={tshirtSides.find((s) => s.id === selectedSide)?.imgSrc}
            alt="Tişört Yüzü"
            className="w-full max-w-md mx-auto pointer-events-none select-none"
            draggable={false}
          />

          {/* Design elements */}
          {designItems
            .filter((item) => item.side === selectedSide)
            .map((item) => (
              <Rnd
                key={item.id}
                size={{ width: item.width, height: item.height }}
                position={{ x: item.x, y: item.y }}
                bounds="parent"
                onDragStop={(_, d) => updateDesignItem(item.id, { x: d.x, y: d.y })}
                onResizeStop={(_, __, ref, ___, position) =>
                  updateDesignItem(item.id, {
                    width: ref.offsetWidth,
                    height: ref.offsetHeight,
                    x: position.x,
                    y: position.y,
                  })
                }
                enableResizing={{ bottomRight: true, bottomLeft: false, topRight: false, topLeft: false }}
              >
                {item.type === "image" ? (
                  <img
                    src={item.content}
                    alt="Tasarım Resmi"
                    className="w-full h-full object-contain pointer-events-none"
                    draggable={false}
                  />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center"
                    style={{ color: item.color || "#000", fontWeight: "bold", fontSize: 16 }}
                  >
                    {item.content}
                  </div>
                )}
                {/* Delete button */}
                {!previewMode && (
                  <button
                    onClick={() => deleteDesignItem(item.id)}
                    className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 text-xs flex items-center justify-center"
                  >
                    &times;
                  </button>
                )}
              </Rnd>
            ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Header />

      {mode === "select" && renderSelectScreen()}
      {mode === "upload" && renderUploadScreen()}
      {mode === "preview" && renderPreviewScreen()}
      {mode === "create" && renderCreateScreen()}

      <Footer />
    </>
  );
}