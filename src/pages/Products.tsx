import { useState, useMemo } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { ProductGrid } from '@/components/products/ProductGrid';
import { products, getProductsByCategory, searchProducts, getCategoryBySlug } from '@/data/mockData';

export default function Products() {
  const { category } = useParams();
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  
  const [search, setSearch] = useState(initialSearch);
  const [sortBy, setSortBy] = useState<'newest' | 'price_asc' | 'price_desc'>('newest');
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');

  const filteredProducts = useMemo(() => {
    let result = category ? getProductsByCategory(category) : [...products];

    // Search filter
    if (search) {
      const lowerSearch = search.toLowerCase();
      result = result.filter(
        p => p.name.toLowerCase().includes(lowerSearch) || p.brand.toLowerCase().includes(lowerSearch)
      );
    }

    // Price filters
    if (minPrice) {
      result = result.filter(p => p.price >= Number(minPrice));
    }
    if (maxPrice) {
      result = result.filter(p => p.price <= Number(maxPrice));
    }

    // Sorting
    switch (sortBy) {
      case 'price_asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
      default:
        // Keep original order (which is already by newest in mock data)
        break;
    }

    return result;
  }, [category, search, sortBy, minPrice, maxPrice]);

  const categoryInfo = category ? getCategoryBySlug(category) : null;
  const categoryTitle = categoryInfo ? categoryInfo.name : 'All';

  return (
    <Layout>
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">{categoryTitle} Shoes</h1>
          <p className="text-muted-foreground mt-1">{filteredProducts.length} products</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-8 items-center">
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-xs h-10 px-4 rounded-lg bg-background border border-border focus:ring-2 focus:ring-accent outline-none text-sm"
          />
          <input
            type="number"
            placeholder="Min ₹"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-28 h-10 px-4 rounded-lg bg-background border border-border focus:ring-2 focus:ring-accent outline-none text-sm"
          />
          <input
            type="number"
            placeholder="Max ₹"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-28 h-10 px-4 rounded-lg bg-background border border-border focus:ring-2 focus:ring-accent outline-none text-sm"
          />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="w-40 h-10 px-4 rounded-lg bg-background border border-border focus:ring-2 focus:ring-accent outline-none text-sm"
          >
            <option value="newest">Newest</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>

        <ProductGrid products={filteredProducts} />
      </div>
    </Layout>
  );
}
