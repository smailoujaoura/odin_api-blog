import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../config/axios';
import { ExternalLink } from 'lucide-react';

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

	return (
		<div className="min-h-screen bg-zinc-950 text-zinc-300 p-6 pt-24">
			<div className="max-w-4xl mx-auto space-y-6">
				<div className="flex justify-between items-end border-b border-zinc-800 pb-6">
					<h1 className="text-2xl font-bold text-white">Posts</h1>
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
								<div className="h-8 w-px bg-zinc-800" />
								<div className="flex gap-1">
									<Link title="Read" to={`/posts/${post.id}`} className="p-2 hover:text-sky-400 transition-colors">
										<ExternalLink size={18} />
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