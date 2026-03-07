'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
    alert('感谢您的留言，我们会尽快回复！');
  };

  return (
    <div className="min-h-screen bg-cream pt-24">
      {/* Header */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <p className="text-tan text-sm tracking-[0.3em] uppercase mb-4">联系我们</p>
            <h1 className="text-5xl md:text-6xl font-serif text-espresso mb-6">
              期待与您相遇
            </h1>
            <p className="text-brown/70">
              无论是产品咨询、定制需求还是合作洽谈，我们都期待您的联系
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-2xl font-serif text-espresso mb-8">留言咨询</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm text-brown mb-2">姓名 *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-transparent border border-brown/20 px-4 py-3 text-espresso placeholder:text-brown/30 focus:outline-none focus:border-tan transition-colors"
                      placeholder="您的姓名"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-brown mb-2">邮箱 *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-transparent border border-brown/20 px-4 py-3 text-espresso placeholder:text-brown/30 focus:outline-none focus:border-tan transition-colors"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm text-brown mb-2">电话</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-transparent border border-brown/20 px-4 py-3 text-espresso placeholder:text-brown/30 focus:outline-none focus:border-tan transition-colors"
                      placeholder="138-xxxx-xxxx"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-brown mb-2">咨询类型</label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full bg-transparent border border-brown/20 px-4 py-3 text-espresso focus:outline-none focus:border-tan transition-colors"
                    >
                      <option value="">请选择</option>
                      <option value="product">产品咨询</option>
                      <option value="custom">定制需求</option>
                      <option value="wholesale">批发合作</option>
                      <option value="other">其他</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-brown mb-2">留言内容 *</label>
                  <textarea
                    required
                    rows={6}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-transparent border border-brown/20 px-4 py-3 text-espresso placeholder:text-brown/30 focus:outline-none focus:border-tan transition-colors resize-none"
                    placeholder="请详细描述您的需求..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-espresso text-cream text-sm tracking-[0.2em] uppercase hover:bg-brown transition-colors"
                >
                  提交留言
                </button>
              </form>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-2xl font-serif text-espresso mb-8">联系方式</h2>

              <div className="space-y-8">
                <div>
                  <p className="text-tan text-sm tracking-[0.2em] uppercase mb-2">工坊地址</p>
                  <p className="text-brown">广东省广州市番禺区</p>
                  <p className="text-brown">手工艺创意园 A座 302</p>
                </div>

                <div>
                  <p className="text-tan text-sm tracking-[0.2em] uppercase mb-2">营业时间</p>
                  <p className="text-brown">周一至周六 9:00 - 18:00</p>
                  <p className="text-brown/60 text-sm">周日休息</p>
                </div>

                <div>
                  <p className="text-tan text-sm tracking-[0.2em] uppercase mb-2">联系电话</p>
                  <p className="text-brown">+86 138-xxxx-xxxx</p>
                  <p className="text-brown/60 text-sm">微信同号</p>
                </div>

                <div>
                  <p className="text-tan text-sm tracking-[0.2em] uppercase mb-2">电子邮箱</p>
                  <p className="text-brown">hello@ateliercuir.com</p>
                </div>

                <div>
                  <p className="text-tan text-sm tracking-[0.2em] uppercase mb-2">社交媒体</p>
                  <div className="flex gap-4 mt-2">
                    <span className="text-brown">微信公众号</span>
                    <span className="text-brown">小红书</span>
                    <span className="text-brown">微博</span>
                  </div>
                </div>
              </div>

              {/* Map placeholder */}
              <div className="mt-12 aspect-video bg-brown/10 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-brown/40 text-sm">地图位置</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Teaser */}
      <section className="py-16 bg-brown/5">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-serif text-espresso mb-4">常见问题</h2>
          <p className="text-brown/70 mb-6">
            在您联系我们之前，可以先查看常见问题，也许能找到您想要的答案
          </p>
          <a
            href="/faq"
            className="inline-block px-8 py-3 border border-brown/20 text-brown text-sm tracking-[0.15em] uppercase hover:border-brown/40 transition-colors"
          >
            查看常见问题
          </a>
        </div>
      </section>
    </div>
  );
}
