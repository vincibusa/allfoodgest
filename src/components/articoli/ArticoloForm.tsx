import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Articolo, NuovoArticolo } from '../../types/articolo';
import { createArticolo, updateArticolo } from '../../services/articoliService';
import { ExclamationCircleIcon, PencilIcon, DocumentIcon, CalendarIcon, UserIcon } from '@heroicons/react/24/outline';
import { Input, Button, Select, Card, Textarea, ImageUpload } from '../ui';

interface ArticoloFormProps {
  articolo?: Articolo;
  isEditing?: boolean;
}

export default function ArticoloForm({ articolo, isEditing = false }: ArticoloFormProps) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [immagineUrl, setImmagineUrl] = useState<string>('');

  const categorieDisponibili = [
    { value: 'Politica', label: 'Politica' },
    { value: 'Economia', label: 'Economia' },
    { value: 'Tecnologia', label: 'Tecnologia' },
    { value: 'Sport', label: 'Sport' },
    { value: 'Cultura', label: 'Cultura' },
    { value: 'Scienza', label: 'Scienza' },
    { value: 'Salute', label: 'Salute' },
    { value: 'Altro', label: 'Altro' }
  ];

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<NuovoArticolo>({
    defaultValues: {
      titolo: '',
      contenuto: '',
      autore: '',
      categoria: '',
      data_pubblicazione: new Date().toISOString().slice(0, 10),
      pubblicato: false
    }
  });

  const pubblicato = watch('pubblicato');

  useEffect(() => {
    if (articolo && isEditing) {
      setValue('titolo', articolo.titolo);
      setValue('contenuto', articolo.contenuto);
      setValue('autore', articolo.autore);
      setValue('categoria', articolo.categoria);
      setValue('data_pubblicazione', articolo.data_pubblicazione.slice(0, 10));
      setValue('immagine_url', articolo.immagine_url || '');
      setValue('pubblicato', articolo.pubblicato);
      
      // Inizializza l'URL dell'immagine se disponibile
      if (articolo.immagine_url) {
        setImmagineUrl(articolo.immagine_url);
      }
    }
  }, [articolo, isEditing, setValue]);

  const handleImageUpload = (url: string) => {
    setImmagineUrl(url);
    setValue('immagine_url', url);
  };

  const handleImageRemove = () => {
    setImmagineUrl('');
    setValue('immagine_url', '');
  };

  const onSubmit = async (data: NuovoArticolo) => {
    setSubmitting(true);
    setError(null);

    try {
      // Se è stata caricata un'immagine, includila nei dati dell'articolo
      if (immagineUrl) {
        data.immagine_url = immagineUrl;
      }

      if (isEditing && articolo) {
        await updateArticolo(articolo.id, data);
      } else {
        await createArticolo(data);
      }
      router.push('/articoli');
    } catch (err: any) {
      setError(err.message || 'Si è verificato un errore durante il salvataggio dell\'articolo');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card 
      title={isEditing ? "Modifica articolo" : "Nuovo articolo"}
      subtitle={isEditing ? "Aggiorna le informazioni dell'articolo" : "Inserisci le informazioni per il nuovo articolo"}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {error && (
          <div className="rounded-md bg-red-50 p-4 border border-red-200">
            <div className="flex">
              <ExclamationCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Errore</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
          <div className="sm:col-span-6">
            <Input
              id="titolo"
              label="Titolo"
              placeholder="Inserisci il titolo dell'articolo"
              error={errors.titolo}
              icon={<DocumentIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />}
              {...register('titolo', { required: 'Il titolo è obbligatorio' })}
            />
          </div>

          <div className="sm:col-span-3">
            <Input
              id="autore"
              label="Autore"
              placeholder="Nome dell'autore"
              error={errors.autore}
              icon={<UserIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />}
              {...register('autore', { required: 'L\'autore è obbligatorio' })}
            />
          </div>

          <div className="sm:col-span-3">
            <Select
              id="categoria"
              label="Categoria"
              options={categorieDisponibili}
              emptyOptionLabel="Seleziona una categoria"
              error={errors.categoria}
              {...register('categoria', { required: 'La categoria è obbligatoria' })}
            />
          </div>

          <div className="sm:col-span-3">
            <Input
              id="data_pubblicazione"
              type="date"
              label="Data di pubblicazione"
              error={errors.data_pubblicazione}
              icon={<CalendarIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />}
              {...register('data_pubblicazione', { required: 'La data è obbligatoria' })}
            />
          </div>

          <div className="sm:col-span-3">
            <ImageUpload
              initialImageUrl={immagineUrl}
              onImageUploaded={handleImageUpload}
              onImageRemoved={handleImageRemove}
            />
          </div>

          <div className="sm:col-span-6">
            <Textarea
              id="contenuto"
              rows={12}
              label="Contenuto"
              placeholder="Scrivi qui il contenuto dell'articolo..."
              error={errors.contenuto}
              {...register('contenuto', { required: 'Il contenuto è obbligatorio' })}
            />
          </div>

          <div className="sm:col-span-6 pt-2">
            <div className="relative flex items-start">
              <div className="flex h-5 items-center">
                <input
                  id="pubblicato"
                  type="checkbox"
                  {...register('pubblicato')}
                  className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="pubblicato" className="font-medium text-gray-700">
                  Pubblica immediatamente
                </label>
                <p className="text-gray-500">
                  Se non selezionato, l'articolo verrà salvato come bozza.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-5 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
          <Button 
            type="button" 
            variant="secondary" 
            onClick={() => router.back()}
          >
            Annulla
          </Button>
          <Button
            type="submit"
            variant={pubblicato ? 'success' : 'primary'}
            isLoading={submitting}
            icon={<PencilIcon className="h-4 w-4" />}
          >
            {isEditing 
              ? 'Aggiorna articolo' 
              : pubblicato 
                ? 'Pubblica articolo' 
                : 'Salva come bozza'
            }
          </Button>
        </div>
      </form>
    </Card>
  );
} 