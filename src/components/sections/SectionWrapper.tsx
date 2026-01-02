import { motion } from 'framer-motion';

interface SectionWrapperProps {
  id?: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
  className?: string;
}

export function SectionWrapper({ id, title, subtitle, children, className = '' }: SectionWrapperProps) {
  return (
    <section id={id} className={`py-20 px-4 ${className}`}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{subtitle}</p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          {children}
        </motion.div>
      </div>
    </section>
  );
}
