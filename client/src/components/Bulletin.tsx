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
            margin: 5mm !important; /* Réduire les marges de la page */
          }
          
          body { 
            margin: 0;
            padding: 0;
            background: white;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          /* Hide non-printable elements */
          .no-print { display: none !important; }
          
          /* Main container reset for print */
          #root, .min-h-screen {
            margin: 0 !important;
            padding: 0 !important;
            background: white;
            height: auto;
            min-height: 0;
          }

          /* The bulletin sheet itself */
          #bulletin-content {
            margin: 0 !important;
            padding: 8mm !important; /* Réduit de 10mm à 8mm */
            width: 100% !important; /* Utiliser toute la largeur disponible */
            height: 100% !important; /* Utiliser toute la hauteur disponible */
            min-height: auto !important; /* Retirer min-height fixe */
            max-height: 100% !important; /* Empêcher le débordement */
            box-shadow: none !important;
            border: none !important;
            background: white;
            overflow: hidden !important; /* Empêcher tout débordement */
          }

          /* Print specific adjustments */
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          
          /* Prevent breaks inside key elements */
          section, table, .grid, tbody, tr {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
          
          /* Force single page */
          html, body {
            height: 100% !important;
            overflow: hidden !important;
          }
        }

        /* Web view styles */
        @media screen {
          #bulletin-content {
            width: 210mm;
            min-height: 297mm; /* Exactement A4 */
            max-height: 297mm; /* Limiter la hauteur */
            background: white;
            margin: 0 auto;
            box-sizing: border-box;
            overflow: hidden; /* Empêcher le débordement en mode web */
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
          className="relative text-slate-800 flex flex-col p-6" /* Réduire le padding */
        >
          {/* HEADER - Réduit */}
          <header className="relative z-10 bg-white flex justify-between items-start border-b-2 border-blue-900 pb-3 mb-4"> {/* Réduit mb-6 à mb-4 */}
            <div className="w-1/4 flex flex-col items-center justify-center">
               <div className="w-20 h-20 rounded-full overflow-hidden flex items-center justify-center bg-white border border-slate-100 shadow-sm relative z-20"> {/* Réduit de w-24/h-24 à w-20/h-20 */}
                 <img 
                   src={logoMaliMeteo} 
                   alt="Logo MALI METEO" 
                   className="w-full h-full object-cover scale-110" 
                 />
               </div>
            </div>
            
            <div className="w-2/4 text-center pt-2 relative z-20 bg-white">
              <h2 className="text-[10px] uppercase tracking-[0.15em] text-slate-500 mb-0.5">République du Mali</h2> {/* Réduit text-xs à text-[10px] */}
              <h3 className="text-[9px] italic text-slate-400 mb-1.5">Un Peuple - Un But - Une Foi</h3> {/* Réduit text-[10px] à text-[9px] */}
              <h1 className="text-2xl font-bold text-blue-900 uppercase font-serif leading-tight mb-1.5 bg-white">Bulletin<br/>Qualité de l'Air</h1> {/* Réduit text-3xl à text-2xl */}
              <div className="text-[10px] font-bold text-blue-600 uppercase tracking-wide px-3 py-0.5 bg-blue-50 rounded-full inline-block border border-blue-100 relative z-20">
                Zone de Bamako
              </div>
            </div>

            <div className="w-1/4 text-right pt-2 relative z-20 bg-white"> {/* Réduit pt-4 à pt-2 */}
              <div className="text-[9px] uppercase text-slate-400 mb-0.5 font-medium">Date du relevé</div> {/* Réduit text-[10px] à text-[9px] */}
              <div className="font-bold text-lg text-blue-900 border-l-4 border-blue-900 pl-2"> {/* Réduit text-xl à text-lg */}
                {data.date}
              </div>
              <div className="text-[9px] text-slate-500 mt-0.5 font-medium flex justify-end items-center gap-1"> {/* Réduit text-[10px] à text-[9px] */}
                <Activity className="w-2.5 h-2.5 text-green-500" /> Validité: 24h {/* Réduit w-3/h-3 à w-2.5/h-2.5 */}
              </div>
            </div>
          </header>

          {/* SUMMARY SECTION - Réduit */}
          <section className="mb-4"> {/* Réduit mb-8 à mb-4 */}
            <div className="flex items-stretch bg-gradient-to-r from-slate-50 to-white border border-slate-200 rounded-xl overflow-hidden shadow-sm"> {/* Réduit rounded-2xl à rounded-xl */}
              <div className="w-1/3 p-4 flex flex-col items-center justify-center border-r border-slate-100"> {/* Réduit p-6 à p-4 */}
                <div className="text-[10px] font-bold text-slate-400 uppercase mb-1 tracking-wider">Indice Global</div> {/* Réduit text-xs à text-[10px] */}
                <div className="relative">
                  <div 
                    className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold text-white shadow-lg mb-2 relative z-10 border-4 border-white" /* Réduit w-24/h-24 à w-20/h-20, text-4xl à text-3xl */
                    style={{ backgroundColor: getStatusColor(data.cityMaxAQI) }}
                  >
                    {data.cityMaxAQI}
                  </div>
                </div>
                <div className="font-bold text-md uppercase tracking-tight" style={{ color: getStatusColor(data.cityMaxAQI) }}> {/* Réduit text-lg à text-md */}
                  {getAQILabel(data.cityMaxAQI)}
                </div>
              </div>
              <div className="w-2/3 p-6 flex flex-col justify-center"> {/* Réduit p-8 à p-6 */}
                <h3 className="font-bold text-blue-900 uppercase mb-2 text-xs flex items-center gap-2"> {/* Réduit text-sm à text-xs */}
                  <Activity className="w-4 h-4" /> {/* Réduit w-5/h-5 à w-4/h-4 */}
                  Synthèse de la journée
                </h3>
                <p className="text-xs text-slate-700 text-justify leading-relaxed font-medium"> {/* Réduit text-sm à text-xs */}
                  L'indice de qualité de l'air (AQI) atteint un maximum de <strong className="text-blue-900 text-md">{data.cityMaxAQI}</strong> aujourd'hui. {/* Réduit text-lg à text-md */}
                  La qualité de l'air est qualifiée de <strong style={{ color: getStatusColor(data.cityMaxAQI) }}>{getAQILabel(data.cityMaxAQI).toLowerCase()}</strong>.
                  <br/><br/>
                  Le polluant majoritaire observé sur le réseau de surveillance est le <strong className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-900 text-xs">{data.stations.find(s => s.aqi === data.cityMaxAQI)?.mainPollutant}</strong>.
                </p>
              </div>
            </div>
          </section>

          {/* DATA TABLE - Réduit */}
          <section className="mb-4 flex-grow"> {/* Réduit mb-8 à mb-4 */}
            <h3 className="font-bold text-blue-900 uppercase mb-2 text-xs border-b border-slate-200 pb-1 flex items-center gap-2"> {/* Réduit mb-4 à mb-2, text-sm à text-xs */}
              <Wind className="w-3.5 h-3.5" /> {/* Réduit w-4/h-4 à w-3.5/h-3.5 */}
              Détails du Réseau de Surveillance (Concentrations Max)
            </h3>
            <div className="overflow-hidden rounded-lg border border-slate-200 shadow-sm"> {/* Réduit rounded-xl à rounded-lg */}
              <table className="w-full text-[10px] border-collapse"> {/* Réduit text-xs à text-[10px] */}
                <thead>
                  <tr className="bg-slate-800 text-white">
                    <th className="p-2 text-left font-medium w-[25%]">Station</th> {/* Réduit p-3 à p-2 */}
                    <th className="p-2 text-center font-medium border-l border-slate-700 w-[10%]">NO2<br/><span className="opacity-60 text-[8px]">ppb</span></th> {/* Réduit p-3 à p-2 */}
                    <th className="p-2 text-center font-medium border-l border-slate-700 w-[10%]">SO2<br/><span className="opacity-60 text-[8px]">ppb</span></th>
                    <th className="p-2 text-center font-medium border-l border-slate-700 w-[10%]">CO<br/><span className="opacity-60 text-[8px]">ppb</span></th>
                    <th className="p-2 text-center font-medium border-l border-slate-700 w-[10%]">O3<br/><span className="opacity-60 text-[8px]">ppb</span></th>
                    <th className="p-2 text-center font-medium border-l border-slate-700 w-[10%]">PM2.5<br/><span className="opacity-60 text-[8px]">µg/m³</span></th>
                    <th className="p-2 text-center font-medium border-l border-slate-700 w-[10%]">PM10<br/><span className="opacity-60 text-[8px]">µg/m³</span></th>
                    <th className="p-2 text-center font-bold border-l border-slate-700 bg-blue-900 w-[15%]">AQI</th>
                  </tr>
                </thead>
                <tbody>
                  {data.stations.map((s, i) => (
                    <tr key={i} className="text-slate-700 odd:bg-white even:bg-slate-50 border-b border-slate-100 last:border-0 hover:bg-blue-50">
                      <td className="p-2 font-bold text-slate-800 truncate" title={s.name}> {/* Réduit p-3 à p-2 */}
                        {s.name.replace('ML_', '').replace(/_/g, ' ').replace('Qualité Air', '').replace('QA', '')}
                      </td>
                      <td className="p-2 text-center border-l border-slate-200">{s.maxNO2.toFixed(0)}</td>
                      <td className="p-2 text-center border-l border-slate-200">{s.maxSO2.toFixed(0)}</td>
                      <td className="p-2 text-center border-l border-slate-200">{s.maxCO.toFixed(0)}</td>
                      <td className="p-2 text-center border-l border-slate-200">{s.maxO3.toFixed(0)}</td>
                      <td className="p-2 text-center border-l border-slate-200">{s.maxPM25.toFixed(0)}</td>
                      <td className="p-2 text-center border-l border-slate-200">{s.maxPM10.toFixed(0)}</td>
                      <td className="p-2 text-center font-bold border-l border-slate-200 bg-blue-50/30">
                        <div className="flex items-center justify-center gap-1"> {/* Réduit gap-2 à gap-1 */}
                           <span className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: getStatusColor(s.aqi) }} /> {/* Réduit w-3/h-3 à w-2.5/h-2.5 */}
                           {s.aqi}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* ECO GESTE - Réduit */}
          <section className="mb-4 grid grid-cols-3 gap-3"> {/* Réduit mb-8 à mb-4, gap-4 à gap-3 */}
             <div className="col-span-2 bg-emerald-50 border border-emerald-100 rounded-lg p-3 flex items-center gap-3 shadow-sm"> {/* Réduit rounded-xl à rounded-lg, p-4 à p-3 */}
                <div className="bg-emerald-100 p-2 rounded-full text-emerald-700 flex-shrink-0"> {/* Réduit p-3 à p-2 */}
                   <Leaf className="w-5 h-5" /> {/* Réduit w-6/h-6 à w-5/h-5 */}
                </div>
                <div>
                   <h3 className="font-bold text-emerald-900 text-xs uppercase mb-0.5">Le Geste Eco-Citoyen</h3> {/* Réduit mb-1 à mb-0.5 */}
                   <p className="text-[10px] text-emerald-800 leading-snug"> {/* Réduit text-xs à text-[10px] */}
                      Privilégiez le covoiturage ou les transports en commun. Une voiture en moins = moins de pollution.
                   </p>
                </div>
             </div>
             <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 flex flex-col justify-center items-center text-center shadow-sm"> {/* Réduit rounded-xl à rounded-lg, p-4 à p-3 */}
                <div className="flex gap-1.5 mb-1.5 text-blue-400"> {/* Réduit gap-2 à gap-1.5, mb-2 à mb-1.5 */}
                   <Bike className="w-4 h-4" /> {/* Réduit w-5/h-5 à w-4/h-4 */}
                   <Car className="w-4 h-4 opacity-50" />
                </div>
                <div className="text-[9px] font-bold text-blue-800 uppercase">Mobilité Douce</div> {/* Réduit text-[10px] à text-[9px] */}
             </div>
          </section>

          {/* LEGEND & ADVICE GRID - Réduit */}
          <div className="grid grid-cols-2 gap-4 mb-3"> {/* Réduit gap-8 à gap-4, mb-4 à mb-3 */}
             {/* Legend */}
             <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm"> {/* Réduit rounded-xl à rounded-lg, p-5 à p-4 */}
                <h3 className="font-bold text-slate-700 uppercase mb-2 text-[10px] flex items-center gap-1 border-b pb-1.5"> {/* Réduit mb-3 à mb-2, text-[11px] à text-[10px] */}
                  <Info className="w-3.5 h-3.5" /> {/* Réduit w-4/h-4 à w-3.5/h-3.5 */}
                  Légende AQI (Indice de Qualité)
                </h3>
                <div className="grid grid-cols-2 gap-x-2 gap-y-1.5"> {/* Réduit gap-x-3 à gap-x-2, gap-y-2 à gap-y-1.5 */}
                  {[
                    { l: 'Bonne (0-50)', c: COLORS.good },
                    { l: 'Modérée (51-100)', c: COLORS.moderate },
                    { l: 'Médiocre (101-150)', c: COLORS.unhealthySens },
                    { l: 'Mauvaise (151-200)', c: COLORS.unhealthy },
                    { l: 'Très Mauv. (201-300)', c: COLORS.veryUnhealthy },
                    { l: 'Danger (300+)', c: COLORS.hazardous },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-1.5"> {/* Réduit gap-2 à gap-1.5 */}
                      <div className="w-2.5 h-2.5 rounded-full shadow-sm flex-shrink-0" style={{ backgroundColor: item.c }} /> {/* Réduit w-3/h-3 à w-2.5/h-2.5 */}
                      <span className="text-[9px] text-slate-600 font-medium whitespace-nowrap">{item.l}</span> {/* Réduit text-[10px] à text-[9px] */}
                    </div>
                  ))}
                </div>
             </div>

             {/* Advice */}
             <div className="bg-orange-50/50 border border-orange-100 rounded-lg p-4 shadow-sm"> {/* Réduit rounded-xl à rounded-lg, p-5 à p-4 */}
                <h3 className="font-bold text-orange-900 uppercase mb-2 text-[10px] flex items-center gap-1 border-b border-orange-200 pb-1.5">
                  <ThermometerSun className="w-3.5 h-3.5" /> {/* Réduit w-4/h-4 à w-3.5/h-3.5 */}
                  Recommandations
                </h3>
                <div className="space-y-2"> {/* Réduit space-y-3 à space-y-2 */}
                  <div>
                    <span className="text-[9px] font-bold uppercase text-orange-800 block mb-0.5 flex items-center gap-1"> {/* Réduit text-[10px] à text-[9px], mb-1 à mb-0.5 */}
                      <Activity className="w-2.5 h-2.5" /> {/* Réduit w-3/h-3 à w-2.5/h-2.5 */}
                      Population Générale
                    </span>
                    <p className="text-[9px] text-slate-700 leading-tight pl-3 border-l-2 border-orange-200">{advice.general}</p> {/* Réduit text-[10px] à text-[9px], pl-4 à pl-3 */}
                  </div>
                  <div>
                    <span className="text-[9px] font-bold uppercase text-orange-800 block mb-0.5 flex items-center gap-1">
                      <AlertTriangle className="w-2.5 h-2.5" /> {/* Réduit w-3/h-3 à w-2.5/h-2.5 */}
                      Personnes Vulnérables
                    </span>
                    <p className="text-[9px] text-slate-700 leading-tight pl-3 border-l-2 border-orange-200">{advice.sensitive}</p> {/* Réduit text-[10px] à text-[9px], pl-4 à pl-3 */}
                  </div>
                </div>
             </div>
          </div>

          {/* FOOTER - Réduit */}
          <footer className="mt-auto text-center border-t-2 border-blue-900 pt-3"> {/* Réduit pt-4 à pt-3 */}
            <p className="font-bold text-blue-900 text-[10px] uppercase mb-0.5">Agence Nationale de la Météorologie (MALI MÉTÉO)</p> {/* Réduit text-[11px] à text-[10px], mb-1 à mb-0.5 */}
            <p className="text-[9px] text-slate-500">
              
            </p>
            <p className="text-[8px] text-slate-400 mt-1 italic bg-slate-50 inline-block px-3 py-0.5 rounded-full"> {/* Réduit text-[9px] à text-[8px], mt-2 à mt-1 */}
              
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}