'use client';

import { motion } from 'framer-motion';

const timeline = [
  { year: '2014', title: '工坊成立', description: '在广州一个小工作室开始皮具制作之旅' },
  { year: '2016', title: '首个系列', description: '推出首个完整产品线，获得市场认可' },
  { year: '2018', title: '工艺升级', description: '引入意大利植鞣革，提升产品品质' },
  { year: '2020', title: '线上渠道', description: '开设线上店铺，服务更多客户' },
  { year: '2023', title: '工坊扩建', description: '迁入更大工坊，招募更多匠人' },
  { year: '2024', title: '品牌升级', description: '全新品牌形象，开启新篇章' },
];

const values = [
  {
    title: '品质至上',
    description: '我们只使用顶级皮革，每一件作品都经过严格质检',
    icon: '◇',
  },
  {
    title: '传统工艺',
    description: '传承百年马鞍缝法，每一针都承载匠心',
    icon: '✦',
  },
  {
    title: '时间沉淀',
    description: '好的作品需要时间，我们不赶工，只做精品',
    icon: '◈',
  },
  {
    title: '可持续发展',
    description: '天然材料，环保工艺，对地球负责',
    icon: '❋',
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-cream pt-24">
      {/* Hero */}
      <section className="py-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <p className="text-tan text-sm tracking-[0.3em] uppercase mb-4">我们的故事</p>
            <h1 className="text-5xl md:text-7xl font-serif text-espresso mb-8">
              十年匠心
            </h1>
            <p className="text-brown/70 text-lg leading-relaxed">
              从一个小工作室到知名手工皮具品牌，我们始终坚持同一个信念：
              用最好的材料，最传统的工艺，做出能用一辈子的产品。
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-espresso text-cream">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-[4/5] bg-tan/20 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-8xl font-serif text-cream/10">AC</span>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 border border-cream/20" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <p className="text-tan text-sm tracking-[0.3em] uppercase mb-4">创始人的话</p>
              <blockquote className="text-2xl font-serif leading-relaxed mb-6">
                "我希望做出的每一个包，都能陪伴主人很多年，甚至传给下一代。"
              </blockquote>
              <p className="text-cream/60 leading-relaxed mb-6">
                2014年，我辞去了设计师的工作，租下一个小工作室，开始学习皮具制作。那时候只有我一个人，一把刀，一卷线。
              </p>
              <p className="text-cream/60 leading-relaxed">
                十年过去了，我们有了更大的工坊，更多的匠人，但初心从未改变——做好每一件产品，让每一个客户都满意。
              </p>
              <p className="text-tan mt-6">— 创始人</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-tan text-sm tracking-[0.3em] uppercase mb-4">品牌理念</p>
            <h2 className="text-4xl font-serif text-espresso">我们坚持的</h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-8 border border-brown/10 hover:border-tan/30 transition-colors"
              >
                <span className="text-4xl text-tan block mb-4">{value.icon}</span>
                <h3 className="text-xl font-serif text-espresso mb-3">{value.title}</h3>
                <p className="text-brown/60 text-sm">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-brown/5">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-tan text-sm tracking-[0.3em] uppercase mb-4">品牌历程</p>
            <h2 className="text-4xl font-serif text-espresso">我们的旅程</h2>
          </motion.div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-brown/20 -translate-x-1/2 hidden md:block" />

            <div className="space-y-12">
              {timeline.map((item, index) => (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-center gap-8 ${
                    index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  <div className="flex-1 text-right hidden md:block">
                    {index % 2 === 0 && (
                      <div>
                        <p className="text-tan text-sm">{item.year}</p>
                        <h3 className="text-xl font-serif text-espresso">{item.title}</h3>
                        <p className="text-brown/60 text-sm">{item.description}</p>
                      </div>
                    )}
                  </div>

                  <div className="w-4 h-4 rounded-full bg-tan border-4 border-cream flex-shrink-0 relative z-10" />

                  <div className="flex-1 md:text-left">
                    <div className="md:hidden mb-2">
                      <p className="text-tan text-sm">{item.year}</p>
                    </div>
                    {index % 2 !== 0 && (
                      <div className="hidden md:block">
                        <h3 className="text-xl font-serif text-espresso">{item.title}</h3>
                        <p className="text-brown/60 text-sm">{item.description}</p>
                      </div>
                    )}
                    <div className="md:hidden">
                      <h3 className="text-xl font-serif text-espresso">{item.title}</h3>
                      <p className="text-brown/60 text-sm">{item.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
