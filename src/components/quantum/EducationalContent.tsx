import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Atom, Link2, Gauge, Binary, Sparkles, Zap } from 'lucide-react';

interface ContentCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  content: string;
  formula?: string;
  index: number;
}

function ContentCard({ icon, title, description, content, formula, index }: ContentCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      viewport={{ once: true }}
    >
      <Card className="h-full hover:shadow-lg transition-shadow">
        <CardHeader>
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
            {icon}
          </div>
          <CardTitle className="text-lg">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground leading-relaxed">{content}</p>
          {formula && (
            <div className="mt-4 p-3 bg-secondary/30 rounded-lg">
              <p className="font-mono text-sm text-primary text-center">{formula}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function EducationalContent() {
  const cards = [
    {
      icon: <Atom className="w-6 h-6" />,
      title: "Quantum Superposition",
      description: "The foundation of quantum mechanics",
      content: "Unlike classical bits that are either 0 or 1, a qubit can exist in a superposition of both states simultaneously. This is described by the wave function |ψ⟩ = α|0⟩ + β|1⟩, where α and β are complex probability amplitudes.",
      formula: "|ψ⟩ = α|0⟩ + β|1⟩",
    },
    {
      icon: <Link2 className="w-6 h-6" />,
      title: "Quantum Entanglement",
      description: "Einstein's 'spooky action at a distance'",
      content: "When two qubits become entangled, measuring one instantly determines the state of the other, regardless of the distance between them. This correlation is stronger than any classical connection could allow.",
      formula: "|Φ⁺⟩ = (|00⟩ + |11⟩) / √2",
    },
    {
      icon: <Gauge className="w-6 h-6" />,
      title: "Bell States",
      description: "The four maximally entangled states",
      content: "Bell states are the simplest examples of quantum entanglement. There are four Bell states: |Φ⁺⟩, |Φ⁻⟩, |Ψ⁺⟩, and |Ψ⁻⟩. Each represents a different way two qubits can be perfectly correlated or anti-correlated.",
    },
    {
      icon: <Binary className="w-6 h-6" />,
      title: "Hadamard Gate",
      description: "Creating superposition",
      content: "The Hadamard gate is a fundamental single-qubit operation that creates an equal superposition. It transforms |0⟩ to |+⟩ = (|0⟩ + |1⟩)/√2 and |1⟩ to |-⟩ = (|0⟩ - |1⟩)/√2.",
      formula: "H|0⟩ = (|0⟩ + |1⟩) / √2",
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: "CNOT Gate",
      description: "Creating entanglement",
      content: "The Controlled-NOT gate is a two-qubit gate that flips the target qubit if the control qubit is |1⟩. Combined with the Hadamard gate, it creates entangled Bell states from separable states.",
      formula: "CNOT|10⟩ = |11⟩",
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Quantum Measurement",
      description: "Collapsing the wave function",
      content: "When a qubit in superposition is measured, its wave function 'collapses' to either |0⟩ or |1⟩ with probabilities |α|² and |β|². For entangled qubits, measuring one instantly determines the other's state.",
    },
  ];

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cards.map((card, index) => (
        <ContentCard key={card.title} {...card} index={index} />
      ))}
    </div>
  );
}
