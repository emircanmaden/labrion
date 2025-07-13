import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label"; // Label eklenmiş
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export const PasswordModal = ({ onSuccess }: { onSuccess: () => void }) => {
  const [password, setPassword] = useState("");
  const [open, setOpen] = useState(true);
  const { toast } = useToast();

  const handleSubmit = () => {
    if (password === "123") {
      localStorage.setItem("admin_authenticated", "true");
      setOpen(false);
      onSuccess();
    } else {
      toast({
        title: "Hata",
        description: "Yanlış şifre!",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Admin Girişi</DialogTitle> {/* text-2x1 -> text-2xl düzeltildi */}
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="password">Şifre</Label> {/* "sifre" -> "Şifre" yapıldı */}
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Şifreyi girin"
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
          </div>
          <Button onClick={handleSubmit} className="w-full">
            Giriş Yap
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};