import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Clock, Eye, Heart, Bookmark, Share2, ChevronLeft, MapPin, PenSquare, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { ArticleDetailSkeleton } from '../components/ui/Skeleton';
import { getArticleAPI, toggleLikeAPI, getArticlesAPI } from '../services/articleService';
import { saveArticle, removeSavedArticle, fetchSavedArticles } from '../store/articlesSlice';
import { formatDate } from '../utils/helpers';
import API from '../services/api';

const ArticleDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const { savedArticles } = useSelector(state => state.articles);
  
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedArticles, setRelatedArticles] = useState([]);
  
  // Local state for immediate UI updates
  const [likes, setLikes] = useState([]);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const fetchArticle = async () => {
      setLoading(true);
      try {
        const res = await getArticleAPI(slug);
        setArticle(res.data.article);
        setLikes(res.data.article.likes || []);
        
        // Fetch related articles
        const relatedRes = await getArticlesAPI({ category: res.data.article.category, limit: 3 });
        // Filter out current article
        setRelatedArticles(relatedRes.data.articles.filter(a => a._id !== res.data.article._id).slice(0, 2));
      } catch (error) {
        toast.error('Article not found');
      } finally {
        setLoading(false);
      }
    };
    
    fetchArticle();
  }, [slug]);

  // Sync like/save status with user context
  useEffect(() => {
    if (isAuthenticated && user && article) {
      setIsLiked(likes.includes(user.id));
      setIsSaved(savedArticles.some(saved => saved.articleId?._id === article._id || saved.articleId === article._id));
    } else {
      setIsLiked(false);
      setIsSaved(false);
    }
  }, [isAuthenticated, user, article, likes, savedArticles]);

  // Load saved articles if authenticated to check save status
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchSavedArticles());
    }
  }, [isAuthenticated, dispatch]);

  const handleLike = async () => {
    if (!isAuthenticated) return toast.error('Please login to like this article');
    
    // Optimistic UI update
    const previousLikes = [...likes];
    const previousIsLiked = isLiked;
    
    setIsLiked(!isLiked);
    if (!isLiked) {
      setLikes([...likes, user.id]);
    } else {
      setLikes(likes.filter(id => id !== user.id));
    }
    
    try {
      const res = await toggleLikeAPI(article._id);
      setLikes(res.data.likes);
    } catch (err) {
      // Revert on error
      setIsLiked(previousIsLiked);
      setLikes(previousLikes);
      toast.error('Failed to update like');
    }
  };

  const handleSave = async () => {
    if (!isAuthenticated) return toast.error('Please login to save articles');
    
    try {
      if (isSaved) {
        await dispatch(removeSavedArticle(article._id)).unwrap();
        toast.success('Removed from saved articles');
      } else {
        await dispatch(saveArticle(article._id)).unwrap();
        toast.success('Article saved to your library');
      }
      // state updates automatically via Redux + useEffect above
    } catch (err) {
      toast.error('Failed to update saved status');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this article?')) return;
    try {
      await API.delete(`/api/articles/${article._id}`);
      toast.success('Article deleted successfully');
      navigate('/articles');
    } catch (err) {
      toast.error('Failed to delete article');
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article?.title,
        url: window.location.href
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  if (loading) return <div className="pt-20"><ArticleDetailSkeleton /></div>;
  if (!article) return <div className="min-h-screen pt-32 text-center"><h2 className="text-2xl text-white">Article not found.</h2></div>;

  const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
  const coverUrl = article.coverImage ? (article.coverImage.startsWith('http') ? article.coverImage : `${API_URL}${article.coverImage}`) : null;
  const authorImage = article.author?.profileImage ? (article.author.profileImage.startsWith('http') ? article.author.profileImage : `${API_URL}${article.author.profileImage}`) : null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-deep"
    >
      <Helmet>
        <title>{article.title} — Lion Lanka</title>
        <meta name="description" content={article.excerpt} />
      </Helmet>

      {/* Hero Section */}
      <div className="relative w-full h-[60vh] min-h-[400px] max-h-[600px] pt-20">
        <div className="absolute inset-0 z-0">
          {coverUrl ? (
            <img src={coverUrl} alt={article.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-[var(--grad-hero)]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-deep via-deep/80 to-transparent"></div>
        </div>

        <div className="container mx-auto px-4 md:px-6 lg:px-8 h-full relative z-10 flex flex-col justify-end pb-12">
          <Link to="/articles" className="inline-flex items-center gap-2 text-muted hover:text-white mb-6 transition-colors w-fit">
            <ChevronLeft size={16} /> Back to Articles
          </Link>
          
          <div className="mb-4">
            <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-white border border-white/20 bg-black/30 backdrop-blur-sm">
              {article.category}
            </span>
            {article.historicalPeriod && (
              <span className="ml-3 text-sm text-primary font-medium tracking-wide">
                • {article.historicalPeriod}
              </span>
            )}
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-cinzel font-bold text-white mb-6 leading-tight max-w-4xl">
            {article.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-6 text-sm text-muted">
            <div className="flex items-center gap-3">
              {authorImage ? (
                <img src={authorImage} alt={article.author?.name} className="w-10 h-10 rounded-full object-cover border-2 border-primary/30" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold border-2 border-primary/30">
                  {article.author?.name?.charAt(0).toUpperCase() || 'A'}
                </div>
              )}
              <span className="font-medium text-text-main">{article.author?.name || 'Admin'}</span>
            </div>
            
            <div className="hidden sm:block w-px h-6 bg-white/20"></div>
            
            <div className="flex items-center gap-2">
              <Clock size={16} /> {article.readingTime || 5} min read
            </div>
            
            <div className="flex items-center gap-2">
              <MapPin size={16} /> {formatDate(article.createdAt)}
            </div>
            
            <div className="flex items-center gap-2">
              <Eye size={16} /> {article.views} views
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Article Body */}
          <div className="w-full lg:w-2/3 xl:w-3/4">
            
            {/* Action Bar (Mobile only, sticks below header) */}
            <div className="flex lg:hidden items-center justify-between p-4 mb-8 bg-surface rounded-2xl border border-white/10">
               <div className="flex gap-4">
                 <button onClick={handleLike} className="flex items-center gap-2 text-muted hover:text-primary transition-colors">
                   <Heart size={20} className={isLiked ? "fill-primary text-primary" : ""} /> {likes.length}
                 </button>
               </div>
               <div className="flex gap-4">
                 <button onClick={handleSave} className="text-muted hover:text-primary transition-colors">
                   <Bookmark size={20} className={isSaved ? "fill-primary text-primary" : ""} />
                 </button>
                 <button onClick={handleShare} className="text-muted hover:text-white transition-colors">
                   <Share2 size={20} />
                 </button>
                 {isAuthenticated && user && (user.id === article.author?._id || user.role === 'admin') && (
                   <>
                     <Link to={`/edit-article/${article._id}`} className="text-muted hover:text-yellow-400 transition-colors">
                       <PenSquare size={20} />
                     </Link>
                     <button onClick={handleDelete} className="text-muted hover:text-red-400 transition-colors">
                       <Trash2 size={20} />
                     </button>
                   </>
                 )}
               </div>
            </div>

            <div className="prose prose-invert prose-lg max-w-none font-inter leading-relaxed text-text-main/90 prose-headings:font-cinzel prose-headings:text-white prose-a:text-primary hover:prose-a:text-accent prose-img:rounded-xl prose-img:shadow-lg prose-blockquote:border-l-primary prose-blockquote:bg-surface prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:rounded-r-lg prose-blockquote:italic"
                 dangerouslySetInnerHTML={{ __html: article.content }}>
            </div>
            
            {/* Gallery */}
            {article.images && article.images.length > 0 && (
              <div className="mt-12 pt-8 border-t border-white/10">
                <h3 className="font-cinzel font-bold text-2xl text-white mb-6">Gallery</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {article.images.map((img, idx) => (
                    <img key={idx} src={img.startsWith('http') ? img : `${API_URL}${img}`} alt={`Gallery ${idx + 1}`} className="w-full h-48 object-cover rounded-xl shadow-lg border border-white/10" />
                  ))}
                </div>
              </div>
            )}
            
            {/* Tags */}
            {article.tags && article.tags.length > 0 && (
              <div className="mt-12 pt-8 border-t border-white/10 flex flex-wrap gap-2">
                <span className="text-sm text-muted mr-2 flex items-center">Tags:</span>
                {article.tags.map(tag => (
                  <Link key={tag} to={`/articles?search=${tag}`} className="px-3 py-1 bg-white/5 hover:bg-primary/20 border border-white/10 hover:border-primary/30 rounded-lg text-sm text-text-main transition-colors">
                    #{tag}
                  </Link>
                ))}
              </div>
            )}
          </div>
          
          {/* Sidebar */}
          <div className="w-full lg:w-1/3 xl:w-1/4 space-y-8">
            
            {/* Action Card */}
            <div className="hidden lg:block sticky top-28 p-6 rounded-2xl bg-card border border-white/10 shadow-xl">
              <h3 className="font-cinzel font-bold text-lg text-white mb-6">Interact</h3>
              <div className="space-y-4">
                <button 
                  onClick={handleLike} 
                  className={`w-full flex items-center justify-between p-4 rounded-xl border transition-colors ${
                    isLiked ? 'bg-primary/10 border-primary/30 text-primary' : 'bg-white/5 border-white/10 text-text-main hover:bg-white/10'
                  }`}
                >
                  <span className="flex items-center gap-3 font-medium"><Heart size={20} className={isLiked ? "fill-primary" : ""} /> Like Article</span>
                  <span className="text-sm">{likes.length}</span>
                </button>
                
                <button 
                  onClick={handleSave} 
                  className={`w-full flex items-center justify-between p-4 rounded-xl border transition-colors ${
                    isSaved ? 'bg-primary/10 border-primary/30 text-primary' : 'bg-white/5 border-white/10 text-text-main hover:bg-white/10'
                  }`}
                >
                  <span className="flex items-center gap-3 font-medium"><Bookmark size={20} className={isSaved ? "fill-primary" : ""} /> {isSaved ? 'Saved' : 'Save for Later'}</span>
                </button>
                
                <button 
                  onClick={handleShare} 
                  className="w-full flex items-center justify-between p-4 rounded-xl border bg-white/5 border-white/10 text-text-main hover:bg-white/10 transition-colors"
                >
                  <span className="flex items-center gap-3 font-medium"><Share2 size={20} /> Share</span>
                </button>
                
                {isAuthenticated && user && (user.id === article.author?._id || user.role === 'admin') && (
                  <div className="pt-4 border-t border-white/10 space-y-4">
                    <Link 
                      to={`/edit-article/${article._id}`} 
                      className="w-full flex items-center justify-between p-4 rounded-xl border bg-yellow-500/10 border-yellow-500/20 text-yellow-400 hover:bg-yellow-500/20 transition-colors"
                    >
                      <span className="flex items-center gap-3 font-medium"><PenSquare size={20} /> Edit Article</span>
                    </Link>
                    <button 
                      onClick={handleDelete} 
                      className="w-full flex items-center justify-between p-4 rounded-xl border bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20 transition-colors"
                    >
                      <span className="flex items-center gap-3 font-medium"><Trash2 size={20} /> Delete Article</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Related Articles */}
            {relatedArticles.length > 0 && (
              <div className="p-6 rounded-2xl bg-surface border border-white/10">
                <h3 className="font-cinzel font-bold text-lg text-white mb-6">Related Stories</h3>
                <div className="space-y-6">
                  {relatedArticles.map(related => (
                    <Link key={related._id} to={`/articles/${related.slug}`} className="group block">
                      <div className="flex gap-4 items-start">
                        <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-white/5">
                           {related.coverImage && (
                             <img src={related.coverImage.startsWith('http') ? related.coverImage : `${API_URL}${related.coverImage}`} alt={related.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                           )}
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-text-main group-hover:text-primary transition-colors line-clamp-2 mb-1">
                            {related.title}
                          </h4>
                          <span className="text-xs text-muted block mb-1">{formatDate(related.createdAt)}</span>
                          <span className="text-[10px] uppercase tracking-wider text-primary">{related.category}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
            
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ArticleDetail;
