import React from 'react';
import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer } from 'recharts';

interface OverallScoreGaugeProps {
  score: number;
}

export const OverallScoreGauge: React.FC<OverallScoreGaugeProps> = ({ score }) => {
  // Determine color according to score thresholds
  let scoreColor = 'var(--color-severity-critical)';
  if (score >= 90) {
    scoreColor = 'var(--color-severity-pass)';
  } else if (score >= 70) {
    scoreColor = 'var(--color-severity-moderate)';
  } else if (score >= 50) {
    scoreColor = 'var(--color-severity-serious)';
  }

  const data = [
    {
      name: 'Score',
      value: score,
      fill: scoreColor
    }
  ];

  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-full h-48 bg-paper/20 rounded flex items-center justify-center" />;
  }

  return (
    <div className="w-full h-48 flex items-center justify-center relative">
      <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
        <RadialBarChart
          cx="50%"
          cy="55%"
          innerRadius="75%"
          outerRadius="100%"
          barSize={14}
          data={data}
          startAngle={180}
          endAngle={0}
        >
          <PolarAngleAxis
            type="number"
            domain={[0, 100]}
            angleAxisId={0}
            tick={false}
          />
          <RadialBar
            background={{ fill: 'var(--color-border-grey)' }}
            dataKey="value"
            cornerRadius={6}
          />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="absolute top-[60%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
        <span className="font-mono text-4xl font-bold text-ink">{score}</span>
        <span className="font-sans text-xs text-minor-grey block mt-0.5">out of 100</span>
      </div>
    </div>
  );
};
export default OverallScoreGauge;
