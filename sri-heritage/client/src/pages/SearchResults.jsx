import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Search, MapPin, FileText } from 'lucide-react';
import ArticleCard from '../components/ui/ArticleCard';
import PlaceCard from '../components/ui/PlaceCard';
import SearchBar from '../components/ui/SearchBar';
import { ArticleCardSkeleton, PlaceCardSkeleton } from '../components/ui/Skeleton';
import { getArticlesAPI } from '../services/articleService';
import API from '../services/api';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [loading, setLoading] = useState(true);
  const [articles, setArticles] = useState([]);
  const [places, setPlaces] = useState([]);
  const [activeTab, setActiveTab] = useState('all'); // all, articles, places

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) {
        setLoading(false);
        return;
      }
      
      setLoading(true);
      try {
        // Fetch both concurrently
        const [articlesRes, placesRes] = await Promise.all([
          getArticlesAPI({ search: query, limit: 10 }),
          API.get('/api/places', { params: { search: query } })
        ]);

        setArticles(articlesRes.data.articles);
        setPlaces(placesRes.data.places);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  const totalResults = articles.length + places.length;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-deep pt-24 pb-20"
    >
      <Helmet>
        <title>Search: {query} — Lion Lanka</title>
      </Helmet>

      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        
        {/* Search Header */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-cinzel font-bold text-white mb-6">
             Search Results
          </h1>
          <SearchBar placeholder="Search again..." />
          {query && !loading && (
             <p className="text-muted mt-6 text-lg">
                Found <span className="text-white font-bold">{totalResults}</span> results for <span className="text-primary">"{query}"</span>
             </p>
          )}
        </div>

        {/* Tabs */}
        {query && !loading && totalResults > 0 && (
          <div className="flex justify-center mb-10 border-b border-white/10">
            <div className="flex gap-8">
              <button 
                onClick={() => setActiveTab('all')}
                className={`pb-4 text-sm font-semibold uppercase tracking-wider transition-colors relative ${activeTab === 'all' ? 'text-primary' : 'text-muted hover:text-white'}`}
              >
                All ({totalResults})
                {activeTab === 'all' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-full"></span>}
              </button>
              <button 
                onClick={() => setActiveTab('articles')}
                className={`pb-4 text-sm font-semibold uppercase tracking-wider transition-colors relative flex items-center gap-2 ${activeTab === 'articles' ? 'text-primary' : 'text-muted hover:text-white'}`}
              >
                <FileText size={16} /> Articles ({articles.length})
                {activeTab === 'articles' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-full"></span>}
              </button>
              <button 
                onClick={() => setActiveTab('places')}
                className={`pb-4 text-sm font-semibold uppercase tracking-wider transition-colors relative flex items-center gap-2 ${activeTab === 'places' ? 'text-primary' : 'text-muted hover:text-white'}`}
              >
                <MapPin size={16} /> Places ({places.length})
                {activeTab === 'places' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-full"></span>}
              </button>
            </div>
          </div>
        )}

        {/* Results Area */}
        <div className="space-y-16">
          
          {loading ? (
             <div>
                <h2 className="text-xl font-cinzel text-white mb-6">Searching...</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   <ArticleCardSkeleton /><ArticleCardSkeleton /><ArticleCardSkeleton />
                </div>
             </div>
          ) : !query ? (
             <div className="text-center py-20">
                <Search size={48} className="mx-auto text-muted mb-4 opacity-50" />
                <h3 className="text-2xl font-cinzel text-white mb-2">Enter a search term</h3>
                <p className="text-muted">Type something in the search bar above to begin.</p>
             </div>
          ) : totalResults === 0 ? (
             <div className="text-center py-20 bg-surface border border-white/5 rounded-3xl">
                <Search size={48} className="mx-auto text-muted mb-4 opacity-30" />
                <h3 className="text-2xl font-cinzel text-white mb-2">No results found</h3>
                <p className="text-muted">Try using different keywords, or check for typos.</p>
             </div>
          ) : (
            <>
              {/* Places Section */}
              {(activeTab === 'all' || activeTab === 'places') && places.length > 0 && (
                <section>
                  <div className="flex items-center justify-between mb-6">
                     <h2 className="text-2xl font-cinzel font-bold text-white flex items-center gap-2">
                       <MapPin className="text-primary" /> Places
                     </h2>
                     {activeTab === 'all' && places.length > 3 && (
                       <button onClick={() => setActiveTab('places')} className="text-sm text-primary hover:underline">View all places</button>
                     )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {places.slice(0, activeTab === 'all' ? 3 : undefined).map(place => (
                      <PlaceCard key={place._id} place={place} />
                    ))}
                  </div>
                </section>
              )}

              {/* Articles Section */}
              {(activeTab === 'all' || activeTab === 'articles') && articles.length > 0 && (
                <section>
                  <div className="flex items-center justify-between mb-6">
                     <h2 className="text-2xl font-cinzel font-bold text-white flex items-center gap-2">
                       <FileText className="text-primary" /> Articles
                     </h2>
                     {activeTab === 'all' && articles.length > 6 && (
                       <button onClick={() => setActiveTab('articles')} className="text-sm text-primary hover:underline">View all articles</button>
                     )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {articles.slice(0, activeTab === 'all' ? 6 : undefined).map(article => (
                      <ArticleCard key={article._id} article={article} />
                    ))}
                  </div>
                </section>
              )}
            </>
          )}

        </div>
      </div>
    </motion.div>
  );
};

export default SearchResults;
