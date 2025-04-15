import React from 'react';
import { useStatistiche } from '../../hooks/useStatistiche';
import { Card, Button } from '../ui';
import { ArrowPathIcon, DocumentTextIcon, ClockIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

interface StatisticheOverviewProps {
  className?: string;
  showRefreshButton?: boolean;
}

export const StatisticheOverview: React.FC<StatisticheOverviewProps> = ({
  className = '',
  showRefreshButton = true
}) => {
  const { statistiche, loading, error, refreshStatistiche } = useStatistiche();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
        <p className="text-sm text-red-700">{error}</p>
        <Button
          className="mt-2"
          variant="outline"
          size="sm"
          onClick={refreshStatistiche}
        >
          Riprova
        </Button>
      </div>
    );
  }

  const StatisticaCard = ({ title, value, icon, color }: { title: string; value: number; icon: React.ReactNode; color: string }) => (
    <Card className={`bg-${color}-50 border border-${color}-100`}>
      <div className="flex items-center">
        <div className={`p-3 rounded-lg bg-${color}-100 text-${color}-600 mr-4`}>
          {icon}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className={`text-2xl font-bold text-${color}-700`}>{value}</p>
        </div>
      </div>
    </Card>
  );

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">Statistiche Articoli</h2>
        {showRefreshButton && (
          <Button 
            variant="outline" 
            size="sm" 
            icon={<ArrowPathIcon className="h-4 w-4" />}
            onClick={refreshStatistiche}
            disabled={loading}
          >
            Aggiorna
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatisticaCard 
          title="Totale Articoli" 
          value={statistiche?.totaleArticoli || 0} 
          icon={<DocumentTextIcon className="h-5 w-5" />}
          color="blue"
        />
        <StatisticaCard 
          title="Articoli Pubblicati" 
          value={statistiche?.articoliPubblicati || 0} 
          icon={<CheckCircleIcon className="h-5 w-5" />}
          color="green"
        />
        <StatisticaCard 
          title="Articoli in Bozza" 
          value={statistiche?.articoliInBozza || 0} 
          icon={<ClockIcon className="h-5 w-5" />}
          color="amber"
        />
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Distribuzione per Categoria</h3>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {statistiche?.perCategoria && Object.entries(statistiche.perCategoria).length > 0 ? (
            <div className="divide-y divide-gray-200">
              {Object.entries(statistiche.perCategoria)
                .sort(([, a], [, b]) => (b as number) - (a as number))
                .map(([categoria, count]) => (
                  <div key={categoria} className="flex justify-between items-center p-4">
                    <span className="text-sm font-medium text-gray-700">{categoria}</span>
                    <div className="flex items-center">
                      <span className="text-sm text-gray-500 mr-3">{count} articoli</span>
                      <div className="w-32 bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-teal-600 h-2.5 rounded-full" 
                          style={{ 
                            width: `${Math.round((count as number) / (statistiche?.totaleArticoli || 1) * 100)}%` 
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <p className="text-center py-6 text-gray-500">Nessuna categoria trovata.</p>
          )}
        </div>
      </div>

      <div className="text-right text-xs text-gray-500 italic">
        Ultimo aggiornamento: {new Date().toLocaleString('it-IT')}
      </div>
    </div>
  );
}; 