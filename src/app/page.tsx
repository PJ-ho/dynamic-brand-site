import Hero from '@/components/sections/Hero';
import ProductsSection from '@/components/sections/ProductsSection';
import CraftsmanshipSection from '@/components/sections/CraftsmanshipSection';

export default function Home() {
  return (
    <>
      {/* Hero Section - Immersive Entry */}
      <Hero />

      {/* Featured Products - 3D Interactive */}
      <ProductsSection />

      {/* Craftsmanship Story - Scrollytelling */}
      <CraftsmanshipSection />

      {/* Brand Story Preview */}
      <section className="py-32 bg-cream relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Image */}
            <div className="relative">
              <div className="aspect-[4/5] bg-gradient-to-br from-tan/20 to-brown/30 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-6xl font-serif text-brown/20">AC</span>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-tan/10 blur-2xl" />
            </div>

            {/* Content */}
            <div>
              <p className="text-tan text-sm tracking-[0.3em] uppercase mb-4">关于我们</p>
              <h2 className="text-4xl md:text-5xl font-serif text-espresso mb-6 leading-tight">
                十年匠心，<br />只为做好一只包
              </h2>
              <p className="text-brown/70 leading-relaxed mb-6">
                Atelier Cuir 成立于2014年，我们始终坚持传统手工艺与现代设计的结合。每一件作品都由经验丰富的匠人亲手制作，从选材到成品，历时数周。
              </p>
              <p className="text-brown/70 leading-relaxed mb-8">
                我们相信，真正的奢侈品不是品牌标签，而是时间的沉淀和匠人的用心。
              </p>
              <a
                href="/about"
                className="inline-flex items-center gap-2 text-brown hover:text-espresso transition-colors group"
              >
                <span className="tracking-[0.15em] text-sm uppercase">了解更多</span>
                <svg
                  className="w-5 h-5 transform group-hover:translate-x-1 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-24 bg-brown text-cream relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            }}
          />
        </div>
        
        <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-serif mb-4">加入我们的旅程</h2>
          <p className="text-cream/60 mb-8">
            订阅获取新品发布、限定优惠和工艺故事
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 bg-transparent border border-cream/30 px-6 py-3 text-cream placeholder:text-cream/30 focus:outline-none focus:border-cream/50"
            />
            <button
              type="submit"
              className="px-8 py-3 bg-cream text-brown text-sm tracking-[0.15em] uppercase hover:bg-tan transition-colors"
            >
              订阅
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
