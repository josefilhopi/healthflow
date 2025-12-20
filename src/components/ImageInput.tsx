"use client";

import React, { useState, useRef, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Upload } from "lucide-react";
import { toast } from "sonner";

interface ImageInputProps {
  label: string;
  currentImage?: string; // URL ou Base64 da imagem atual
  onImageChange: (file: File | null) => void;
  fallbackText: string; // Texto para o AvatarFallback (ex: iniciais do nome)
}

export function ImageInput({ label, currentImage, onImageChange, fallbackText }: ImageInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewImage, setPreviewImage] = useState<string | undefined>(currentImage);

  React.useEffect(() => {
    setPreviewImage(currentImage);
  }, [currentImage]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        toast.error("Erro ao carregar imagem", {
          description: "O tamanho da imagem não pode exceder 2MB.",
        });
        onImageChange(null);
        setPreviewImage(undefined);
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
      onImageChange(file);
    } else {
      setPreviewImage(currentImage);
      onImageChange(null);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleCameraCapture = () => {
    toast.info("Funcionalidade em desenvolvimento", {
      description: "A captura de foto pela câmera será implementada em breve.",
    });
    // Implementar lógica de acesso à câmera aqui no futuro
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex items-center gap-4">
        <Avatar className="h-20 w-20">
          <AvatarImage src={previewImage} alt="Avatar" />
          <AvatarFallback className="bg-muted-foreground/20 text-muted-foreground text-xl font-semibold">
            {fallbackText}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-2">
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <Button type="button" variant="outline" size="sm" onClick={handleUploadClick}>
            <Upload className="h-4 w-4 mr-2" />
            Escolher Foto
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={handleCameraCapture}>
            <Camera className="h-4 w-4 mr-2" />
            Capturar Foto
          </Button>
        </div>
      </div>
    </div>
  );
}