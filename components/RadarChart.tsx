
import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
  Tooltip
} from 'recharts';
import { Scores, Language } from '../types';
import { UI_TRANSLATIONS } from '../constants';

interface Props {
  scores: Scores;
  scoresLocal?: Scores;
  scoresOnline?: Scores;
  verdict: 'IN' | 'OUT';
  lang: Language;
}

const Chart: React.FC<Props> = ({ scores, scoresLocal, scoresOnline, verdict, lang }) => {
  const t = UI_TRANSLATIONS[lang];
  
  const data = [
    { subject: t.metrics_e, final: scores.E, local: scoresLocal?.E, online: scoresOnline?.E, fullMark: 5 },
    { subject: t.metrics_a, final: scores.A, local: scoresLocal?.A, online: scoresOnline?.A, fullMark: 5 },
    { subject: t.metrics_c, final: scores.C, local: scoresLocal?.C, online: scoresOnline?.C, fullMark: 5 },
    { subject: t.metrics_o, final: scores.O, local: scoresLocal?.O, online: scoresOnline?.O, fullMark: 5 },
    { subject: t.metrics_u, final: scores.U, local: scoresLocal?.U, online: scoresOnline?.U, fullMark: 5 },
    { subject: t.metrics_r, final: scores.R, local: scoresLocal?.R, online: scoresOnline?.R, fullMark: 5 },
  ];

  const strokeColor = verdict === 'IN' ? '#d4af37' : '#71717a';
  const fillColor = verdict === 'IN' ? '#d4af37' : '#52525b';

  return (
    // CRITICAL FIX: Explicit style dimensions to prevent Recharts "width(-1)" error
    <div style={{ width: '100%', height: '300px', minHeight: '300px' }} className="relative font-sans">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
          <PolarGrid stroke="#3f3f46" />
          <PolarAngleAxis 
            dataKey="subject" 
            tick={{ fill: '#a1a1aa', fontSize: 11, fontWeight: 600 }} 
          />
          <PolarRadiusAxis 
            angle={30} 
            domain={[0, 5]} 
            tick={false} 
            axisLine={false} 
          />
          
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#09090b', 
              borderColor: '#27272a', 
              borderRadius: '0.25rem',
              fontSize: '12px',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)'
            }}
            itemStyle={{ padding: 0 }}
            formatter={(value: number) => value.toFixed(1)}
          />

          {/* Render Final Radar FIRST (Background) */}
          <Radar
            name="最终 (Hybrid)"
            dataKey="final"
            stroke={strokeColor}
            strokeWidth={3}
            fill={fillColor}
            fillOpacity={0.3}
          />

          {/* Render Local/Online ON TOP (Dashed) */}
          {scoresLocal && (
             <Radar
                name="本地 (Local)"
                dataKey="local"
                stroke="#38bdf8"
                strokeWidth={1.5}
                strokeDasharray="3 3"
                fill="transparent"
              />
          )}

          {scoresOnline && (
             <Radar
                name="联网 (Net)"
                dataKey="online"
                stroke="#34d399"
                strokeWidth={1.5}
                strokeDasharray="3 3"
                fill="transparent"
              />
          )}
          
          <Legend 
            wrapperStyle={{ paddingTop: '10px', fontSize: '11px' }} 
            iconType="circle"
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Chart;
