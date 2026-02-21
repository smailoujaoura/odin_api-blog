import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import api from '../config/axios';
import { ChevronLeft, Eye, Edit3, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function Edit() {
    const { id } = useParams<{ id: string }>(); // Grab the ID from URL
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [preview, setPreview] = useState(false);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true); // Loading state for initial fetch
    const navigate = useNavigate();

    // 1. Fetch existing content on mount
    useEffect(() => {
        const fetchPost = async () => {
            try {
                const res = await api.get(`/posts/${id}`);
                setTitle(res.data.post.title);
                setContent(res.data.post.content);
            } catch {
                toast.error("Could not load post data");
                navigate('/');
            } finally {
                setFetching(false);
            }
        };
        fetchPost();
    }, [id, navigate]);

    const handleUpdate = async (published: boolean) => {
        if (!title || !content) return toast.error("Required fields missing");
        
        setLoading(true);
        try {
            // We always PATCH here because the post definitely exists
            await api.patch(`/posts/${id}`, { title, content, published });
            
            toast.success(published ? "Published!" : "Changes Saved");
            if (published) navigate('/');
        } catch {
            toast.error("Failed to update post");
        } finally {
            setLoading(false);
        }
    };

    // Show a clean dark loader while fetching data
    if (fetching) return (
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
            <Loader2 className="animate-spin text-sky-500" size={40} />
        </div>
    );

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-200">
            {/* Toolbar - Same as New.tsx */}
            <div className="fixed top-16 left-0 right-0 h-16 bg-zinc-900 border-b border-zinc-800 z-40 flex items-center justify-between px-6">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/admin')} className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-500">
                        <ChevronLeft size={20} />
                    </button>
                    <div className="h-6 w-px bg-zinc-800" />
                    <button 
                        onClick={() => setPreview(!preview)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-bold transition-all ${
                            preview ? 'bg-sky-600 text-white' : 'bg-zinc-800 text-zinc-400 hover:text-white'
                        }`}
                    >
                        {preview ? <Edit3 size={16} /> : <Eye size={16} />}
                        {preview ? 'Edit' : 'Preview'}
                    </button>
                </div>

                <div className="flex items-center gap-3">
                    <button 
                        disabled={loading}
                        onClick={() => handleUpdate(false)}
                        className="text-zinc-400 hover:text-white text-sm font-bold px-4 py-2"
                    >
                        Keep Private
                    </button>
                    <button 
                        disabled={loading}
                        onClick={() => handleUpdate(true)}
                        className="bg-sky-600 hover:bg-sky-500 text-white text-sm font-bold px-6 py-2 rounded-lg shadow-lg shadow-sky-900/20 transition-all"
                    >
                        {loading ? 'Saving...' : 'Update & Publish'}
                    </button>
                </div>
            </div>

            {/* Editor Area */}
            <main className="pt-32 max-w-5xl mx-auto px-6 pb-20">
                <input 
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-transparent text-5xl font-black text-white focus:outline-none mb-8 tracking-tight"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 min-h-[60vh]">
                    <textarea 
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className={`w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 text-zinc-300 focus:outline-none focus:border-zinc-700 resize-none font-mono text-lg leading-relaxed ${
                            preview ? 'hidden md:block' : 'block'
                        }`}
                    />

                    <div className={`prose prose-invert prose-sky max-w-none bg-zinc-900/30 border border-dashed border-zinc-800 rounded-2xl p-8 overflow-auto ${
                        preview ? 'block' : 'hidden md:block'
                    }`}>
                        <ReactMarkdown>{content}</ReactMarkdown>
                    </div>
                </div>
            </main>
        </div>
    );
}