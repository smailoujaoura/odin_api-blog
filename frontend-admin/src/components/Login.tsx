import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import api from '../config/axios';
import handleApiErrors from '../config/errors';
import { useAuthStore } from '../config/zustand';

export default function Login() {
	const [formData, setFormData] = useState({
		email: '',
		password: ''
	});
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();
	const { setUser, user } = useAuthStore();

	if (user) {
		navigate('/');
		return null;
	}

	const handleSubmit = async (e: React.SyntheticEvent) => {
		e.preventDefault();
		setLoading(true);

		try {
			const res = await api.post('/login', formData, {
				headers: {'x-admin-portal': 'true'}
			});
			setUser(res.data.user);
			console.log(res.data.user);
			toast.success('Logged in successfully');
			navigate('/');
		} catch (err) {
			handleApiErrors(err);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6">
			<form 
				onSubmit={handleSubmit} 
				className="w-full max-w-md bg-zinc-900 border border-zinc-800 p-8 rounded-2xl shadow-2xl space-y-6"
			>
				<header className="text-center">
					<h2 className="text-2xl font-bold text-white tracking-tight">Login</h2>
					<p className="text-zinc-500 text-sm mt-1">Welcome back</p>
				</header>

				<div className="space-y-4">
					<Input 
						placeholder="Email Address" 
						type="email"
						name="email"
						required
						onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
					/>
					<Input 
						placeholder="Password" 
						type="password"
						name="password"
						required
						onChange={(e) => setFormData({ ...formData, password: e.target.value })} 
					/>
				</div>

				<button 
					disabled={loading}
					className="w-full bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-all active:scale-[0.98]"
				>
					{loading ? 'Authenticating...' : 'Login'}
				</button>

				<p className="text-center text-sm text-zinc-500">
					Don't have an account? <Link to="/signup" className="text-sky-400 hover:underline">Sign up</Link>
				</p>
			</form>
		</div>
	);
}

const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
	<input 
		{...props}
		className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all"
	/>
);