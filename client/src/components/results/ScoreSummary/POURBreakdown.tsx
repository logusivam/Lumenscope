import React from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts';
import { POURScores } from '../../../types/score';

interface POURBreakdownProps {
  scores: POURScores;
}

export const POURBreakdown: React.FC<POURBreakdownProps> = ({ scores }) => {
  const data = [
    { name: 'Perceivable', score: scores.perceivable },
    { name: 'Operable', score: scores.operable },
    { name: 'Understandable', score: scores.understandable },
    { name: 'Robust', score: scores.robust }
  ];

  const getBarColor = (val: number) => {
    if (val >= 90) return 'var(--color-severity-pass)';
    if (val >= 70) return 'var(--color-severity-moderate)';
    if (val >= 50) return 'var(--color-severity-serious)';
    return 'var(--color-severity-critical)';
  };

  return (
    <div className="w-full h-40">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 5, right: 10, left: 5, bottom: 5 }}
        >
          <XAxis type="number" domain={[0, 100]} hide />
          <YAxis
            dataKey="name"
            type="category"
            axisLine={false}
            tickLine={false}
            width={100}
            tick={{ fill: 'var(--color-ink)', fontSize: 12, fontFamily: 'var(--font-sans)' }}
          />
          <Bar dataKey="score" radius={3} barSize={8} background={{ fill: 'var(--color-border-grey)', radius: 3 }}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getBarColor(entry.score)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
export default POURBreakdown;
