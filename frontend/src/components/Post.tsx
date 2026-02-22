import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { toast } from 'sonner';
import api from '../config/axios';
import { MessageSquare, Calendar, User, Send, Loader2, Trash2 } from 'lucide-react';

interface Comment {
	id: number;
	content: string;
	createdAt: string;
	user: { name: string }; 
}

interface PostData {
	id: number;
	title: string;
	content: string;
	createdAt: string;
	user: { name: string };
}

export default function Post() {
	const { id } = useParams();
	const [post, setPost] = useState<PostData | null>(null);
	const [comments, setComments] = useState<Comment[]>([]);
	const [newComment, setNewComment] = useState('');
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchAll = async () => {
			try {
				const [postRes, commentRes] = await Promise.all([
					api.get(`/posts/${id}`),
					api.get(`/posts/${id}/comments`)
				]);
				setPost(postRes.data.post);
				setComments(commentRes.data.comments);
			} catch {
				toast.error("Post not found");
			} finally {
				setLoading(false);
			}
		};
		fetchAll();
	}, [id]);

	const handleComment = async (e: React.SyntheticEvent) => {
		e.preventDefault();
		if (!newComment.trim()) return;

		try {
			const res = await api.post(`/posts/${id}/comments`, { content: newComment });
			setComments([res.data.comment, ...comments]);
			setNewComment('');
			toast.success("Comment added");
		} catch {
			toast.error("Login to comment");
		}
	};

	const handleDelete = async (commentId: number) => {
		if (!window.confirm("Nuke this comment?")) return;

		try {
			await api.delete(`/posts/${id}/comments/${commentId}`);
			
			setComments(comments.filter(c => c.id !== commentId));
			toast.success("Comment deleted");
		} catch {
			toast.error("Delete failed");
		}
	};

	if (loading) return <div className="min-h-screen bg-zinc-950 flex items-center justify-center"><Loader2 className="animate-spin text-sky-500" /></div>;
	if (!post) return <div className="min-h-screen bg-zinc-950 text-white p-20 text-center">Post not found.</div>;

	return (
		<div className="min-h-screen bg-zinc-950 text-zinc-300 pb-20">
			<article className="max-w-3xl mx-auto px-6 pt-32">
				<header className="mb-12">
					<h1 className="text-5xl font-black text-white mb-6 tracking-tight leading-tight">
						{post.title}
					</h1>
					<div className="flex items-center gap-6 text-sm text-zinc-500">
						<span className="flex items-center gap-2"><User size={16} /> {post.user.name}</span>
						<span className="flex items-center gap-2"><Calendar size={16} /> {new Date(post.createdAt).toLocaleDateString()}</span>
					</div>
				</header>

				<div className="prose prose-invert prose-sky max-w-none">
					<ReactMarkdown>{post.content}</ReactMarkdown>
				</div>

				<hr className="my-16 border-zinc-800" />

				<section className="space-y-8">
					<div className="flex items-center gap-3">
						<MessageSquare className="text-sky-500" />
						<h3 className="text-xl font-bold text-white">Discussion ({comments.length})</h3>
					</div>

					<form onSubmit={handleComment} className="relative">
						<textarea 
							value={newComment}
							onChange={(e) => setNewComment(e.target.value)}
							placeholder="Join the discussion..."
							className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 pr-16 text-zinc-200 focus:outline-none focus:border-sky-500 transition-all resize-none min-h-25"
						/>
						<button type="submit" className="absolute bottom-4 right-4 bg-sky-600 hover:bg-sky-500 p-2 rounded-xl text-white transition-all active:scale-95">
							<Send size={20} />
						</button>
					</form>

					<div className="space-y-4">
						{[...comments].reverse().map((comment) => (
							<div key={comment.id} className="group bg-zinc-900/50 border border-zinc-800 p-5 rounded-2xl transition-all hover:border-zinc-700">
								<div className="flex justify-between items-start mb-2">
									{/* Left: Metadata */}
									<div className="flex flex-col">
										<span className="font-bold text-zinc-200 text-sm">
											{comment.user.name}
										</span>
										<span className="text-zinc-600 text-[10px]">
											{new Date(comment.createdAt).toLocaleDateString()}
										</span>
									</div>

									<button 
										onClick={() => handleDelete(comment.id)}
										className="p-2 text-zinc-600 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all opacity-0 group-hover:opacity-100"
										title="Delete Comment"
									>
										<Trash2 size={16} />
									</button>
								</div>
								
								<p className="text-zinc-400 text-sm leading-relaxed">
									{comment.content}
								</p>
							</div>
						))}
					</div>
				</section>
			</article>
		</div>
	);
}