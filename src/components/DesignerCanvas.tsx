import { useRef, useState } from "react";
import { Rnd } from "react-rnd";

const DesignerCanvas = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState({ width: 200, height: 200 });
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="relative w-full max-w-md mx-auto border border-dashed border-gray-400 rounded-md p-4 bg-white">
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        ref={inputRef}
        className="hidden"
      />
      <div
        onClick={() => inputRef.current?.click()}
        className="w-full h-96 bg-gray-100 relative cursor-pointer"
      >
        {image ? (
          <Rnd
            size={{ width: dimensions.width, height: dimensions.height }}
            position={{ x: position.x, y: position.y }}
            onDragStop={(e, d) => {
              setPosition({ x: d.x, y: d.y });
            }}
            onResizeStop={(e, direction, ref, delta, position) => {
              setDimensions({
                width: ref.offsetWidth,
                height: ref.offsetHeight,
              });
              setPosition(position);
            }}
            bounds="parent"
            enableResizing={{
              bottom: true,
              bottomLeft: true,
              bottomRight: true,
              left: true,
              right: true,
              top: true,
              topLeft: true,
              topRight: true,
            }}
          >
            <img
              src={image}
              alt="uploaded"
              style={{ width: "100%", height: "100%", pointerEvents: "auto" }}
              draggable={false}
            />
          </Rnd>
        ) : (
          <p className="text-gray-500 flex items-center justify-center h-full">
            Tişört üzerine resim eklemek için tıkla
          </p>
        )}
      </div>
    </div>
  );
};

export default DesignerCanvas;
