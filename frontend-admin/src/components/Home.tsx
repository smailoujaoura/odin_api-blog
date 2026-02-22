import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import api from '../config/axios';
import { ExternalLink, Edit2, Plus, Trash2 } from 'lucide-react';

interface Post {
	id: number;
	title: string;
	content: string;
	published: boolean;
}

export default function Home() {
	const [posts, setPosts] = useState<Post[]>([]);

	useEffect(() => {
		api.get('/posts').then(res => setPosts(res.data.posts)).catch(console.error);
	}, []);

	const togglePublish = async (id: number, currentState: boolean) => {
		try {
			await api.patch(`/posts/${id}`, { published: !currentState });
			setPosts(posts.map(p => p.id === id ? { ...p, published: !currentState } : p));
			toast.success(currentState ? "Set to Private" : "Published Live!");
		} catch {
			toast.error("Update failed");
		}
	};

	const deletePost = async (id: number) => {
		if (!window.confirm("Nuke this post forever?")) return;
		
		try {
			await api.delete(`/posts/${id}`);
			setPosts(posts.filter(p => p.id !== id));
			toast.success("Post deleted");
		} catch {
			toast.error("Delete failed");
		}
	};

	return (
		<div className="min-h-screen bg-zinc-950 text-zinc-300 p-6 pt-24">
			<div className="max-w-4xl mx-auto space-y-6">
				
				<div className="flex justify-between items-end border-b border-zinc-800 pb-6">
					<h1 className="text-2xl font-bold text-white">My Posts</h1>
					<Link to="/new" className="bg-sky-600 hover:bg-sky-500 text-white p-2 rounded-lg transition-colors">
						<Plus size={20} />
					</Link>
				</div>

				<div className="space-y-4">
					{[...posts].reverse().map((post) => (
						<div key={post.id} className="bg-zinc-900 border border-zinc-800 p-5 rounded-xl flex items-center justify-between gap-6">
							
							<div className="flex-1 min-w-0">
								<h2 className="text-lg font-bold text-zinc-100 truncate">{post.title}</h2>
								<p className="text-sm text-zinc-500 line-clamp-1">
									{post.content.split(/[.!?]/)[0]}...
								</p>
							</div>

							<div className="flex items-center gap-4 shrink-0">
								<div className="flex items-center gap-2">
									<span className="text-[10px] uppercase font-black text-zinc-600">
										{post.published ? "Public" : "Private"}
									</span>
									<button 
										onClick={() => togglePublish(post.id, post.published)}
										className={`w-10 h-5 rounded-full relative transition-colors ${post.published ? 'bg-sky-600' : 'bg-zinc-700'}`}
									>
										<div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${post.published ? 'left-6' : 'left-1'}`} />
									</button>
								</div>

								<div className="h-8 w-px bg-zinc-800" />

								<div className="flex gap-1">
									<Link title="Read" to={`/posts/${post.id}`} className="p-2 hover:text-sky-400 transition-colors">
										<ExternalLink size={18} />
									</Link>
									<Link title="Edit" to={`/edit/${post.id}`} className="p-2 hover:text-white transition-colors">
										<Edit2 size={18} />
									</Link>
									<button 
										onClick={() => deletePost(post.id)}
										title="Delete" 
										className="p-2 hover:text-red-500 transition-colors"
									>
										<Trash2 size={18} />
									</button>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}