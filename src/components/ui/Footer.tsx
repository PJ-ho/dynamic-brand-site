'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

const footerLinks = {
  products: [
    { label: '钱包', href: '/products?category=wallet' },
    { label: '卡包', href: '/products?category=cardholder' },
    { label: '手袋', href: '/products?category=bag' },
    { label: '定制', href: '/custom' },
  ],
  about: [
    { label: '品牌故事', href: '/about' },
    { label: '工艺传承', href: '/craftsmanship' },
    { label: '工坊探访', href: '/visit' },
  ],
  support: [
    { label: '联系我们', href: '/contact' },
    { label: '配送说明', href: '/shipping' },
    { label: '保养指南', href: '/care' },
    { label: '常见问题', href: '/faq' },
  ],
};

const socialLinks = [
  { label: '微信', href: '#', icon: 'wechat' },
  { label: '微博', href: '#', icon: 'weibo' },
  { label: '小红书', href: '#', icon: 'xiaohongshu' },
  { label: 'Instagram', href: '#', icon: 'instagram' },
];

export default function Footer() {
  return (
    <footer className="bg-espresso text-cream">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1 mb-8 lg:mb-0">
            <Link href="/" className="inline-block mb-6">
              <div className="flex flex-col items-start">
                <span className="text-2xl font-serif tracking-[0.3em]">ATELIER</span>
                <span className="text-xs tracking-[0.5em] text-tan -mt-1">CUIR</span>
              </div>
            </Link>
            <p className="text-cream/60 text-sm leading-relaxed mb-6 max-w-xs">
              传承手工皮具工艺，为追求品质生活的人打造 timeless 的经典之作。
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  whileHover={{ scale: 1.1 }}
                  className="w-10 h-10 rounded-full border border-cream/20 flex items-center justify-center text-cream/60 hover:text-cream hover:border-cream/40 transition-colors"
                >
                  <span className="text-xs">{social.label[0]}</span>
                </motion.a>
              ))}
            </div>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-sm tracking-[0.2em] uppercase mb-6 text-tan">产品</h4>
            <ul className="space-y-3">
              {footerLinks.products.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-cream/60 hover:text-cream transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About */}
          <div>
            <h4 className="text-sm tracking-[0.2em] uppercase mb-6 text-tan">关于</h4>
            <ul className="space-y-3">
              {footerLinks.about.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-cream/60 hover:text-cream transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-sm tracking-[0.2em] uppercase mb-6 text-tan">服务</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-cream/60 hover:text-cream transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <h4 className="text-sm tracking-[0.2em] uppercase mb-6 text-tan">订阅我们</h4>
            <p className="text-cream/60 text-sm mb-4">
              获取新品发布、限定优惠和工艺故事
            </p>
            <form className="flex">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 bg-transparent border border-cream/20 px-4 py-2 text-sm text-cream placeholder:text-cream/30 focus:outline-none focus:border-cream/40"
              />
              <button
                type="submit"
                className="bg-tan text-espresso px-4 py-2 text-sm hover:bg-cream transition-colors"
              >
                订阅
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-cream/10">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-cream/40 text-xs">
            © {new Date().getFullYear()} Atelier Cuir. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-cream/40">
            <Link href="/privacy" className="hover:text-cream/60 transition-colors">
              隐私政策
            </Link>
            <Link href="/terms" className="hover:text-cream/60 transition-colors">
              使用条款
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
