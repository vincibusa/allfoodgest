import React, { useState, useRef, ChangeEvent } from 'react';
import { PhotoIcon, TrashIcon, ArrowUpTrayIcon } from '@heroicons/react/24/outline';
import { Button } from './Button';
import { uploadImmagine } from '../../services/uploadService';
import Image from 'next/image';

interface ImageUploadProps {
  initialImageUrl?: string;
  onImageUploaded: (url: string) => void;
  onImageRemoved?: () => void;
  className?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  initialImageUrl = '',
  onImageUploaded,
  onImageRemoved,
  className = '',
}) => {
  const [imageUrl, setImageUrl] = useState<string>(initialImageUrl);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (!file) return;
    
    // Verifica se il file è un'immagine
    if (!file.type.startsWith('image/')) {
      setError('Il file selezionato non è un&apos;immagine valida. Sono supportati formati come JPG, PNG, GIF.');
      return;
    }
    
    // Limita la dimensione del file (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('L&apos;immagine è troppo grande. La dimensione massima consentita è 5MB.');
      return;
    }
    
    // Crea un'anteprima locale
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setFilePreview(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
    
    setError(null);
    
    try {
      setIsUploading(true);
      
      // Carica l'immagine su Supabase Storage
      const uploadedImageUrl = await uploadImmagine(file);
      
      // Aggiorna lo stato e notifica il componente padre
      setImageUrl(uploadedImageUrl);
      onImageUploaded(uploadedImageUrl);
      
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'Si è verificato un errore durante il caricamento dell&apos;immagine');
      console.error('Errore durante il caricamento dell&apos;immagine:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleTriggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleRemoveImage = () => {
    setImageUrl('');
    setFilePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (onImageRemoved) {
      onImageRemoved();
    }
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm font-medium text-gray-700">
          Immagine di copertina
        </label>
        {(imageUrl || filePreview) && (
          <Button
            type="button"
            variant="danger"
            size="sm"
            icon={<TrashIcon className="h-4 w-4" />}
            onClick={handleRemoveImage}
          >
            Rimuovi
          </Button>
        )}
      </div>
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      
      {!imageUrl && !filePreview ? (
        <div
          onClick={handleTriggerFileInput}
          className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:border-teal-500 transition-colors"
        >
          <div className="space-y-1 text-center">
            <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
            <div className="flex text-sm text-gray-600">
              <p className="pl-1">Trascina un&apos;immagine qui o fai clic per selezionarne una</p>
            </div>
            <p className="text-xs text-gray-500">PNG, JPG, GIF fino a 5MB</p>
          </div>
        </div>
      ) : (
        <div className="mt-1 relative rounded-md overflow-hidden border border-gray-300 shadow-sm">
          <div className="relative w-full h-56">
            <Image
              src={filePreview || imageUrl}
              alt="Anteprima immagine"
              fill
              sizes="(max-width: 768px) 100vw, 600px"
              style={{ objectFit: 'cover' }}
              priority
            />
          </div>
          
          <div className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center opacity-0 hover:opacity-100 transition-opacity">
            <Button
              type="button"
              variant="outline"
              size="sm"
              icon={<ArrowUpTrayIcon className="h-4 w-4" />}
              onClick={handleTriggerFileInput}
              className="bg-white"
            >
              Cambia immagine
            </Button>
          </div>
        </div>
      )}
      
      {isUploading && (
        <div className="mt-2 flex items-center text-sm text-teal-600">
          <div className="mr-2 animate-spin h-4 w-4 border-t-2 border-teal-500 rounded-full"></div>
          Caricamento in corso...
        </div>
      )}
      
      {error && (
        <p className="mt-2 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}; 