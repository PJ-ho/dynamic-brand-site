'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const craftSteps = [
  {
    number: '01',
    title: '选材',
    subtitle: 'Material Selection',
    description: '每一张皮革都经过严格挑选。我们只使用顶级植鞣革，它们来自意大利和法国的传统鞣革工坊。',
    image: '/images/craft-selection.jpg',
  },
  {
    number: '02',
    title: '裁切',
    subtitle: 'Precision Cutting',
    description: '手工裁切确保每一刀都精准无误。沿着皮革的纹理，避开任何瑕疵，只为呈现最完美的形态。',
    image: '/images/craft-cutting.jpg',
  },
  {
    number: '03',
    title: '缝制',
    subtitle: 'Hand Stitching',
    description: '双针马鞍缝法，传承自19世纪的马具制作传统。每一针都承载着匠人的专注与耐心。',
    image: '/images/craft-stitching.jpg',
  },
  {
    number: '04',
    title: '打磨',
    subtitle: 'Edge Finishing',
    description: '边缘经过数十次的涂胶、打磨、上蜡。光滑圆润的触感，是对细节的极致追求。',
    image: '/images/craft-finishing.jpg',
  },
];

export default function CraftsmanshipSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);

  return (
    <section ref={containerRef} className="py-32 bg-espresso text-cream relative overflow-hidden">
      {/* Background texture */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Floating decorative element */}
      <motion.div
        style={{ y }}
        className="absolute right-0 top-1/4 w-96 h-96 rounded-full bg-tan/5 blur-3xl"
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-24">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-tan text-sm tracking-[0.3em] uppercase mb-4"
          >
            传承工艺
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-serif mb-6"
          >
            一针一线，皆是匠心
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-cream/60 max-w-xl mx-auto"
          >
            从选材到成品，每一件作品都经历数周的制作周期。我们相信，好的东西需要时间来打磨。
          </motion.p>
        </div>

        {/* Craft Steps */}
        <div className="space-y-32">
          {craftSteps.map((step, index) => (
            <CraftStep key={step.number} step={step} index={index} />
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-24"
        >
          <a
            href="/craftsmanship"
            className="inline-block px-12 py-4 border border-cream/30 text-cream text-sm tracking-[0.2em] uppercase hover:bg-cream hover:text-espresso transition-all duration-300"
          >
            探索更多工艺故事
          </a>
        </motion.div>
      </div>
    </section>
  );
}

interface CraftStepProps {
  step: typeof craftSteps[0];
  index: number;
}

function CraftStep({ step, index }: CraftStepProps) {
  const isEven = index % 2 === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 80 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.8 }}
      className={`grid md:grid-cols-2 gap-12 lg:gap-20 items-center ${
        isEven ? '' : 'md:grid-flow-dense'
      }`}
    >
      {/* Image/Visual */}
      <div className={`relative ${isEven ? '' : 'md:col-start-2'}`}>
        <div className="aspect-[4/3] bg-tan/10 relative overflow-hidden">
          {/* Placeholder gradient for now */}
          <div className="absolute inset-0 bg-gradient-to-br from-tan/20 to-espresso/50" />
          
          {/* Step number overlay */}
          <div className="absolute bottom-4 right-4 text-8xl font-serif text-cream/10">
            {step.number}
          </div>
        </div>

        {/* Decorative frame */}
        <div className="absolute -inset-4 border border-cream/10 pointer-events-none" />
      </div>

      {/* Content */}
      <div className={`${isEven ? '' : 'md:col-start-1 md:row-start-1'}`}>
        <div className="max-w-md">
          <span className="text-6xl font-serif text-tan/30 block mb-4">{step.number}</span>
          <p className="text-tan text-xs tracking-[0.2em] uppercase mb-2">{step.subtitle}</p>
          <h3 className="text-3xl font-serif mb-6">{step.title}</h3>
          <p className="text-cream/70 leading-relaxed">{step.description}</p>
        </div>
      </div>
    </motion.div>
  );
}
