import type { NextApiRequest, NextApiResponse } from 'next';
import { getAllProducts } from '../../utils/getAllProducts';

// In-memory cache for all products
let productCache: any[] = [];
let searchIndex: Map<string, number[]> = new Map();
let lastCacheTime = 0;
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes in ms

function normalize(str: string = '') {
  return str
    .toLowerCase()
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Build search index for faster lookups
function buildSearchIndex(products: any[]) {
  const index = new Map<string, number[]>();
  
  products.forEach((product, idx) => {
    const searchableText = [
      product.brand,
      product.productName,
      product.title,
      product.name
    ].filter(Boolean).join(' ').toLowerCase();
    
    // Create trigrams for fuzzy matching
    const words = searchableText.split(/\s+/);
    words.forEach(word => {
      if (word.length >= 2) {
        if (!index.has(word)) index.set(word, []);
        index.get(word)!.push(idx);
      }
    });
  });
  
  return index;
}

async function getCachedProducts() {
  const now = Date.now();
  if (!productCache.length || now - lastCacheTime > CACHE_DURATION) {
    // Cache is empty or expired, fetch from backend
    productCache = await getAllProducts();
    searchIndex = buildSearchIndex(productCache);
    lastCacheTime = now;
  }
  return productCache;
}

// Get category counts for all products
function getCategoryCounts(products: any[]) {
  const counts: Record<string, number> = {
    sneakers: 0,
    apparel: 0,
    accessories: 0,
    perfumes: 0,
    watches: 0,
  };
  
  products.forEach(product => {
    if (product.type && counts.hasOwnProperty(product.type)) {
      counts[product.type]++;
    }
  });
  
  return counts;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { q, category, page = '1', limit = '30' } = req.query;
  const allProducts = await getCachedProducts();
  const pageNum = parseInt(page as string, 10);
  const limitNum = parseInt(limit as string, 10);
  const offset = (pageNum - 1) * limitNum;

  // If no query and no category, return category counts only
  if (!q && !category) {
    const categoryCounts = getCategoryCounts(allProducts);
    return res.status(200).json({
      products: [],
      categoryCounts,
      total: 0,
      page: 1,
      totalPages: 0
    });
  }

  // If category is provided and no query, return paginated results from that category
  if (!q && typeof category === 'string') {
    const catProducts = allProducts.filter(p => p.type === category);
    const paginatedProducts = catProducts.slice(offset, offset + limitNum);
    const categoryCounts = getCategoryCounts(allProducts);
    
    return res.status(200).json({ 
      products: paginatedProducts,
      total: catProducts.length,
      page: pageNum,
      totalPages: Math.ceil(catProducts.length / limitNum),
      categoryCounts
    });
  }

  // If query is provided, use search index for faster filtering
  if (typeof q === 'string') {
    const normalizedQuery = normalize(q);
    const queryWords = normalizedQuery.split(/\s+/).filter(word => word.length >= 2);
    
    // Use search index for faster matching
    const matchingIndices = new Set<number>();
    
    if (queryWords.length > 0) {
      queryWords.forEach(word => {
        const indices = searchIndex.get(word) || [];
        indices.forEach(idx => matchingIndices.add(idx));
      });
    }
    
    // Fallback to full text search if index doesn't have results
    let results: any[];
    if (matchingIndices.size > 0) {
      results = Array.from(matchingIndices).map(idx => allProducts[idx]);
    } else {
      results = allProducts.filter(
        p =>
          (p.brand && normalize(p.brand).includes(normalizedQuery)) ||
          (p.productName && normalize(p.productName).includes(normalizedQuery)) ||
          (p.title && normalize(p.title).includes(normalizedQuery)) ||
          (p.name && normalize(p.name).includes(normalizedQuery))
      );
    }
    
    // Filter by category if specified
    if (category && typeof category === 'string') {
      results = results.filter(p => p.type === category);
    }
    
    const paginatedResults = results.slice(offset, offset + limitNum);
    const categoryCounts = getCategoryCounts(allProducts);
    
    return res.status(200).json({ 
      products: paginatedResults,
      total: results.length,
      page: pageNum,
      totalPages: Math.ceil(results.length / limitNum),
      categoryCounts
    });
  }

  return res.status(400).json({ error: 'Invalid request' });
} 