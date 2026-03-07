'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductScene from '@/components/3d/Wallet3D';

const allProducts = [
  {
    id: 'wallet-classic',
    name: '经典折叠钱包',
    nameEn: 'Classic Fold Wallet',
    description: '头层牛皮，手工缝制，6个卡位，2个钞位',
    price: 1280,
    color: '#8B6914',
    type: 'wallet' as const,
    category: 'wallet',
    featured: true,
  },
  {
    id: 'wallet-slim',
    name: '超薄钱包',
    nameEn: 'Slim Wallet',
    description: '极简设计，仅4个卡位，适合极简主义者',
    price: 980,
    color: '#5C4033',
    type: 'wallet' as const,
    category: 'wallet',
    featured: false,
  },
  {
    id: 'cardholder-minimal',
    name: '极简卡包',
    nameEn: 'Minimal Card Holder',
    description: '意大利植鞣革，4个卡位，轻薄便携',
    price: 680,
    color: '#5C4033',
    type: 'cardholder' as const,
    category: 'cardholder',
    featured: true,
  },
  {
    id: 'cardholder-bi-fold',
    name: '对折卡包',
    nameEn: 'Bi-fold Card Holder',
    description: '8个卡位，可放少量现金，商务之选',
    price: 880,
    color: '#8B6914',
    type: 'cardholder' as const,
    category: 'cardholder',
    featured: false,
  },
  {
    id: 'bag-crossbody',
    name: '斜挎小包',
    nameEn: 'Crossbody Bag',
    description: '复古黄铜配件，可调节肩带，日常通勤首选',
    price: 2480,
    color: '#C4A77D',
    type: 'bag' as const,
    category: 'bag',
    featured: true,
  },
  {
    id: 'bag-clutch',
    name: '手拿包',
    nameEn: 'Clutch Bag',
    description: '经典信封式设计，可放手机和随身小物',
    price: 1880,
    color: '#8B6914',
    type: 'bag' as const,
    category: 'bag',
    featured: false,
  },
];

const categories = [
  { id: 'all', label: '全部' },
  { id: 'wallet', label: '钱包' },
  { id: 'cardholder', label: '卡包' },
  { id: 'bag', label: '手袋' },
];

export default function ProductsPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);

  const filteredProducts = activeCategory === 'all'
    ? allProducts
    : allProducts.filter(p => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-cream pt-24">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <p className="text-tan text-sm tracking-[0.3em] uppercase mb-4">产品系列</p>
          <h1 className="text-5xl md:text-6xl font-serif text-espresso mb-6">精工之作</h1>
          <p className="text-brown/70 max-w-xl mx-auto">
            每一件作品都经过数十道工序，历时数日方能完成
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center gap-4 mb-16"
        >
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-6 py-2 text-sm tracking-[0.15em] uppercase transition-all duration-300 ${
                activeCategory === cat.id
                  ? 'bg-espresso text-cream'
                  : 'border border-brown/20 text-brown hover:border-brown/40'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </motion.div>

        {/* Products Grid */}
        <motion.div
          layout
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12"
        >
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                onMouseEnter={() => setHoveredProduct(product.id)}
                onMouseLeave={() => setHoveredProduct(null)}
                className="group cursor-pointer"
              >
                {/* Product Visual */}
                <div className="relative aspect-square bg-gradient-to-b from-tan/10 to-transparent mb-6 overflow-hidden">
                  <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-105">
                    <ProductScene product={product.type} color={product.color} />
                  </div>

                  {/* Featured Badge */}
                  {product.featured && (
                    <div className="absolute top-4 left-4 px-3 py-1 bg-gold text-espresso text-xs tracking-[0.1em] uppercase">
                      推荐
                    </div>
                  )}

                  {/* Quick actions */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{
                      opacity: hoveredProduct === product.id ? 1 : 0,
                      y: hoveredProduct === product.id ? 0 : 20,
                    }}
                    className="absolute bottom-4 left-4 right-4 flex gap-2"
                  >
                    <button className="flex-1 py-3 bg-cream/90 backdrop-blur text-espresso text-sm tracking-[0.1em] hover:bg-cream transition-colors">
                      加入购物车
                    </button>
                    <button className="w-12 h-12 bg-cream/90 backdrop-blur flex items-center justify-center hover:bg-cream transition-colors">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button>
                  </motion.div>
                </div>

                {/* Product Info */}
                <div className="text-center">
                  <p className="text-tan text-xs tracking-[0.2em] uppercase mb-1">{product.nameEn}</p>
                  <h3 className="text-xl font-serif text-espresso mb-2">{product.name}</h3>
                  <p className="text-brown/60 text-sm mb-3">{product.description}</p>
                  <p className="text-brown font-medium">¥{product.price.toLocaleString()}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
