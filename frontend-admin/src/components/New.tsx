import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import api from '../config/axios';
import { ChevronLeft } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function New() {
	const [title, setTitle] = useState('');
	const [content, setContent] = useState('');
	const [loading, setLoading] = useState(false);
	const [postId, setPostId] = useState<number | null>(null);
	const navigate = useNavigate();

	const handleSave = async (published: boolean) => {
		if (!title || !content) return toast.error("Title and content are required");
		
		setLoading(true);
		try {
			if (postId) {
				await api.patch(`/posts/${postId}`, {
					title,
					content,
					published,
				});
				toast.success(published ? "Published!" : "Draft Updated");
			} else {
				const res = await api.post('/posts', { 
					title,
					content,
					published,
				});
				setPostId(res.data.post.id);
				toast.success(`Draft Started - id: ${res.data.post.id}`);
			}
			if (published) {
				navigate('/');
			}
		} catch {
			toast.error("Failed to save post");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-zinc-950 text-zinc-200">
			<div className="fixed top-16 left-0 right-0 h-16 bg-zinc-900 border-b border-zinc-800 z-40 flex items-center justify-between px-6">
				<div className="flex items-center gap-4">
					<button onClick={() => navigate('/')} className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-500">
						<ChevronLeft size={20} />
					</button>
					<div className="h-6 w-px bg-zinc-800" />
				</div>

				<div className="flex items-center gap-3">
					<button 
						disabled={loading}
						onClick={() => handleSave(false)}
						className="text-zinc-400 hover:text-white text-sm font-bold px-4 py-2"
					>
						Save Draft
					</button>
					<button 
						disabled={loading}
						onClick={() => handleSave(true)}
						className="bg-sky-600 hover:bg-sky-500 text-white text-sm font-bold px-6 py-2 rounded-lg shadow-lg shadow-sky-900/20 active:scale-95 transition-all"
					>
						{loading ? 'Saving...' : 'Publish Post'}
					</button>
				</div>
			</div>

			<main className="pt-32 max-w-5xl mx-auto px-6 pb-20">
				<input 
					type="text"
					placeholder="Post Title..."
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					className="w-full bg-transparent text-5xl font-black text-white placeholder:text-zinc-800 focus:outline-none mb-8 tracking-tight"
				/>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-8 min-h-[60vh]">
					<textarea 
						placeholder="Write your markdown here..."
						value={content}
						onChange={(e) => setContent(e.target.value)}
						className={`w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 text-zinc-300 placeholder:text-zinc-700 focus:outline-none focus:border-zinc-700 resize-none font-mono text-lg leading-relaxed hidden md:block`}
					/>

					<div className={`prose prose-invert prose-sky max-w-none bg-zinc-900/30 border border-dashed border-zinc-800 rounded-2xl p-8 overflow-auto block`}>
						{!content && <p className="text-zinc-700 italic">Preview will appear here...</p>}
						<ReactMarkdown>{content}</ReactMarkdown>
					</div>
				</div>
			</main>
		</div>
	);
}