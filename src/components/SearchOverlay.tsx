import React, { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import debounce from 'lodash.debounce';
import { FixedSizeList as List } from 'react-window';
import { useProductContext } from '../context/ProductContext';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Product {
  id: string;
  brand?: string;
  productName?: string;
  title?: string;
  name?: string;
  images?: string[];
  type?: string;
}

interface SearchResults {
  products: Product[];
  total: number;
  page: number;
  totalPages: number;
  categoryCounts?: Record<string, number>;
}

const ITEM_HEIGHT = 100;
const LIST_HEIGHT = 600;
const CATEGORIES = [
  { key: 'sneakers', label: 'Sneakers' },
  { key: 'apparel', label: 'Apparel' },
  { key: 'accessories', label: 'Accessories' },
  { key: 'perfumes', label: 'Perfumes' },
  { key: 'watches', label: 'Watches' },
];

const SearchOverlay: React.FC<SearchOverlayProps> = ({ isOpen, onClose }) => {
  const { searchData } = useProductContext();
  const [input, setInput] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('sneakers');
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({});
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<List>(null);

  // Live search with debouncing
  const debouncedSearch = useCallback(
    debounce(async (query: string, category: string = '', page: number = 1) => {
      if (!query.trim() && !category) {
        setResults([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (query.trim()) params.append('q', query.trim());
        if (category) params.append('category', category);
        params.append('page', page.toString());
        params.append('limit', '30'); // Show 30 results per page

        const res = await fetch(`/api/search?${params.toString()}`);
        const data: SearchResults = await res.json();
        
        if (page === 1) {
          setResults(data.products || []);
        } else {
          setResults(prev => [...prev, ...(data.products || [])]);
        }
        
        // setTotalPages(data.totalPages || 1); // Removed unused variable
        setTotalResults(data.total || 0);
        setHasMore(page < (data.totalPages || 1));
        
        if (data.categoryCounts) {
          setCategoryCounts(data.categoryCounts);
        }

        // Add to search history
        if (query.trim() && !searchHistory.includes(query.trim())) {
          setSearchHistory(prev => [query.trim(), ...prev.slice(0, 4)]);
        }
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300),
    [searchHistory]
  );

  // Load more results
  const loadMore = useCallback(() => {
    if (!loading && hasMore && (input.trim() || activeCategory)) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      debouncedSearch(input, activeCategory, nextPage);
    }
  }, [loading, hasMore, input, activeCategory, currentPage, debouncedSearch]);

  // Handle search input
  const handleSearch = useCallback((query: string, category: string = '') => {
    setCurrentPage(1);
    setResults([]);
    setHasMore(true);
    debouncedSearch(query, category, 1);
  }, [debouncedSearch]);

  // Handle input change
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);
    if (value) {
      setActiveCategory('');
      handleSearch(value);
    } else {
      setResults([]);
      setLoading(false);
      setActiveCategory('sneakers');
      handleSearch('', 'sneakers');
    }
  };

  // Handle category click
  const handleCategoryClick = (cat: string) => {
    setActiveCategory(cat);
    setInput('');
    setCurrentPage(1);
    setResults([]);
    setHasMore(true);
    handleSearch('', cat);
  };

  // Handle search history click
  const handleSearchHistoryClick = (query: string) => {
    setInput(query);
    setActiveCategory('');
  };

  // Handle close
  const handleCloseClick = () => {
    if (input.trim()) {
      setInput('');
      setResults([]);
      setActiveCategory('sneakers');
      handleSearch('', 'sneakers');
    } else {
      onClose();
    }
  };

  // Initialize with category counts
  useEffect(() => {
    if (isOpen && !input && !activeCategory) {
      // Load initial category counts
      fetch('/api/search')
        .then(res => res.json())
        .then(data => {
          if (data.categoryCounts) {
            setCategoryCounts(data.categoryCounts);
          }
        })
        .catch(console.error);
    }
  }, [isOpen, input, activeCategory]);

  // Auto-trigger sneaker search when overlay opens
  useEffect(() => {
    if (isOpen && activeCategory === 'sneakers' && !input) {
      handleSearch('', 'sneakers');
    }
  }, [isOpen, activeCategory, input, handleSearch]);

  // Reset state when overlay closes
  useEffect(() => {
    if (!isOpen) {
      setInput('');
      setResults([]);
      setLoading(false);
      setActiveCategory('sneakers');
      setCurrentPage(1);
      // setTotalPages(1); // Removed unused variable
      setTotalResults(0);
      setHasMore(true);
    }
  }, [isOpen]);

  // Focus input when overlay opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const NAVBAR_HEIGHT = 60;
  const OVERLAY_HEIGHT = '80vh';

  return (
    <>
      {/* Backdrop with blur effect */}
      <div 
        style={{
          position: 'fixed',
          top: NAVBAR_HEIGHT,
          left: 0,
          width: '100vw',
          height: `calc(100vh - ${NAVBAR_HEIGHT}px)`,
          background: 'rgba(0, 0, 0, 0.3)',
          backdropFilter: 'blur(4px)',
          zIndex: 1999,
        }}
        onClick={onClose}
      />
      
      {/* Search Overlay */}
      <div 
        style={{
          position: 'fixed',
          top: NAVBAR_HEIGHT,
          left: 0,
          width: '100vw',
          height: OVERLAY_HEIGHT,
          background: '#fff',
          zIndex: 2000,
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 8px 32px rgba(30,40,90,0.10)',
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
          animation: 'slideDown 0.3s ease-out'
        }}
      >
        <style>{`
          @keyframes slideDown {
            from { transform: translateY(-100%); }
            to { transform: translateY(0); }
          }
        `}</style>
        
        {/* Fixed Header Section */}
        <div style={{flexShrink:0,padding:'24px 24px 0 24px',background:'#fff'}}>
          <div style={{maxWidth:1100,margin:'0 auto'}}>
            {/* Search Input */}
            <div style={{marginBottom:18}}>
              <div style={{display:'flex',alignItems:'center',border:'1.5px solid #bfc9d1',borderRadius:0,background:'#f7fafd',height:54}}>
                <Image src="/nav/search.svg" alt="Search" width={35} height={35} style={{marginLeft:18,marginRight:8,opacity:0.6,filter:'brightness(0) saturate(100%) invert(8%) sepia(10%) saturate(7482%) hue-rotate(180deg) brightness(95%) contrast(101%)'}} />
                <input
                  ref={inputRef}
                  value={input}
                  onChange={handleInput}
                  placeholder="Search For..."
                  style={{flex:1,fontSize:'1.25rem',padding:'0 18px',border:'none',background:'transparent',height:'100%',outline:'none',fontFamily:'Inter'}} 
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && input.trim()) {
                      window.location.href = `/search?query=${encodeURIComponent(input.trim())}`;
                    }
                  }}
                />
                <button onClick={handleCloseClick} style={{marginRight:16,fontSize:'2rem',background:'none',border:'none',cursor:'pointer',color:'#07202c'}}>×</button>
              </div>
            </div>

            {/* Search History */}
            {!input && !activeCategory && searchHistory.length > 0 && (
              <div style={{marginBottom: 16}}>
                <div style={{fontSize: '0.9rem', color: '#666', marginBottom: 8}}>Recent searches:</div>
                <div style={{display: 'flex', flexWrap: 'wrap', gap: 8}}>
                  {searchHistory.map((query, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSearchHistoryClick(query)}
                      style={{
                        padding: '4px 12px',
                        background: '#f0f0f0',
                        border: 'none',
                        borderRadius: '16px',
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                        color: '#333'
                      }}
                    >
                      {query}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Category Chips with Full Counts */}
            <div style={{display:'flex',gap:12,flexWrap:'wrap',marginBottom:16}}>
              {CATEGORIES.map(cat => (
                <button
                  key={cat.key}
                  onClick={() => handleCategoryClick(cat.key)}
                  style={{
                    padding:'8px 16px',
                    border:'1px solid #e6e8ea',
                    borderRadius:0,
                    background:activeCategory === cat.key ? '#22304a' : 'transparent',
                    color:activeCategory === cat.key ? '#fff' : '#22304a',
                    cursor:'pointer',
                    fontSize:'0.9rem',
                    fontFamily:'Inter',
                    transition:'all 0.2s ease'
                  }}
                >
                  {cat.label} {categoryCounts[cat.key] && `(${categoryCounts[cat.key]})`}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div style={{flex:'1 1 0%',overflowY:'auto',padding:'0 24px 24px',background:'#fff'}}>
          <div style={{maxWidth:1100,margin:'0 auto'}}>
            <div style={{background:'#fff',borderRadius:0,boxShadow:'0 2px 8px rgba(30,167,253,0.04)',padding:'0',marginTop:8}}>
              {loading && results.length === 0 ? (
                <div style={{padding:'32px 0',textAlign:'center',color:'#22304a',fontFamily:'Inter',fontSize:'1.2rem',opacity:0.7,background:'#fff'}}>
                  <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:8}}>
                    <div style={{
                      width:20,
                      height:20,
                      border:'2px solid #e6e8ea',
                      borderTop:'2px solid #22304a',
                      borderRadius:'50%',
                      animation:'spin 1s linear infinite'
                    }}></div>
                    Searching...
                  </div>
                  <style>{`
                    @keyframes spin {
                      0% { transform: rotate(0deg); }
                      100% { transform: rotate(360deg); }
                    }
                  `}</style>
                </div>
              ) : results.length === 0 ? (
                <div style={{padding:'32px 0',textAlign:'center',color:'#22304a',fontFamily:'Inter',fontSize:'1.2rem',opacity:0.7,background:'#fff'}}>
                  {input || activeCategory ? 'No products found.' : 'Start typing to search...'}
                </div>
              ) : (
                <div style={{background:'#fff'}}>
                  {/* Results count */}
                  <div style={{padding:'16px 0',borderBottom:'1px solid #e6e8ea',color:'#666',fontSize:'0.9rem',fontFamily:'Inter'}}>
                    {totalResults > 0 && (
                      <>
                        Showing {results.length} of {totalResults} results
                        {activeCategory && ` in ${CATEGORIES.find(c => c.key === activeCategory)?.label}`}
                        {input && ` for "${input}"`}
                      </>
                    )}
                  </div>
                  
                  <List
                    ref={listRef}
                    height={LIST_HEIGHT}
                    itemCount={results.length + (hasMore ? 1 : 0)}
                    itemSize={ITEM_HEIGHT}
                    width={'100%'}
                    onScroll={({ scrollOffset, scrollUpdateWasRequested }) => {
                      if (!scrollUpdateWasRequested) {
                        const maxScroll = (results.length * ITEM_HEIGHT) - LIST_HEIGHT;
                        if (scrollOffset >= maxScroll - 100 && hasMore && !loading) {
                          loadMore();
                        }
                      }
                    }}
                  >
                    {({ index, style }: { index: number; style: React.CSSProperties }) => {
                      if (index === results.length) {
                        // Loading more indicator
                        return (
                          <div style={{...style, display:'flex',alignItems:'center',justifyContent:'center',padding:'20px'}}>
                            {loading ? (
                              <div style={{display:'flex',alignItems:'center',gap:8,color:'#666'}}>
                                <div style={{
                                  width:16,
                                  height:16,
                                  border:'2px solid #e6e8ea',
                                  borderTop:'2px solid #22304a',
                                  borderRadius:'50%',
                                  animation:'spin 1s linear infinite'
                                }}></div>
                                Loading more...
                              </div>
                            ) : hasMore ? (
                              <button
                                onClick={loadMore}
                                style={{
                                  padding:'8px 16px',
                                  background:'#22304a',
                                  color:'#fff',
                                  border:'none',
                                  borderRadius:4,
                                  cursor:'pointer',
                                  fontSize:'0.9rem'
                                }}
                              >
                                Load More
                              </button>
                            ) : null}
                          </div>
                        );
                      }

                      const product = results[index];
                      // Get product link
                      let href = '#';
                      if (product.type === 'sneakers') href = `/sneaker/${product.id}`;
                      else if (product.type === 'watches') href = `/watch/${product.id}`;
                      else if (product.type === 'perfumes') href = `/perfume/${product.id}`;
                      else if (product.type === 'apparel') href = `/apparel/${product.id}`;
                      else if (product.type === 'accessories') href = `/accessory/${product.id}`;
                      
                      return (
                        <a
                          href={href}
                          style={{textDecoration:'none', color:'inherit'}} 
                          key={product.id}
                          tabIndex={0}
                          onClick={() => {
                            // For accessibility, allow normal navigation
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              window.location.href = href;
                            }
                          }}
                          aria-label={`Go to product: ${(product.brand || '') + ' ' + (product.productName || product.name || product.title || '')}`}
                        >
                          <div style={{...style, display:'flex',alignItems:'center',padding:'18px 0',borderBottom:index!==results.length-1?'1.5px solid #e6e8ea':'none',background:'#fff'}}>
                            <div style={{width:90,height:90,flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center',marginLeft:8,marginRight:24,background:'#fff',borderRadius:8}}>
                              {product.images && product.images[0] && (
                                <Image 
                                  src={product.images[0]} 
                                  alt={product.productName || product.title || ''} 
                                  width={80} 
                                  height={80} 
                                  style={{borderRadius:8,objectFit:'contain',background:'#fff'}}
                                  loading="lazy"
                                  placeholder="blur"
                                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = '/blue_nav_icons/Blue PLUTUS LOGO.svg';
                                    target.style.width = '120px';
                                    target.style.height = '120px';
                                  }}
                                />
                              )}
                              {(!product.images || !product.images[0]) && (
                                <Image 
                                  src={'/placeholder.png'} 
                                  alt="No image" 
                                  width={80} 
                                  height={80} 
                                  style={{borderRadius:8,objectFit:'contain',background:'#fff'}}
                                  loading="lazy"
                                />
                              )}
                              {/* White fallback for loading */}
                              <div style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: 80,
                                height: 80,
                                background: '#fff',
                                borderRadius: 8,
                                display: 'none'
                              }}></div>
                            </div>
                            <div style={{flex:1,minWidth:0,background:'#fff'}}>
                              <div style={{fontFamily:'Times New Roman',fontSize:'1.18rem',fontWeight:600,color:'#22304a',marginBottom:2,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>
                                {product.brand || ''} {product.productName || product.name || product.title || ''}
                              </div>
                              <div style={{fontFamily:'Inter',fontSize:'1.05rem',color:'#22304a',opacity:0.8,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>
                                {product.type || 'Product'}
                              </div>
                            </div>
                          </div>
                        </a>
                      );
                    }}
                  </List>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchOverlay; 