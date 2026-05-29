import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Requires custom dark overrides in index.css
import toast from 'react-hot-toast';
import { Save, Send, Eye, X, Image as ImageIcon, Wand2, Loader2, Plus, RefreshCw } from 'lucide-react';
import { CATEGORIES, PERIODS } from '../utils/constants';
import { calculateReadingTime } from '../utils/helpers';
import API from '../services/api';
import { generateImageAPI } from '../services/aiService';

const CreateArticle = () => {
  const { id } = useParams();
  const isEditing = !!id;
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    historicalPeriod: '',
    content: '',
    tags: []
  });
  const [tagInput, setTagInput] = useState('');
  const [coverImage, setCoverImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [additionalImages, setAdditionalImages] = useState([]);
  const [additionalPreviews, setAdditionalPreviews] = useState([]);
  
  const [showPreview, setShowPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // AI Image Gen State
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiGeneratedImage, setAiGeneratedImage] = useState(null);

  // Draft auto-save
  const draftKey = isEditing ? `draft_article_${id}` : 'draft_article_new';
  const saveTimeoutRef = useRef(null);

  useEffect(() => {
    // Load existing article or draft
    const loadData = async () => {
      if (isEditing) {
        try {
          const res = await API.get(`/api/articles/id/${id}`);
          const article = res.data.article;
          setFormData({
            title: article.title || '',
            category: article.category || '',
            historicalPeriod: article.historicalPeriod || '',
            content: article.content || '',
            tags: article.tags || []
          });
          const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
          if (article.coverImage) {
            const coverUrl = article.coverImage.startsWith('http') ? article.coverImage : `${API_URL}${article.coverImage}`;
            setPreviewImage(coverUrl);
          }
          if (article.images && article.images.length > 0) {
            setAdditionalPreviews(article.images.map(img => img.startsWith('http') ? img : `${API_URL}${img}`));
          }
        } catch (err) {
          toast.error('Failed to load article for editing');
        }
      } else {
        const draft = localStorage.getItem(draftKey);
        if (draft) {
          try {
             const parsed = JSON.parse(draft);
             setFormData(parsed);
             toast.success('Draft loaded');
          } catch(e) {}
        }
      }
    };
    loadData();
  }, [id, isEditing]);

  // Auto save draft
  useEffect(() => {
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      if (formData.title || formData.content) {
        localStorage.setItem(draftKey, JSON.stringify(formData));
      }
    }, 5000); // Save every 5s after change
    return () => clearTimeout(saveTimeoutRef.current);
  }, [formData, draftKey]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleContentChange = (content) => {
    setFormData({ ...formData, content });
  };

  const handleTagAdd = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!formData.tags.includes(tagInput.trim())) {
        setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] });
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData({ ...formData, tags: formData.tags.filter(t => t !== tagToRemove) });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleAdditionalImagesChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 3) {
      toast.error('You can only upload a maximum of 3 additional images');
      return;
    }
    setAdditionalImages(files.slice(0, 3));
    setAdditionalPreviews(files.slice(0, 3).map(file => URL.createObjectURL(file)));
  };

  const handleAIGenerate = async () => {
    if (!aiPrompt.trim()) return toast.error('Please enter a description for the AI');
    setAiGenerating(true);
    setAiGeneratedImage(null);
    try {
      const res = await generateImageAPI(aiPrompt);
      const imageStr = res.data.data;
      
      if (!imageStr) {
        toast.error('No image was returned. Try a different prompt.');
        return;
      }
      
      setAiGeneratedImage(imageStr);
      toast.success('Image generated successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to generate image');
    } finally {
      setAiGenerating(false);
    }
  };

  const urlToFile = async (url, filename) => {
    const res = await fetch(url);
    const blob = await res.blob();
    return new File([blob], filename, { type: blob.type || 'image/jpeg' });
  };

  const handleAddAICover = async () => {
    if (!aiGeneratedImage) return;
    try {
      const file = await urlToFile(aiGeneratedImage, `ai-cover-${Date.now()}.jpg`);
      setCoverImage(file);
      setPreviewImage(URL.createObjectURL(file));
      toast.success('Added as Cover Image');
    } catch(err) {
      toast.error('Error processing AI image');
    }
  };

  const handleAddAIGallery = async () => {
    if (!aiGeneratedImage) return;
    if (additionalImages.length >= 3) return toast.error('Maximum 3 additional images allowed');
    try {
      const file = await urlToFile(aiGeneratedImage, `ai-gallery-${Date.now()}.jpg`);
      setAdditionalImages([...additionalImages, file]);
      setAdditionalPreviews([...additionalPreviews, URL.createObjectURL(file)]);
      toast.success('Added to Gallery');
    } catch(err) {
      toast.error('Error processing AI image');
    }
  };

  const handleSubmit = async (status = 'published') => {
    if (!formData.title || !formData.content || !formData.category) {
      return toast.error('Please fill in required fields (Title, Content, Category)');
    }

    setIsSaving(true);
    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('content', formData.content);
      data.append('category', formData.category);
      if (formData.historicalPeriod) data.append('historicalPeriod', formData.historicalPeriod);
      data.append('tags', formData.tags.join(','));
      data.append('status', status);
      if (coverImage) {
        data.append('coverImage', coverImage);
      }
      additionalImages.forEach(img => {
        data.append('images', img);
      });

      let res;
      if (isEditing) {
        res = await API.put(`/api/articles/${id}`, data);
      } else {
        res = await API.post('/api/articles', data);
      }

      localStorage.removeItem(draftKey);
      toast.success(status === 'in-review' ? 'Submitted for approval!' : 'Draft saved!');
      navigate(`/articles/${res.data.article.slug}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save article');
    } finally {
      setIsSaving(false);
    }
  };

  const modules = {
    toolbar: [
      [{ 'header': [2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}],
      ['link', 'image'],
      ['clean']
    ],
  };

  const words = formData.content ? calculateReadingTime(formData.content) : 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-deep pt-24 pb-12"
    >
      <Helmet>
        <title>{isEditing ? 'Edit Article' : 'Create Article'} — Lion Lanka</title>
      </Helmet>

      <div className="container mx-auto px-4 h-full">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-cinzel font-bold text-white">
            {isEditing ? 'Edit Article' : 'Create New Article'}
          </h1>
          <div className="flex gap-3">
            <button 
              onClick={() => setShowPreview(!showPreview)}
              className="btn-ghost py-2 px-4 flex items-center gap-2"
            >
              <Eye size={18} /> {showPreview ? 'Edit' : 'Preview'}
            </button>
            <button 
              onClick={() => handleSubmit('draft')}
              disabled={isSaving}
              className="glass border border-white/20 text-white py-2 px-4 rounded-xl flex items-center gap-2 hover:bg-white/10"
            >
              <Save size={18} /> Save Draft
            </button>
            <button 
              onClick={() => handleSubmit('in-review')}
              disabled={isSaving}
              className="btn-primary py-2 px-6 flex items-center gap-2"
            >
              <Send size={18} /> Submit for Approval
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 h-full min-h-[70vh]">
          
          {/* Editor Form */}
          <div className={`w-full ${showPreview ? 'hidden lg:block lg:w-1/2' : 'lg:w-full'} space-y-6`}>
            
            {/* Title */}
            <div>
              <input 
                type="text" 
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Article Title"
                className="w-full bg-transparent border-b border-white/20 text-3xl font-cinzel text-white py-3 outline-none focus:border-primary transition-colors placeholder-muted"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Category */}
              <div>
                <label className="block text-sm text-muted mb-2">Category *</label>
                <select 
                  name="category" 
                  value={formData.category} 
                  onChange={handleChange}
                  className="w-full bg-surface border border-white/10 rounded-xl px-4 py-3 text-text-main outline-none focus:border-primary"
                >
                  <option value="" disabled>Select a category</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              {/* Period */}
              <div>
                <label className="block text-sm text-muted mb-2">Historical Period</label>
                <select 
                  name="historicalPeriod" 
                  value={formData.historicalPeriod} 
                  onChange={handleChange}
                  className="w-full bg-surface border border-white/10 rounded-xl px-4 py-3 text-text-main outline-none focus:border-primary"
                >
                  <option value="">Select a period</option>
                  {PERIODS.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm text-muted mb-2">Tags (Press Enter to add)</label>
              <div className="bg-surface border border-white/10 rounded-xl p-2 flex flex-wrap gap-2 items-center focus-within:border-primary">
                {formData.tags.map(tag => (
                  <span key={tag} className="flex items-center gap-1 bg-primary/20 text-primary text-sm px-3 py-1 rounded-full">
                    {tag} 
                    <button onClick={() => removeTag(tag)} className="hover:text-white"><X size={14}/></button>
                  </span>
                ))}
                <input 
                  type="text" 
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagAdd}
                  placeholder="Add a tag..."
                  className="bg-transparent outline-none text-text-main text-sm flex-1 min-w-[100px] px-2 py-1"
                />
              </div>
            </div>

            {/* Cover Image */}
            <div>
              <label className="block text-sm text-muted mb-2">Cover Image</label>
              <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-white/20 rounded-xl cursor-pointer hover:border-primary/50 hover:bg-white/5 transition-all bg-surface overflow-hidden relative">
                {previewImage ? (
                  <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center justify-center pt-5 pb-6 text-muted group-hover:text-primary">
                    <ImageIcon size={32} className="mb-2" />
                    <p className="text-sm">Click to upload cover image</p>
                  </div>
                )}
                <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
              </label>
            </div>

            {/* Additional Images */}
            <div>
              <label className="block text-sm text-muted mb-2">Additional Images (Max 3)</label>
              <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-white/20 rounded-xl cursor-pointer hover:border-primary/50 hover:bg-white/5 transition-all bg-surface overflow-hidden relative">
                {additionalPreviews.length > 0 ? (
                  <div className="flex gap-2 p-2 w-full h-full overflow-hidden">
                    {additionalPreviews.map((src, i) => (
                      <img key={i} src={src} alt={`Additional ${i}`} className="w-1/3 h-full object-cover rounded-lg" />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center pt-5 pb-6 text-muted group-hover:text-primary">
                    <ImageIcon size={32} className="mb-2" />
                    <p className="text-sm">Click to upload up to 3 images</p>
                  </div>
                )}
                <input type="file" className="hidden" multiple accept="image/*" onChange={handleAdditionalImagesChange} />
              </label>
            </div>

            {/* AI Image Studio */}
            <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-primary/20 text-primary px-3 py-1 text-xs font-bold rounded-bl-lg">✨ AI Studio</div>
              <h3 className="text-lg font-cinzel font-bold text-white mb-2 flex items-center gap-2">
                <Wand2 size={20} className="text-primary" /> Generate Historic Images
              </h3>
              <p className="text-sm text-muted mb-4">Describe an ancient or historic concept to generate a unique image for your article.</p>
              
              <div className="flex gap-2 mb-4">
                <input 
                  type="text" 
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="E.g., A majestic ancient temple in Sri Lanka at sunset..."
                  className="flex-1 bg-surface border border-white/10 rounded-xl px-4 py-2 text-sm text-white outline-none focus:border-primary placeholder-muted"
                  disabled={aiGenerating}
                />
                <button 
                  onClick={handleAIGenerate}
                  disabled={aiGenerating || !aiPrompt.trim()}
                  className="btn-primary py-2 px-4 flex items-center gap-2 whitespace-nowrap"
                >
                  {aiGenerating ? <Loader2 size={18} className="animate-spin" /> : <Wand2 size={18} />} 
                  {aiGenerating ? 'Generating...' : 'Generate'}
                </button>
              </div>

              {aiGeneratedImage && (
                <div className="mt-4 border border-white/10 rounded-xl overflow-hidden bg-black/50 p-2">
                  <div className="flex gap-4 items-center">
                    <img src={aiGeneratedImage} alt="AI Generated" className="w-32 h-32 object-cover rounded-lg" />
                    <div className="flex flex-col gap-2 flex-1">
                      <button onClick={handleAddAICover} className="btn-ghost text-sm py-1.5 px-3 flex items-center justify-start gap-2 bg-white/5 hover:bg-primary/20 border border-white/10 text-white">
                        <ImageIcon size={16} className="text-primary" /> Set as Cover Image
                      </button>
                      <button onClick={handleAddAIGallery} disabled={additionalImages.length >= 3} className="btn-ghost text-sm py-1.5 px-3 flex items-center justify-start gap-2 bg-white/5 hover:bg-primary/20 border border-white/10 text-white disabled:opacity-50">
                        <Plus size={16} className="text-accent" /> Add to Image Gallery
                      </button>
                      <div className="flex gap-2 mt-1">
                        <button onClick={handleAIGenerate} className="flex-1 btn-ghost text-xs py-1 px-2 flex justify-center items-center gap-1 hover:text-white">
                          <RefreshCw size={14} /> Regenerate
                        </button>
                        <button onClick={() => setAiGeneratedImage(null)} className="flex-1 btn-ghost text-xs py-1 px-2 flex justify-center items-center gap-1 hover:text-red-400">
                          <X size={14} /> Discard
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Rich Text Editor */}
            <div className="h-[400px] mb-12">
              <label className="block text-sm text-muted mb-2 flex justify-between">
                <span>Content *</span>
                <span>~{words} min read</span>
              </label>
              <ReactQuill 
                theme="snow" 
                value={formData.content} 
                onChange={handleContentChange}
                modules={modules}
                className="h-[350px] text-white"
                placeholder="Write your historical narrative here..."
              />
            </div>
          </div>

          {/* Live Preview Panel */}
          <div className={`w-full ${showPreview ? 'block' : 'hidden lg:block lg:w-1/2'}`}>
            <div className="sticky top-24 h-[calc(100vh-120px)] border border-white/10 rounded-2xl bg-card overflow-hidden flex flex-col shadow-2xl">
              <div className="bg-white/5 py-2 px-4 border-b border-white/10 text-xs font-semibold uppercase text-muted text-center tracking-widest">
                Live Preview
              </div>
              
              <div className="flex-1 overflow-y-auto hide-scrollbar">
                 {/* Hero Preview */}
                 <div className="w-full h-64 bg-[var(--grad-hero)] relative">
                    {previewImage && <img src={previewImage} alt="Cover" className="w-full h-full object-cover" />}
                    <div className="absolute inset-0 bg-gradient-to-t from-deep to-transparent"></div>
                    <div className="absolute bottom-6 left-6 right-6">
                      {formData.category && <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase text-white bg-primary mb-3 inline-block">{formData.category}</span>}
                      <h1 className="text-3xl font-cinzel font-bold text-white line-clamp-2">{formData.title || 'Article Title'}</h1>
                    </div>
                 </div>

                 <div className="p-6 md:p-8">
                   <div className="prose prose-invert prose-sm max-w-none font-inter prose-headings:font-cinzel text-text-main/90"
                        dangerouslySetInnerHTML={{ __html: formData.content || '<p class="text-muted italic">Content preview will appear here...</p>' }}>
                   </div>
                 </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </motion.div>
  );
};

export default CreateArticle;
