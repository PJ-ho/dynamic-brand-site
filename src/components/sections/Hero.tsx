'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate hero text on load
      gsap.fromTo(
        '.hero-title span',
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, stagger: 0.1, ease: 'power3.out', delay: 0.5 }
      );
      
      gsap.fromTo(
        '.hero-subtitle',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power2.out', delay: 1.2 }
      );

      gsap.fromTo(
        '.hero-cta',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out', delay: 1.5 }
      );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Animated Leather Texture Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-cream via-cream/95 to-tan/20" />
        <motion.div
          className="absolute inset-0 opacity-[0.03]"
          animate={{
            scale: [1, 1.05, 1],
            rotate: [0, 1, -1, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Floating Leather Patches - Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-32 h-32 rounded-full bg-tan/10 blur-3xl"
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + (i % 3) * 20}%`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, 20, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.5,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div ref={textRef} className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        <motion.div className="overflow-hidden mb-6">
          <p className="hero-subtitle text-tan text-sm tracking-[0.4em] uppercase mb-4">
            手工皮具工坊
          </p>
        </motion.div>

        <h1 className="hero-title text-6xl md:text-8xl lg:text-9xl font-serif text-espresso mb-8">
          <span className="inline-block">触</span>
          <span className="inline-block">感</span>
          <span className="inline-block mx-2 md:mx-4">·</span>
          <span className="inline-block">艺</span>
          <span className="inline-block">术</span>
        </h1>

        <motion.p
          className="hero-subtitle text-lg md:text-xl text-brown/80 max-w-2xl mx-auto mb-12 leading-relaxed"
        >
          每一针每一线，都是时间的沉淀。
          <br />
          我们用心制作，只为懂品质的你。
        </motion.p>

        <motion.div className="hero-cta flex flex-col sm:flex-row items-center justify-center gap-4">
          <motion.a
            href="/products"
            className="px-10 py-4 bg-espresso text-cream text-sm tracking-[0.2em] uppercase hover:bg-brown transition-colors duration-300"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            探索产品
          </motion.a>
          <motion.a
            href="/craftsmanship"
            className="px-10 py-4 border border-brown/30 text-brown text-sm tracking-[0.2em] uppercase hover:border-brown hover:bg-brown/5 transition-all duration-300"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            了解工艺
          </motion.a>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-px h-16 bg-gradient-to-b from-transparent via-brown/50 to-transparent" />
      </motion.div>
    </section>
  );
}
