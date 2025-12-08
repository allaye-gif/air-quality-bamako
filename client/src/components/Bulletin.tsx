

import { useRef } from 'react';
import { DailySummary, getAQILabel, getHealthAdvice } from '@/lib/air-quality';
import { Printer, Activity, AlertTriangle, Info, ThermometerSun, Wind, Leaf, Bike, Car } from 'lucide-react';
import { Button } from '@/components/ui/button';
import logoMaliMeteo from '@assets/Logo_Mali_Meteo.png';

interface BulletinProps {
  data: DailySummary;
  onReset: () => void;
}

const COLORS = {
  good: '#4ade80',     
  moderate: '#facc15', 
  unhealthySens: '#fb923c', 
  unhealthy: '#f87171', 
  veryUnhealthy: '#a855f7', 
  hazardous: '#be123c', 
};

const getStatusColor = (aqi: number) => {
  if (aqi <= 50) return COLORS.good;
  if (aqi <= 100) return COLORS.moderate;
  if (aqi <= 150) return COLORS.unhealthySens;
  if (aqi <= 200) return COLORS.unhealthy;
  if (aqi <= 300) return COLORS.veryUnhealthy;
  return COLORS.hazardous;
};

export function Bulletin({ data, onReset }: BulletinProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  // ✅ Validation des données
  if (!data || !data.date) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-100">
        <div className="text-red-500 text-lg font-semibold">
          ⚠️ Données invalides ou manquantes
        </div>
      </div>
    );
  }

  // ✅ Fonction d'impression améliorée
  const handlePrint = () => {
    const originalTitle = document.title;
    const safeDate = data.date.replace(/[\/\\:*?"<>|]/g, '-');
    const filename = `Bulletin Qualité de l'air du ${safeDate}`;
    
    document.title = filename;

    requestAnimationFrame(() => {
      window.print();
      
      setTimeout(() => {
        document.title = originalTitle;
      }, 100);
    });
  };

  const advice = getHealthAdvice(data.cityMaxAQI);

  return (
    <div className="flex flex-col items-center bg-slate-100 min-h-screen p-4 md:p-8">
      {/* ✅ Styles d'impression complets */}
      <style>{`
        @media print {
          @page { 
            size: A4 portrait; 
            margin: 0; 
          }
          
          body {
            margin: 0;
            padding: 0;
            background: white;
          }
          
          .no-print {
            display: none !important;
          }
          
          .print-container {
            background: white;
            padding: 20px;
            box-shadow: none;
            page-break-after: avoid;
          }
          
          .print-section {
            page-break-inside: avoid;
            margin-bottom: 20px;
          }
          
          .print-table {
            width: 100%;
            border-collapse: collapse;
          }
          
          .print-table th,
          .print-table td {
            border: 1px solid #333;
            padding: 8px;
            text-align: left;
          }
          
          .print-table th {
            background-color: #f3f4f6;
            font-weight: bold;
          }
          
          .aqi-indicator {
            page-break-inside: avoid;
          }
          
          .recommendations {
            page-break-inside: avoid;
          }
        }
        
        @media (max-width: 768px) {
          .grid-responsive {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      {/* ✅ Boutons d'action (masqués à l'impression) */}
      <div className="no-print w-full max-w-4xl mb-6 flex gap-3 justify-end">
        <Button 
          onClick={handlePrint}
          variant="default"
          className="flex items-center gap-2"
          aria-label="Imprimer le bulletin"
        >
          <Printer className="w-4 h-4" />
          Imprimer le bulletin
        </Button>
        
        <Button 
          onClick={onReset}
          variant="outline"
          aria-label="Réinitialiser"
        >
          Réinitialiser
        </Button>
      </div>

      {/* ✅ Contenu principal du bulletin */}
      <div 
        ref={contentRef}
        className="print-container w-full max-w-4xl bg-white rounded-lg shadow-lg p-8"
        role="main"
        aria-label="Bulletin de qualité de l'air"
      >
        {/* En-tête */}
        <div className="print-section border-b-2 border-blue-900 pb-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <img 
              src={logoMaliMeteo} 
              alt="Logo Mali Météo" 
              className="h-12"
            />
            <div className="text-right">
              <p className="text-sm text-gray-600">MALI MÉTÉO</p>
              <p className="text-xs text-gray-500">Un Peuple - Un But - Une Foi</p>
            </div>
          </div>
          
          <h1 className="text-center text-2xl font-bold text-blue-900 mb-2">
            BULLETIN
          </h1>
          <h2 className="text-center text-xl font-bold text-blue-900 mb-4">
            QUALITÉ DE L'AIR
          </h2>
          
          <p className="text-center text-sm font-semibold text-blue-600 mb-2">
            {data.zone || 'ZONE DE BAMAKO'}
          </p>
          
          <div className="flex justify-between items-center text-xs text-gray-600">
            <span>Date: {data.date}</span>
            <span>Validité: 24h</span>
          </div>
        </div>

        {/* Indice Global */}
        <div className="print-section grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="aqi-indicator flex flex-col items-center justify-center p-6 bg-gray-50 rounded-lg">
            <p className="text-sm font-semibold text-gray-700 mb-3">INDICE GLOBAL</p>
            <div 
              className="w-32 h-32 rounded-full flex items-center justify-center text-white font-bold text-3xl shadow-md"
              style={{ backgroundColor: getStatusColor(data.cityMaxAQI) }}
              role="img"
              aria-label={`Indice AQI: ${data.cityMaxAQI}`}
            >
              {data.cityMaxAQI}
            </div>
            <p className="text-sm font-bold text-gray-700 mt-3 uppercase">
              {getAQILabel(data.cityMaxAQI)}
            </p>
          </div>

          {/* Synthèse de la journée */}
          <div className="print-section p-6 bg-blue-50 rounded-lg">
            <h3 className="text-sm font-bold text-blue-900 mb-3 flex items-center gap-2">
              <Info className="w-4 h-4" />
              SYNTHÈSE DE LA JOURNÉE
            </h3>
            <p className="text-sm text-gray-700 leading-relaxed mb-3">
              L'indice de qualité de l'air (AQI) atteint un maximum de{' '}
              <span className="font-bold">{data.cityMaxAQI}</span> aujourd'hui. 
              La qualité de l'air est qualifiée de{' '}
              <span className="font-bold uppercase">{getAQILabel(data.cityMaxAQI)}</span>.
            </p>
            <p className="text-sm text-gray-700">
              Le polluant majoritaire observé sur le réseau de surveillance est le{' '}
              <span className="font-bold">{data.mainPollutant || 'PM2.5'}</span>.
            </p>
          </div>
        </div>

        {/* Détail du réseau de surveillance */}
        <div className="print-section mb-6">
          <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Activity className="w-4 h-4" />
            DÉTAIL DU RÉSEAU DE SURVEILLANCE (CONCENTRATIONS MAX)
          </h3>
          
          <div className="overflow-x-auto">
            <table className="print-table w-full text-xs">
              <thead>
                <tr className="bg-blue-900 text-white">
                  <th className="p-2">Station</th>
                  <th className="p-2">NO₂ (µg/m³)</th>
                  <th className="p-2">SO₂ (µg/m³)</th>
                  <th className="p-2">CO (µg/m³)</th>
                  <th className="p-2">O₃ (µg/m³)</th>
                  <th className="p-2">PM2.5 (µg/m³)</th>
                  <th className="p-2">PM10 (µg/m³)</th>
                  <th className="p-2">AQI</th>
                </tr>
              </thead>
              <tbody>
                {data.stations && data.stations.length > 0 ? (
                  data.stations.map((station, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="p-2 font-semibold">{station.name}</td>
                      <td className="p-2">{station.no2 || '-'}</td>
                      <td className="p-2">{station.so2 || '-'}</td>
                      <td className="p-2">{station.co || '-'}</td>
                      <td className="p-2">{station.o3 || '-'}</td>
                      <td className="p-2">{station.pm25 || '-'}</td>
                      <td className="p-2">{station.pm10 || '-'}</td>
                      <td className="p-2">
                        <span 
                          className="inline-block w-6 h-6 rounded-full text-white text-xs font-bold flex items-center justify-center"
                          style={{ backgroundColor: getStatusColor(station.aqi) }}
                        >
                          {station.aqi}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="p-4 text-center text-gray-500">
                      Aucune donnée disponible
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recommandations */}
        <div className="print-section grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Geste Éco-Citoyen */}
          <div className="recommendations p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
            <h4 className="text-sm font-bold text-green-900 mb-3 flex items-center gap-2">
              <Leaf className="w-4 h-4" />
              LE GESTE ÉCO-CITOYEN
            </h4>
            <ul className="text-xs text-gray-700 space-y-2">
              <li className="flex gap-2">
                <span>🚗</span>
                <span>Privilégiez le covoiturage ou les transports en commun. Une voiture à moins = moins de pollution.</span>
              </li>
              <li className="flex gap-2">
                <span>🚴</span>
                <span>Utilisez le vélo ou la marche pour les courts trajets.</span>
              </li>
            </ul>
          </div>

          {/* Mobilité Douce */}
          <div className="recommendations p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
            <h4 className="text-sm font-bold text-blue-900 mb-3 flex items-center gap-2">
              <Bike className="w-4 h-4" />
              MOBILITÉ DOUCE
            </h4>
            <p className="text-xs text-gray-700">
              Encouragez les modes de transport non polluants pour réduire votre empreinte carbone.
            </p>
          </div>
        </div>

        {/* Légende et Recommandations de santé */}
        <div className="print-section grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Légende AQI */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              LÉGENDE AQI (INDICE DE QUALITÉ)
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: COLORS.good }}></div>
                <span>Bonne (0-50)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: COLORS.moderate }}></div>
                <span>Modérée (51-100)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: COLORS.unhealthySens }}></div>
                <span>Malsaine (101-150)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: COLORS.unhealthy }}></div>
                <span>Très Malsaine (151-200)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: COLORS.veryUnhealthy }}></div>
                <span>Dangereuse (201-300)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: COLORS.hazardous }}></div>
                <span>Extrêmement Dangereuse (300+)</span>
              </div>
            </div>
          </div>

          {/* Recommandations de santé */}
          <div className="recommendations p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
            <h4 className="text-sm font-bold text-yellow-900 mb-3 flex items-center gap-2">
              <ThermometerSun className="w-4 h-4" />
              RECOMMANDATIONS
            </h4>
            <div className="space-y-2 text-xs text-gray-700">
              <div>
                <p className="font-semibold text-yellow-900">👥 POPULATION GÉNÉRALE</p>
                <p>{advice?.general || 'Aucune restriction particulière.'}</p>
              </div>
              <div>
                <p className="font-semibold text-yellow-900">⚠️ PERSONNES VULNÉRABLES</p>
                <p>{advice?.vulnerable || 'Consultez un professionnel de santé si nécessaire.'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Pied de page */}
        <div className="print-section border-t-2 border-gray-300 pt-4 text-center text-xs text-gray-600">
          <p className="font-semibold">AGENCE NATIONALE DE LA MÉTÉOROLOGIE (MALI MÉTÉO)</p>
          <p className="text-gray-500 mt-1">
            Ce bulletin est établi à titre informatif. Pour plus d'informations, consultez les autorités compétentes.
          </p>
        </div>
      </div>
    </div>
  );
}