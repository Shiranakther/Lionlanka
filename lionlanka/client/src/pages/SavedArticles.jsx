import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Bookmark, Inbox } from 'lucide-react';
import ArticleCard from '../components/ui/ArticleCard';
import { ArticleCardSkeleton } from '../components/ui/Skeleton';
import { fetchSavedArticles } from '../store/articlesSlice';

const SavedArticles = () => {
  const dispatch = useDispatch();
  const { savedArticles, loading } = useSelector((state) => state.articles);

  useEffect(() => {
    dispatch(fetchSavedArticles());
  }, [dispatch]);

  // Extract populated articles from saved items
  const articles = savedArticles
    .map(item => item.articleId)
    .filter(article => article != null); // Ensure it's populated and exists

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="min-h-screen bg-deep pt-24 pb-20"
    >
      <Helmet>
        <title>Saved Articles — Lion Lanka</title>
      </Helmet>

      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        
        <div className="flex items-center gap-4 mb-10 border-b border-white/10 pb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
            <Bookmark size={24} className="text-white fill-white/20" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-cinzel font-bold text-white">Saved Library</h1>
            <p className="text-muted text-sm mt-1">Articles you've saved to read later.</p>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => <ArticleCardSkeleton key={i} />)}
          </div>
        ) : articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <ArticleCard key={article._id} article={article} isSaved={true} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 text-center bg-surface border border-white/5 rounded-3xl mt-8">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 border border-white/10">
              <Inbox size={32} className="text-muted" />
            </div>
            <h3 className="text-2xl font-cinzel font-bold text-white mb-3">Your library is empty</h3>
            <p className="text-muted max-w-md mb-8 leading-relaxed">
              You haven't saved any articles yet. Explore our collection of historical stories and click the bookmark icon to save them here.
            </p>
            <Link to="/articles" className="btn-primary">
              Explore Articles
            </Link>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default SavedArticles;
