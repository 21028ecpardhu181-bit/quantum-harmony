import { useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Button } from '@/components/ui/button';
import { BellState, measureBellState, calculateCorrelation } from '@/lib/quantum';
import { Play, Trash2 } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  description?: string;
}

function StatCard({ label, value, description }: StatCardProps) {
  return (
    <div className="p-4 bg-card rounded-lg border border-border">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-2xl font-mono font-bold text-primary">{value}</p>
      {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
    </div>
  );
}

export function CorrelationStats() {
  const [bellState, setBellState] = useState<BellState>('Φ+');
  const [measurements, setMeasurements] = useState<[0 | 1, 0 | 1][]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const runSimulations = useCallback((count: number) => {
    setIsRunning(true);
    const newMeasurements: [0 | 1, 0 | 1][] = [];
    
    for (let i = 0; i < count; i++) {
      newMeasurements.push(measureBellState(bellState));
    }
    
    setMeasurements(prev => [...prev, ...newMeasurements]);
    setTimeout(() => setIsRunning(false), 500);
  }, [bellState]);

  const clearData = useCallback(() => {
    setMeasurements([]);
  }, []);

  const stats = useMemo(() => {
    if (measurements.length === 0) {
      return { counts: { '00': 0, '01': 0, '10': 0, '11': 0 }, correlation: 0, total: 0 };
    }

    const counts = { '00': 0, '01': 0, '10': 0, '11': 0 };
    measurements.forEach(([a, b]) => {
      counts[`${a}${b}` as keyof typeof counts]++;
    });

    const correlation = calculateCorrelation(measurements);

    return { counts, correlation, total: measurements.length };
  }, [measurements]);

  const barData = useMemo(() => [
    { outcome: '|00⟩', count: stats.counts['00'], fill: 'hsl(var(--chart-1))' },
    { outcome: '|01⟩', count: stats.counts['01'], fill: 'hsl(var(--chart-2))' },
    { outcome: '|10⟩', count: stats.counts['10'], fill: 'hsl(var(--chart-3))' },
    { outcome: '|11⟩', count: stats.counts['11'], fill: 'hsl(var(--chart-4))' },
  ], [stats.counts]);

  const correlationHistory = useMemo(() => {
    const history: { run: number; correlation: number }[] = [];
    for (let i = 10; i <= measurements.length; i += 10) {
      const subset = measurements.slice(0, i);
      const corr = calculateCorrelation(subset);
      history.push({ run: i, correlation: Math.abs(corr) });
    }
    return history;
  }, [measurements]);

  const bellStates: BellState[] = ['Φ+', 'Φ-', 'Ψ+', 'Ψ-'];

  return (
    <div className="space-y-6">
      {/* Bell state selector */}
      <div className="flex flex-wrap justify-center gap-2">
        {bellStates.map((state) => (
          <Button
            key={state}
            variant={bellState === state ? 'default' : 'outline'}
            size="sm"
            onClick={() => {
              setBellState(state);
              clearData();
            }}
            className="font-mono"
          >
            |{state}⟩
          </Button>
        ))}
      </div>

      {/* Controls */}
      <div className="flex flex-wrap justify-center gap-2">
        <Button onClick={() => runSimulations(10)} disabled={isRunning}>
          <Play className="w-4 h-4 mr-2" />
          Run 10
        </Button>
        <Button onClick={() => runSimulations(100)} disabled={isRunning}>
          <Play className="w-4 h-4 mr-2" />
          Run 100
        </Button>
        <Button onClick={() => runSimulations(1000)} disabled={isRunning}>
          <Play className="w-4 h-4 mr-2" />
          Run 1000
        </Button>
        <Button variant="outline" onClick={clearData}>
          <Trash2 className="w-4 h-4 mr-2" />
          Clear
        </Button>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Measurements" value={stats.total} />
        <StatCard 
          label="Correlation" 
          value={stats.total > 0 ? stats.correlation.toFixed(3) : '—'}
          description={stats.total > 0 ? (Math.abs(stats.correlation) > 0.9 ? 'Strong entanglement' : 'Building correlation') : undefined}
        />
        <StatCard 
          label="Same Outcome" 
          value={stats.total > 0 ? `${(((stats.counts['00'] + stats.counts['11']) / stats.total) * 100).toFixed(1)}%` : '—'}
          description="Both qubits same"
        />
        <StatCard 
          label="Different Outcome" 
          value={stats.total > 0 ? `${(((stats.counts['01'] + stats.counts['10']) / stats.total) * 100).toFixed(1)}%` : '—'}
          description="Qubits differ"
        />
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Outcome distribution */}
        <motion.div
          className="p-4 bg-card rounded-xl border border-border"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h4 className="text-sm font-medium mb-4">Measurement Outcomes</h4>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="outcome" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Correlation over time */}
        <motion.div
          className="p-4 bg-card rounded-xl border border-border"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h4 className="text-sm font-medium mb-4">Correlation Convergence</h4>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={correlationHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="run" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis domain={[0, 1]} stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="correlation" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          {correlationHistory.length > 0 && (
            <p className="text-xs text-muted-foreground text-center mt-2">
              Correlation approaches 1.0 as more measurements are taken
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
}
