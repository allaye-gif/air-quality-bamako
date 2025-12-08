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

  const handlePrint = () => {
    const originalTitle = document.title;
    const safeDate = data.date.replace(/[\/\\:*?"<>|]/g, '-');
    const filename = `Bulletin Qualité de l'air du ${safeDate}`;
    
    document.title = filename;

    setTimeout(() => {
      window.print();
      setTimeout(() => {
        document.title = originalTitle;
      }, 500);
    }, 500);
  };

  const advice = getHealthAdvice(data.cityMaxAQI);

  return (
    <div className="flex flex-col items-center bg-slate-100 min-h-screen p-8">
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

          .no-print { display: none !important; }
          
          #root, .min-h-screen {
            margin: 0;
            padding: 0;
            background: white;
            height: auto;
            display: block;
          }

          #bulletin-content {
            margin: 0 !important;
            padding: 10mm !important;
            width: 210mm !important;
            height: 297mm !important; /* Limite à une seule page */
            box-shadow: none !important;
            border: none !important;
            position: absolute;
            top: 0;
            left: 0;
            background: white;
            overflow: hidden; /* Empêche les débordements */
          }

          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          
          section, table, .grid {
            page-break-inside: avoid;
          }
        }

        @media screen {
          #bulletin-content {
            width: 210mm;
            min-height: 296mm;
            background: white;
            margin: 0 auto;
            box-sizing: border-box;
          }
        }
      `}</style>
      
      <div className="flex gap-4 mb-8 sticky top-4 z-50 bg-white/90 backdrop-blur p-3 rounded-full shadow-lg border no-print">
        <Button variant="outline" onClick={onReset} className="rounded-full">
          Nouveau
        </Button>
        <Button onClick={handlePrint} className="bg-blue-900 hover:bg-blue-800 text-white rounded-full gap-2">
          <Printer className="w-4 h-4" />
          Imprimer / Enregistrer PDF
        </Button>
      </div>

      <div className="shadow-2xl mb-20 bg-white rounded-lg overflow-hidden">
        <div 
          ref={contentRef}
          id="bulletin-content"
          className="relative text-slate-800 flex flex-col p-[15mm] box-border"
        >
          {/* HEADER */}
          <header className="relative z-10 bg-white flex justify-between items-start border-b-2 border-blue-900 pb-4 mb-6">
            <div className="w-1/4 flex flex-col items-center justify-center">
               <div className="w-24 h-24 rounded-full overflow-hidden flex items-center justify-center bg-white border border-slate-100 shadow-sm relative z-20">
                 <img 
                   src={logoMaliMeteo} 
                   alt="Logo MALI METEO" 
                   className="w-full h-full object-cover scale-110" 
                 />
               </div>
            </div>
            
            <div className="w-2/4 text-center pt-2 relative z-20 bg-white">
              <h2 className="text-xs uppercase tracking-[0.2em] text-slate-500 mb-1">République du Mali</h2>
              <h3 className="text-[10px] italic text-slate-400 mb-2">Un Peuple - Un But - Une Foi</h3>
              <h1 className="text-3xl font-bold text-blue-900 uppercase font-serif leading-tight mb-2 bg-white">Bulletin<br/>Qualité de l'Air</h1>
              <div className="text-xs font-bold text-blue-600 uppercase tracking-wide px-4 py-0.5 bg-blue-50 rounded-full inline-block border border-blue-100 relative z-20">
                Zone de Bamako
              </div>
            </div>

            <div className="w-1/4 text-right pt-4 relative z-20 bg-white">
              <div className="text-[10px] uppercase text-slate-400 mb-1 font-medium">Date du relevé</div>
              <div className="font-bold text-xl text-blue-900 border-l-4 border-blue-900 pl-3">
                {data.date}
              </div>
              <div className="text-[10px] text-slate-500 mt-1 font-medium flex justify-end items-center gap-1">
                <Activity className="w-3 h-3 text-green-500" /> Validité: 24h
              </div>
            </div>
          </header>

          {/* SUMMARY SECTION */}
          <section className="mb-8">
            <div className="flex items-stretch bg-gradient-to-r from-slate-50 to-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="w-1/3 p-6 flex flex-col items-center justify-center border-r border-slate-100">
                <div className="text-xs font-bold text-slate-400 uppercase mb-2 tracking-wider">Indice Global</div>
                <div className="relative">
                  <div 
                    className="w-24 h-24 rounded-full flex items-center justify-center text-4xl font-bold text-white shadow-lg mb-3 relative z-10 border-4 border-white"
                    style={{ backgroundColor: getStatusColor(data.cityMaxAQI) }}
                  >
                    {data.cityMaxAQI}
                  </div>
                </div>
                <div className="font-bold text-lg uppercase tracking-tight" style={{ color: getStatusColor(data.cityMaxAQI) }}>
                  {getAQILabel(data.cityMaxAQI)}
                </div>
              </div>
              <div className="w-2/3 p-8 flex flex-col justify-center">
                <h3 className="font-bold text-blue-900 uppercase mb-3 text-sm flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Synthèse de la journée
                </h3>
                <p className="text-sm text-slate-700 text-justify leading-relaxed font-medium">
                  L'indice de qualité de l'air (AQI) atteint un maximum de <strong className="text-blue-900 text-lg">{data.cityMaxAQI}</strong> aujourd'hui. 
                  La qualité de l'air est qualifiée de <strong style={{ color: getStatusColor(data.cityMaxAQI) }}>{getAQILabel(data.cityMaxAQI).toLowerCase()}</strong>.
                  <br/><br/>
                  Le polluant majoritaire observé sur le réseau de surveillance est le <strong className="bg-slate-100 px-2 py-0.5 rounded text-slate-900">{data.stations.find(s => s.aqi === data.cityMaxAQI)?.mainPollutant}</strong>.
                </p>
              </div>
            </div>
          </section>

          {/* DATA TABLE */}
          <section className="mb-8 flex-grow">
            <h3 className="font-bold text-blue-900 uppercase mb-4 text-sm border-b border-slate-200 pb-2 flex items-center gap-2">
              <Wind className="w-4 h-4" />
              Détails du Réseau de Surveillance
            </h3>
            <div className="overflow-hidden rounded-xl border border-slate-200 shadow-sm">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-800 text-white">
                    <th className="p-3 text-left font-medium">Station</th>
                    <th className="p-3 text-center font-medium">AQI</th>
                  </tr>
                </thead>
                <tbody>
                  {data.stations.map((s, i) => (
                    <tr key={i} className="text-slate-700 odd:bg-white even:bg-slate-50 border-b border-slate-100 last:border-0 hover:bg-blue-50">
                      <td className="p-3 font-bold text-slate-800 truncate">{s.name}</td>
                      <td className="p-3 text-center">{s.aqi}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* FOOTER */}
          <footer className="mt-auto text-center border-t-2 border-blue-900 pt-4">
            <p className="font-bold text-blue-900 text-[11px] uppercase mb-1">Agence Nationale de la Météorologie (MALI MÉTÉO)</p>
          </footer>

        </div>
      </div>
    </div>
  );
}