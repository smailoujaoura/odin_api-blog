// import { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { toast } from 'sonner';
// import api from '../config/axios';
// import { Plus, ExternalLink, FileText, Search } from 'lucide-react';

// interface Post {
// 	id: number;
// 	title: string;
// 	published: boolean;
// 	createdAt: string;
// }

// export default function Home() {
// 	const [posts, setPosts] = useState<Post[]>([]);
// 	const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all');


// 	useEffect(() => {
// 		const fetchPosts = async () => {
// 			try {
// 				const res = await api.get('/posts');
// 				setPosts(res.data.posts);
// 			} catch (err) {
// 				console.warn(err);
// 				toast.error("Failed to fetch posts");
// 			}
// 		};
// 		fetchPosts();
// 	}, []);

// 	const togglePublish = async (id: number, currentState: boolean) => {
// 		try {
// 			await api.patch(`/posts/${id}`, { published: !currentState });
// 			setPosts(posts.map(p => p.id === id ? { ...p, published: !currentState } : p));
// 			toast.success(currentState ? "Post unpublished" : "Post published!");
// 		} catch (err) {
// 			toast.error("Action failed");
// 		}
// 	};

// 	const filteredPosts = posts.filter(p => {
// 		if (filter === 'published') return p.published;
// 		if (filter === 'draft') return !p.published;
// 		return true;
// 	});

// 	return (
// 		<div className="min-h-screen bg-zinc-950 text-zinc-200 p-8 pt-24">
// 			<div className="max-w-6xl mx-auto space-y-8">
				
// 				<header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
// 					<div>
// 						<h1 className="text-3xl font-bold text-white tracking-tight">Content Manager</h1>
// 						<p className="text-zinc-500 text-sm mt-1">Manage your dev logs and publications</p>
// 					</div>
// 					<Link 
// 						to="/new"
// 						className="flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-500 text-white font-bold px-6 py-3 rounded-xl transition-all active:scale-95 shadow-lg shadow-sky-900/20"
// 					>
// 						<Plus size={20} />
// 						New Post
// 					</Link>
// 				</header>

// 				<div className="flex items-center gap-2 bg-zinc-900 p-1 rounded-xl w-fit border border-zinc-800">
// 					{(['all', 'published', 'draft'] as const).map((f) => (
// 						<button
// 							key={f}
// 							onClick={() => setFilter(f)}
// 							className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
// 								filter === f ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'
// 							}`}
// 						>
// 							{f}
// 						</button>
// 					))}
// 				</div>

// 				<div className="grid gap-4">
// 					{filteredPosts.map((post) => (
// 						<div 
// 							key={post.id}
// 							className="group flex items-center justify-between bg-zinc-900 border border-zinc-800 p-5 rounded-2xl hover:border-zinc-700 transition-all shadow-xl"
// 						>
// 							<div className="flex items-center gap-4">
// 								<div className={`p-3 rounded-xl ${post.published ? 'bg-sky-500/10 text-sky-500' : 'bg-zinc-800 text-zinc-500'}`}>
// 									<FileText size={24} />
// 								</div>
// 								<div>
// 									<h3 className="font-bold text-white text-lg group-hover:text-sky-400 transition-colors">
// 										{post.title}
// 									</h3>
// 									<p className="text-zinc-500 text-xs">Created on {new Date(post.createdAt).toLocaleDateString()}</p>
// 								</div>
// 							</div>

// 							<div className="flex items-center gap-6">
// 								<div className="flex items-center gap-3 bg-zinc-950 px-3 py-2 rounded-full border border-zinc-800">
// 									<span className={`text-[10px] font-bold uppercase tracking-widest ${post.published ? 'text-sky-500' : 'text-zinc-600'}`}>
// 										{post.published ? 'Live' : 'Draft'}
// 									</span>
// 									<button
// 										onClick={() => togglePublish(post.id, post.published)}
// 										className={`relative w-11 h-6 rounded-full transition-colors outline-none ${
// 											post.published ? 'bg-sky-600' : 'bg-zinc-700'
// 										}`}
// 									>
// 										<div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 ${
// 											post.published ? 'translate-x-5' : 'translate-x-0'
// 										}`} />
// 									</button>
// 								</div>

// 								<Link 
// 									to={`/admin/edit/${post.id}`}
// 									className="p-2 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-lg transition-all"
// 								>
// 									<ExternalLink size={20} />
// 								</Link>
// 							</div>
// 						</div>
// 					))}

// 					{filteredPosts.length === 0 && (
// 						<div className="text-center py-20 bg-zinc-900/50 rounded-2xl border border-dashed border-zinc-800">
// 							<Search className="mx-auto text-zinc-700 mb-4" size={48} />
// 							<p className="text-zinc-500">No posts found in this category.</p>
// 						</div>
// 					)}
// 				</div>
// 			</div>
// 		</div>
// 	);
// }

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import api from '../config/axios';
import { ExternalLink, Edit2, Plus } from 'lucide-react';

interface Post {
    id: number;
    title: string;
    content: string; // Used for the summary
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
        } catch (err) {
            toast.error("Update failed");
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
                    {posts.map((post) => (
                        <div key={post.id} className="bg-zinc-900 border border-zinc-800 p-5 rounded-xl flex items-center justify-between gap-6">
                            
                            {/* Title & Summary */}
                            <div className="flex-1 min-w-0">
                                <h2 className="text-lg font-bold text-zinc-100 truncate">{post.title}</h2>
                                <p className="text-sm text-zinc-500 line-clamp-1">
                                    {post.content.split(/[.!?]/)[0]}...
                                </p>
                            </div>

                            {/* Actions & Status */}
                            <div className="flex items-center gap-4 shrink-0">
                                
                                {/* Status Toggle */}
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

                                {/* Control Buttons */}
                                <div className="flex gap-1">
                                    <Link title="Read" to={`/posts/${post.id}`} className="p-2 hover:text-sky-400 transition-colors">
                                        <ExternalLink size={18} />
                                    </Link>
                                    <Link title="Edit" to={`/admin/edit/${post.id}`} className="p-2 hover:text-white transition-colors">
                                        <Edit2 size={18} />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}