import { useState } from "react";
import axios from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import { Users, Lock, User } from "lucide-react";
import { useForm } from "react-hook-form";
import { useAuth } from "../hooks/useAuth";

export default function LoginPage() {
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm();
	const { setIsEditor, setToken } = useAuth();
	const from = location.state?.from?.pathname || "/";
	const navigate = useNavigate();
	const [apiError, setApiError] = useState(null);

	const onSubmit = async (data) => {
		setApiError(null);
		try {
			const response = await axios.post("login/",
				{
					username: data.username,
					password: data.password,
				},
				{ withCredentials: true }
			);

			if (response.status === 200) {
				setToken(response.data.access);
				setIsEditor(response.data.is_editor);
				navigate(from, { replace: true });
			}
		} catch (err) {
			if (!err?.response) {
				setErrMsg("No Server Response");
			} else if (err.response?.status === 400) {
				setErrMsg("Missing Username or Password");
			} else if (err.response?.status === 401) {
				setErrMsg("Unauthorized");
			} else {
				setErrMsg("Login Failed");
			}
		}
	};

	return (
	<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-950 to-black p-6 relative overflow-hidden">
		{/* Blurred glass background glow */}
		<div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_0%,transparent_70%)] blur-3xl"></div>

		{/* Login Card */}
		<div className="relative z-10 w-full max-w-md backdrop-blur-2xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl shadow-black/40 p-8">
			{/* Header */}
			<div className="text-center mb-8">
				<div className="inline-block p-4 bg-white/10 rounded-full border border-white/20 mb-4">
					<Users className="h-10 w-10 text-white/90" />
				</div>
				<h1 className="text-3xl font-semibold text-white">
					Alumni Portal
				</h1>
				<p className="text-gray-400 mt-2">
					Welcome back. Please sign in to continue.
				</p>
			</div>

			{/* Form */}
			<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
				{apiError && <p className='text-red-600'>{apiError}</p>}

				{/* Username */}
				<div>
					<label
						htmlFor="username"
						className="block text-sm font-medium text-gray-400"
					>
						Username
					</label>
					<div className="mt-2 relative">
						<User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
						<input
							{...register("username", {
								required: "Username is required.",
								pattern: {
									value: /^[a-zA-Z0-9_]+$/i,
									message:
										"Username can only contain letters, numbers, and underscores.",
								},
							})}
							id="username"
							name="username"
							type="text"
							autoComplete="username"
							required
							defaultValue="asmit"
							className="w-full pl-10 pr-3 py-2.5 rounded-lg bg-white/5 border border-white/20 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
							placeholder="Alex"
						/>
						{errors.username && (
							<span className="text-red-500 text-sm mt-1 block">
								{errors.username.message}
							</span>
						)}
					</div>
				</div>

				{/* Password */}
				<div>
					<label
						htmlFor="password"
						className="block text-sm font-medium text-gray-400"
					>
						Password
					</label>
					<div className="mt-2 relative">
						<Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
						<input
							{...register("password", {
								required: "Password is required.",
								minLength: {
									value: 4,
									message:
										"Password must be at least 4 characters long.",
								},
								validate: (value) => {
									const hasLetter = /[a-zA-Z]/.test(value);
									return (
										hasLetter ||
										"Password must contain at least one letter."
									);
								},
							})}
							id="password"
							name="password"
							type="password"
							autoComplete="current-password"
							required
							defaultValue="user"
							className="w-full pl-10 pr-3 py-2.5 rounded-lg bg-white/5 border border-white/20 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
							placeholder="••••••••"
						/>
						{errors.password && (
							<span className="text-red-500 text-sm mt-1 block">
								{errors.password.message}
							</span>
						)}
					</div>
				</div>

				{/* Button */}
				<div>
					<button
						type="submit"
						disabled={isSubmitting}
						className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium hover:opacity-90 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{isSubmitting ? "Logging in..." : "Login"}
					</button>
				</div>
			</form>
		</div>
	</div>
);

}
