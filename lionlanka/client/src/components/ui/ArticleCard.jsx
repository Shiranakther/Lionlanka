import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { Bookmark, Clock, Eye, Heart } from 'lucide-react';
import toast from 'react-hot-toast';
import { saveArticle, removeSavedArticle } from '../../store/articlesSlice';
import { formatDate, calculateReadingTime, truncateText, stripHtml } from '../../utils/helpers';

const ArticleCard = ({ article, isSaved = false }) => {
  const { isAuthenticated } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSaveClick = (e) => {
    e.preventDefault(); // Prevent navigating to article
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error('Please login to save articles');
      navigate('/login');
      return;
    }

    if (isSaved) {
      dispatch(removeSavedArticle(article._id))
        .unwrap()
        .then(() => toast.success('Removed from saved articles'))
        .catch(err => toast.error(err || 'Failed to remove'));
    } else {
      dispatch(saveArticle(article._id))
        .unwrap()
        .then(() => toast.success('Article saved!'))
        .catch(err => toast.error(err || 'Failed to save'));
    }
  };

  const API_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000').replace(/\/+$/, '');
  const coverImageUrl = article.coverImage ? (article.coverImage.startsWith('http') ? article.coverImage : `${API_URL}${article.coverImage}`) : null;
  const authorAvatarUrl = article.author?.profileImage ? (article.author.profileImage.startsWith('http') ? article.author.profileImage : `${API_URL}${article.author.profileImage}`) : null;

  const readTime = article.readingTime || calculateReadingTime(article.content);
  const excerptText = article.excerpt || truncateText(stripHtml(article.content), 120);

  return (
    <motion.div 
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
      className="card flex flex-col h-full relative group"
    >
      <Link to={`/articles/${article.slug}`} className="absolute inset-0 z-10"></Link>
      
      {/* Cover Image */}
      <div className="relative h-48 w-full overflow-hidden rounded-t-2xl">
        {coverImageUrl ? (
          <img 
            src={coverImageUrl} 
            alt={article.title} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-[var(--grad-card)] flex items-center justify-center">
            <span className="text-white/20 font-cinzel text-xl opacity-50">LionLanka</span>
          </div>
        )}

        {/* Category Badge */}
        <div className="absolute top-4 left-4 z-20">
          <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-white bg-gradient-to-r from-primary to-accent shadow-lg">
            {article.category}
          </span>
        </div>

        {/* Bookmark Button */}
        <button 
          onClick={handleSaveClick}
          className="absolute top-4 right-4 z-20 p-2 rounded-full glass hover:bg-white/10 transition-colors"
          title={isSaved ? "Remove from saved" : "Save article"}
        >
          <Bookmark 
            size={18} 
            className={isSaved ? "fill-primary text-primary" : "text-white"} 
          />
        </button>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-lg font-semibold text-text-main leading-snug mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {article.title}
        </h3>
        
        <p className="text-sm text-muted mb-4 line-clamp-3 flex-1">
          {excerptText}
        </p>

        <div className="mt-auto flex flex-col gap-3">
          {/* Meta row 1 */}
          <div className="flex justify-between items-center text-xs text-muted">
            <div className="flex items-center gap-2">
              <Clock size={14} />
              <span>{readTime} min read</span>
            </div>
            <span>{formatDate(article.createdAt)}</span>
          </div>
          
          <div className="h-px w-full bg-white/5"></div>

          {/* Meta row 2 */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 relative z-20">
              {authorAvatarUrl ? (
                <img src={authorAvatarUrl} alt={article.author?.name} className="w-6 h-6 rounded-full object-cover" />
              ) : (
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">
                  {article.author?.name?.charAt(0).toUpperCase() || 'A'}
                </div>
              )}
              <span className="text-xs font-medium text-text-main">{article.author?.name || 'Unknown Author'}</span>
            </div>
            
            <div className="flex items-center gap-3 text-xs text-muted">
              <span className="flex items-center gap-1"><Eye size={14} /> {article.views || 0}</span>
              <span className="flex items-center gap-1"><Heart size={14} /> {article.likes?.length || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ArticleCard;
