import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import api from '../config/axios';
import handleApiErrors from '../config/errors';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../config/zustand';

export default function Signup() {
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		password: '',
		admin: ''
	});
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();
	const { user } = useAuthStore();

	if (user) {
		navigate('/');
		return null;
	}

	const handleSubmit = async (e: React.SyntheticEvent) => {
		e.preventDefault();
		setLoading(true);

		try {
			await api.post('/signup', formData, {
				headers: {'x-admin-portal': 'true'}
			});
			toast.success('Account created successfully');
			navigate('/login');
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
					<h2 className="text-2xl font-bold text-white tracking-tight">Sign up</h2>
					<p className="text-zinc-500 text-sm mt-1">Admin sign up page</p>
				</header>

				<div className="space-y-4">
					<Input 
						placeholder="Full Name" 
						type="text"
						required
						onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
					/>
					<Input 
						placeholder="Email Address" 
						type="email"
						required
						onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
					/>
					<Input 
						placeholder="Password" 
						type="password"
						required
						onChange={(e) => setFormData({ ...formData, password: e.target.value })} 
					/>
					<div className="pt-2">
						<label className="text-xs font-semibold text-zinc-500 uppercase ml-1 mb-2 block">Admin Key</label>
						<Input 
							placeholder="SECRET_KEY_123" 
							type="password"
							required
							onChange={(e) => setFormData({ ...formData, admin: e.target.value })} 
						/>
					</div>
				</div>

				<button 
					disabled={loading}
					className="w-full bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-all active:scale-[0.98]"
				>
					{loading ? 'Processing...' : 'Create Account'}
				</button>

				<p className="text-center text-sm text-zinc-500">
					Already have an account? <Link to="/login" className="text-sky-400 hover:underline">Login</Link>
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