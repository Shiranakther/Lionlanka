import React, { useState, useEffect } from 'react';
import { Trash2, Search, ExternalLink, CheckCircle, PenSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import adminService from '../../services/adminService';
import toast from 'react-hot-toast';

const AdminArticles = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const data = await adminService.getAllArticles();
      setArticles(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch articles');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this article?')) return;
    try {
      await adminService.deleteArticle(id);
      setArticles(articles.filter(a => a._id !== id));
      toast.success('Article deleted successfully');
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete article');
    }
  };

  const handleApprove = async (id) => {
    try {
      await adminService.approveArticleAPI(id);
      setArticles(articles.map(a => a._id === id ? { ...a, status: 'published' } : a));
      toast.success('Article approved successfully');
    } catch (error) {
      console.error(error);
      toast.error('Failed to approve article');
    }
  };

  const filteredArticles = articles.filter(a => 
    a.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.author?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-cinzel font-bold text-white mb-2">Manage Articles</h1>
          <p className="text-text-muted">Review and moderate user-generated articles.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-64 pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          <Link
            to="/create-article"
            className="w-full sm:w-auto btn-primary py-2 px-4 flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <PenSquare size={18} /> Create Article
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="animate-pulse h-96 bg-white/5 rounded-2xl"></div>
      ) : (
        <div className="glass rounded-2xl border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 border-b border-white/10">
                  <th className="p-4 text-text-muted font-medium">Title</th>
                  <th className="p-4 text-text-muted font-medium">Author</th>
                  <th className="p-4 text-text-muted font-medium">Status</th>
                  <th className="p-4 text-text-muted font-medium">Date</th>
                  <th className="p-4 text-text-muted font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredArticles.length > 0 ? (
                  filteredArticles.map((article) => (
                    <tr key={article._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="p-4">
                        <span className="text-white font-medium line-clamp-1">{article.title}</span>
                      </td>
                      <td className="p-4 text-text-main">{article.author?.name || 'Unknown'}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          article.status === 'published' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {article.status || 'draft'}
                        </span>
                      </td>
                      <td className="p-4 text-text-muted text-sm">
                        {new Date(article.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {article.status === 'in-review' && (
                            <button
                              onClick={() => handleApprove(article._id)}
                              className="p-2 text-text-muted hover:text-green-400 hover:bg-green-400/10 rounded-lg transition-colors"
                              title="Approve Article"
                            >
                              <CheckCircle size={18} />
                            </button>
                          )}
                          <Link
                            to={`/articles/${article.slug}`}
                            className="p-2 text-text-muted hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                            title="View Article"
                          >
                            <ExternalLink size={18} />
                          </Link>
                          <Link
                            to={`/edit-article/${article._id}`}
                            className="p-2 text-text-muted hover:text-yellow-400 hover:bg-yellow-400/10 rounded-lg transition-colors"
                            title="Edit Article"
                          >
                            <PenSquare size={18} />
                          </Link>
                          <button
                            onClick={() => handleDelete(article._id)}
                            className="p-2 text-text-muted hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                            title="Delete Article"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-text-muted">No articles found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminArticles;
