import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../config/zustand";
import api from "../config/axios";
import { toast } from "sonner";
import handleApiErrors from "../config/errors";

export const Nav = () => {
	const location = useLocation();
	const { user, setUser } = useAuthStore();
	const navigate = useNavigate();
	
	const isLoginPath = location.pathname === '/login';
	const isSignupPath = location.pathname === '/signup';
	const isHomePath = location.pathname === '/';

	const logout = async (e: React.SyntheticEvent) => {
		e.preventDefault();
		
		try {
			await api.post('/logout');
			toast.success("Logged out successfully");
			navigate('/login');
			setUser(null);
		} catch (err) {
			handleApiErrors(err);
		}
	}

	return (
		<nav className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md">
			<div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
				
				<Link to="/" className="text-xl font-bold tracking-tighter text-white">
					DEV<span className="text-sky-500">BLOG</span>
				</Link>

				<div className="flex items-center gap-6">
					<Link 
						to="/" 
						className={`text-sm font-medium transition-colors hover:text-white ${
							isHomePath 
							? 'text-white underline underline-offset-8 decoration-sky-500 decoration-2' 
							: 'text-zinc-400'
						}`}
					>
						Home
					</Link>

					<div className="h-4 w-px bg-zinc-800" />

					{user ? (
						<div className="flex items-center gap-6">
							<span className="text-zinc-400 text-sm">Welcome, <span className="text-white font-medium">{user.name}</span></span>
							<button 
								onClick={logout}
								className="text-zinc-400 hover:text-red-400 text-sm font-medium transition-colors cursor-pointer"
							>
								Logout
							</button>
						</div>
					) : (
						<div className="flex items-center gap-4">
							{!isLoginPath && (
								<Link to="/login" className="bg-sky-600 hover:bg-sky-500 text-white text-sm font-bold px-5 py-2 rounded-lg transition-all active:scale-95">
									Login
								</Link>
							)}
							
							{!isSignupPath && (
								<Link 
									to="/signup" 
									className="bg-sky-600 hover:bg-sky-500 text-white text-sm font-bold px-5 py-2 rounded-lg transition-all active:scale-95"
								>
									Sign up
								</Link>
							)}
						</div>
					)}
				</div>
			</div>
		</nav>
	);
};

