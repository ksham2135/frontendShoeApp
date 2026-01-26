import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { ProductGrid } from '@/components/products/ProductGrid';
import { categories, getFeaturedProducts } from '@/data/mockData';

const Index = () => {
  const featuredProducts = getFeaturedProducts();

  return (
    <Layout>
      {/* Hero Section */}
      <section className="hero-gradient">
        <div className="container py-16 md:py-24">
          <div className="max-w-2xl space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight animate-slide-up">
              Step Into
              <span className="block text-accent">Your Style</span>
            </h1>
            <p className="text-lg text-muted-foreground animate-slide-up" style={{ animationDelay: '0.1s' }}>
              Discover premium footwear for men, women, and kids. Quality craftsmanship meets modern design.
            </p>
            <div className="flex gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <Link to="/products" className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium inline-flex items-center gap-2 hover:bg-primary/90 transition-colors">
                Shop Now <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/products" className="px-6 py-3 border-2 border-primary rounded-lg font-medium hover:bg-primary hover:text-primary-foreground transition-colors">
                Featured
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-background">
        <div className="container">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">Shop by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categories.map((category) => (
              <Link key={category.id} to={`/products/${category.slug}`} className="category-card group aspect-[4/3]">
                <img src={category.image_url || '/placeholder.svg'} alt={category.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 z-20 flex items-end p-6">
                  <div>
                    <h3 className="text-2xl font-bold text-white">{category.name}</h3>
                    <p className="text-white/80 text-sm mt-1">Shop Collection →</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-2xl md:text-3xl font-bold">Featured Products</h2>
            <Link to="/products" className="text-accent font-medium inline-flex items-center gap-2 hover:underline">
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <ProductGrid products={featuredProducts} />
        </div>
      </section>
    </Layout>
  );
};

export default Index;
