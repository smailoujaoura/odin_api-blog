import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Nav } from "./components/Nav"
import { Toaster } from "sonner"
import Signup from "./components/Signup"
import Login from "./components/Login"
import { useAuthStore } from "./config/zustand"
import { useEffect, useState } from "react"
import api from "./config/axios"
import Home from "./components/Home"
import New from "./components/New"
import Edit from "./components/Edit"
import Post from "./components/Post"


function App() {

	const { setUser } = useAuthStore();
	const [isChecking, setIsChecking] = useState(true);

	useEffect(() => {
		const initAuth = async () => {
			try {
				const res = await api.get('/me');
				setUser(res.data.user);
			} catch (err) {
				console.warn(err);
				setUser(null);
			} finally {
				setIsChecking(false);
			}
		}

		initAuth();
	}, [setUser]);

	if (isChecking) {
		return <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-500">Loading...</div>;  
	}

	return (
		<>
		<Toaster theme="dark" position="top-center" richColors/>
		<BrowserRouter>
			<Nav/>

			<Routes>
				<Route path="/" element={<Home/>}/>
				<Route path="/login" element={<Login/>}/>
				<Route path="/signup" element={<Signup/>}/>
				<Route path="/new" element={<New/>}/>
				<Route path="/edit/:id" element={<Edit/>}/>
				<Route path="/posts/:id" element={<Post/>}/>
				<Route path="*" element={<div>404 - Not Found</div>}/>
			</Routes>
		</BrowserRouter>
		</>
	)
}

export default App
