'use client';

import DashboardLayout from '../../../components/layout/DashboardLayout';
import ArticoloForm from '../../../components/articoli/ArticoloForm';

export default function NuovoArticoloPage() {
  return (
    <DashboardLayout>
      <div className="space-y-5">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Crea nuovo articolo</h1>
        </div>

        <div className=" overflow-hidden  p-6">
          <ArticoloForm />
        </div>
      </div>
    </DashboardLayout>
  );
} 