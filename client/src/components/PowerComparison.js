import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, Legend } from 'recharts';

const PowerComparison = ({ char1, char2 }) => {
  if (!char1 || !char2) return null;

  const data = [
    { subject: 'Intelligence', A: char1.stats.intelligence, B: char2.stats.intelligence },
    { subject: 'Strength', A: char1.stats.strength, B: char2.stats.strength },
    { subject: 'Speed', A: char1.stats.speed, B: char2.stats.speed },
    { subject: 'Durability', A: char1.stats.durability, B: char2.stats.durability },
    { subject: 'Power', A: char1.stats.power, B: char2.stats.power },
    { subject: 'Combat', A: char1.stats.combat, B: char2.stats.combat },
  ];

  return (
    <div style={{ background: '#111', padding: '20px', borderRadius: '10px', color: 'white' }}>
      <h2 style={{ textAlign: 'center' }}>{char1.name} vs {char2.name}</h2>
      <ResponsiveContainer width="100%" height={400}>
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid stroke="#444" />
          <PolarAngleAxis dataKey="subject" stroke="#ccc" />
          <Radar name={char1.name} dataKey="A" stroke="#ed1d24" fill="#ed1d24" fillOpacity={0.6} />
          <Radar name={char2.name} dataKey="B" stroke="#00d4ff" fill="#00d4ff" fillOpacity={0.6} />
          <Legend />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PowerComparison;
