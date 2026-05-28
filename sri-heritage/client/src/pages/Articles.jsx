import React, { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useInView } from 'react-intersection-observer';
import { useDispatch, useSelector } from 'react-redux';
import { Filter, Search } from 'lucide-react';
import ArticleCard from '../components/ui/ArticleCard';
import SearchBar from '../components/ui/SearchBar';
import { ArticleCardSkeleton } from '../components/ui/Skeleton';
import { getArticlesAPI } from '../services/articleService';
import { CATEGORIES, PERIODS, SORT_OPTIONS } from '../utils/constants';

const Articles = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  
  // Filters
  const [category, setCategory] = useState('');
  const [period, setPeriod] = useState('');
  const [sort, setSort] = useState('Newest');
  const [search, setSearch] = useState('');

  const { ref, inView } = useInView({ threshold: 0 });

  const fetchArticlesData = async (pageNum, isInitial = false) => {
    try {
      if (isInitial) setLoading(true);
      else setLoadingMore(true);

      const params = {
        page: pageNum,
        limit: 9,
        category,
        historicalPeriod: period,
        sort,
        search
      };

      const res = await getArticlesAPI(params);
      
      if (isInitial) {
        setArticles(res.data.articles);
      } else {
        setArticles(prev => [...prev, ...res.data.articles]);
      }
      
      setHasMore(pageNum < res.data.pages);
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Initial fetch and filter changes
  useEffect(() => {
    setPage(1);
    fetchArticlesData(1, true);
  }, [category, period, sort, search]);

  // Infinite scroll
  useEffect(() => {
    if (inView && hasMore && !loading && !loadingMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchArticlesData(nextPage, false);
    }
  }, [inView, hasMore, loading, loadingMore]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-deep pt-24 pb-20"
    >
      <Helmet>
        <title>Articles — Lion Lanka</title>
        <meta name="description" content="Read articles about Sri Lanka's ancient history, kings, Buddhism, and culture." />
      </Helmet>

      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        
        {/* Header & Search */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-10">
          <div className="w-full md:w-1/2">
            <h1 className="text-4xl md:text-5xl font-cinzel font-bold text-white mb-4">Historical Articles</h1>
            <p className="text-muted">Immerse yourself in tales of ancient kingdoms, legendary kings, and cultural marvels.</p>
          </div>
          <div className="w-full md:w-1/2 lg:w-1/3">
            <SearchBar placeholder="Search articles..." onSearch={setSearch} />
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-12 p-4 bg-surface rounded-2xl border border-white/5">
          <div className="flex items-center gap-2 text-muted mr-2">
            <Filter size={18} /> <span className="text-sm font-semibold uppercase tracking-wider">Filters:</span>
          </div>
          
          <select 
            value={category} 
            onChange={(e) => setCategory(e.target.value)}
            className="bg-deep border border-white/10 rounded-lg px-4 py-2 text-sm text-text-main outline-none focus:border-primary transition-colors"
          >
            <option value="">All Categories</option>
            {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>

          <select 
            value={period} 
            onChange={(e) => setPeriod(e.target.value)}
            className="bg-deep border border-white/10 rounded-lg px-4 py-2 text-sm text-text-main outline-none focus:border-primary transition-colors"
          >
            <option value="">All Periods</option>
            {PERIODS.map(p => <option key={p} value={p}>{p}</option>)}
          </select>

          <select 
            value={sort} 
            onChange={(e) => setSort(e.target.value)}
            className="bg-deep border border-white/10 rounded-lg px-4 py-2 text-sm text-text-main outline-none focus:border-primary transition-colors ml-auto"
          >
            <option value="Newest">Newest First</option>
            <option value="Most Viewed">Most Viewed</option>
            <option value="Most Liked">Most Liked</option>
          </select>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => <ArticleCardSkeleton key={i} />)}
          </div>
        ) : articles.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((article) => (
                <ArticleCard key={article._id} article={article} />
              ))}
            </div>
            
            {/* Infinite Scroll trigger */}
            <div ref={ref} className="w-full flex justify-center py-10">
              {loadingMore && <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>}
              {!hasMore && articles.length > 0 && <p className="text-muted text-sm">You've reached the end of the archives.</p>}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6 border border-white/10">
              <Search size={40} className="text-muted" />
            </div>
            <h3 className="text-2xl font-cinzel font-bold text-white mb-2">No articles found</h3>
            <p className="text-muted max-w-md">Try adjusting your filters or search query to find what you're looking for.</p>
            <button 
              onClick={() => { setCategory(''); setPeriod(''); setSearch(''); setSort('Newest'); }} 
              className="mt-6 btn-ghost"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Articles;
