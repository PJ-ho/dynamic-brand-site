'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import ProductScene from '../3d/Wallet3D';

const products = [
  {
    id: 'wallet-classic',
    name: '经典折叠钱包',
    nameEn: 'Classic Fold Wallet',
    description: '头层牛皮，手工缝制',
    price: '¥1,280',
    color: '#8B6914',
    type: 'wallet' as const,
  },
  {
    id: 'cardholder-minimal',
    name: '极简卡包',
    nameEn: 'Minimal Card Holder',
    description: '意大利植鞣革',
    price: '¥680',
    color: '#5C4033',
    type: 'cardholder' as const,
  },
  {
    id: 'bag-crossbody',
    name: '斜挎小包',
    nameEn: 'Crossbody Bag',
    description: '复古黄铜配件',
    price: '¥2,480',
    color: '#C4A77D',
    type: 'bag' as const,
  },
];

export default function ProductsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section ref={sectionRef} className="py-32 bg-cream relative overflow-hidden">
      {/* Section Header */}
      <div className="max-w-7xl mx-auto px-6 mb-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <p className="text-tan text-sm tracking-[0.3em] uppercase mb-4">精选产品</p>
          <h2 className="text-4xl md:text-6xl font-serif text-espresso mb-6">
            精工细作
          </h2>
          <p className="text-brown/70 max-w-xl mx-auto">
            每一件作品都经过数十道工序，历时数日方能完成。我们相信，真正的品质需要时间的沉淀。
          </p>
        </motion.div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} isInView={isInView} />
          ))}
        </div>
      </div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="text-center mt-20"
      >
        <a
          href="/products"
          className="inline-flex items-center gap-2 text-brown hover:text-espresso transition-colors group"
        >
          <span className="tracking-[0.2em] text-sm uppercase">查看全部产品</span>
          <svg
            className="w-5 h-5 transform group-hover:translate-x-1 transition-transform"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </a>
      </motion.div>
    </section>
  );
}

interface ProductCardProps {
  product: typeof products[0];
  index: number;
  isInView: boolean;
}

function ProductCard({ product, index, isInView }: ProductCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: 0.2 + index * 0.15 }}
      className="group"
    >
      <div className="relative bg-gradient-to-b from-tan/5 to-transparent aspect-[4/5] mb-6 overflow-hidden">
        {/* 3D Product */}
        <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-105">
          <ProductScene product={product.type} color={product.color} />
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-espresso/0 group-hover:bg-espresso/10 transition-colors duration-500" />

        {/* Quick view button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileHover={{ opacity: 1, y: 0 }}
          className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          <button className="w-full py-3 bg-cream/90 backdrop-blur text-espresso text-sm tracking-[0.15em] hover:bg-cream transition-colors">
            快速查看
          </button>
        </motion.div>
      </div>

      {/* Product Info */}
      <div className="text-center">
        <p className="text-tan text-xs tracking-[0.2em] uppercase mb-2">{product.nameEn}</p>
        <h3 className="text-xl font-serif text-espresso mb-2">{product.name}</h3>
        <p className="text-brown/60 text-sm mb-3">{product.description}</p>
        <p className="text-brown font-medium">{product.price}</p>
      </div>
    </motion.div>
  );
}
