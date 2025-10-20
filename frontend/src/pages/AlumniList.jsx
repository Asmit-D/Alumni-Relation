import { useState, useEffect } from "react";
import { UserRound, X } from "lucide-react";
import { Link } from "react-router-dom";
import { Toggle } from "@/components/ui/toggle.jsx";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import useProtectedAxios from "../hooks/useProtectedAxios.js";

export default function AlumniList() {
    const protectedAxios = useProtectedAxios();
	const [data, setData] = useState({});
	const [search, setSearch] = useState("");
	const [selectedChoices, setSelectedChoices] = useState([]);
	const BASE_URL = import.meta.env.VITE_BASE_URL;

	async function load() {
		try {
			const response = await protectedAxios.get("alumni/", {
				params: {
					search: search.length > 0 ? search : undefined,
					domains: selectedChoices.length > 0 ? selectedChoices.join(",") : undefined,
				},
			});
			setData(response.data);
		} catch (error) {
			console.log(error);
			setData(null); // Set data to null if there's an error
		}
	}
	useEffect(() => {
		console.log("Loading alumni data...");
		load();
	}, [search, selectedChoices]);

	if (data === null) {
		return (
			<div className="flex items-center justify-center min-h-screen px-4">
				<div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl px-8 py-6 shadow-2xl shadow-black/50">
					<p className="text-xl text-white/80 font-light">Unable to connect to server</p>
				</div>
			</div>
		);
	}
	const Alumni = data?.alumni || [];
	const choices = data?.choices || [];

	const handleToggleChange = (choice) => {
		setSelectedChoices((prev) => {
			if (prev.includes(choice)) {
				return prev.filter((item) => item !== choice);
			} else {
				return [...prev, choice];
			}
		});
	};

	const handleSearchChange = (e) => {
		setSearch(e.target.value);
	};

	return (
		<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
			{/* Search bar with glass effect */}
			<div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl shadow-2xl shadow-black/20 overflow-hidden">
				<div className="relative flex items-center">
					<Input
						className="w-full text-white/90 bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 px-6 py-5 text-lg placeholder:text-white/40 pr-12"
						type="text"
						placeholder="Search alumni..."
						value={search}
						onChange={(e) => handleSearchChange(e)}
					/>
					{search && (
						<button
							onClick={() => setSearch("")}
							className="absolute right-3 p-2 text-white/60 hover:text-white/90 hover:bg-white/10 rounded-full transition-all duration-300"
							aria-label="Clear search"
						>
							<X size={20} />
						</button>
					)}
				</div>
			</div>

			{/* Filter buttons with glass effect */}
				<div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl shadow-2xl shadow-black/20 p-4">
					<div className="flex flex-wrap items-center gap-3">
						<div className="flex flex-wrap gap-2 flex-1">
							{choices.map((choice, index) => (
								<Toggle
									key={index}
									pressed={selectedChoices.includes(choice)}
									onPressedChange={() =>
										handleToggleChange(choice)
									}
									className="text-white/80 font-light rounded-full transition-all duration-300 backdrop-blur-md bg-white/5 hover:bg-white/10 data-[state=on]:bg-white/20 data-[state=on]:text-white border border-white/10 hover:border-white/20 px-4 py-2 text-sm"
								>
									{choice}
								</Toggle>
							))}
						</div>
						{selectedChoices.length > 0 && (
							<Button
								onClick={() => setSelectedChoices([])}
								className="text-white/80 font-light backdrop-blur-md bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-full transition-all duration-300 px-4 py-2 text-sm"
							>
								Clear all
							</Button>
						)}
					</div>
				</div>

				{/* Alumni list */}
				<div className="space-y-4">
					{!Alumni || Alumni.length<1 ? (
						<div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl shadow-2xl shadow-black/20 px-8 py-16">
							<p className="text-center text-white/50 text-lg font-light">No alumni found</p>
						</div>
					) : (
						<div className="space-y-3">
							{Alumni.map((alumni) => (
								<Link key={alumni.id} to={`/${alumni.id}`}>
									<div className="group backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl shadow-xl shadow-black/20 hover:bg-white/10 hover:border-white/20 hover:shadow-2xl hover:shadow-black/30 transition-all duration-300 p-6 mb-2">
										<div className="flex items-center gap-6">
											{/* Avatar */}
											<div className="flex-none">
												<Avatar className="h-16 w-16 md:h-20 md:w-20 ring-2 ring-white/10 group-hover:ring-white/20 transition-all duration-300">
													{alumni.dp ? (
														<>
															<AvatarImage
																src={`${BASE_URL}${alumni.dp}`}
																className="object-cover"
																alt={alumni.name}
															/>
															<AvatarFallback className="bg-white/10 text-white/60">
																<UserRound size={30} />
															</AvatarFallback>
														</>
													) : (
														<AvatarFallback className="bg-white/10 text-white/60">
															<UserRound size={30} />
														</AvatarFallback>
													)}
												</Avatar>
											</div>
											
											{/* Info */}
											<div className="flex-1 min-w-0">
												<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
													<div>
														<h3 className="font-medium text-xl text-white/90 truncate">
															{alumni.name}
														</h3>
														<p className="text-white/50 text-sm font-light mt-0.5">
															Batch of {alumni.batch}
														</p>
													</div>
												</div>
											</div>

											{/* Domains */}
											<div className="hidden md:flex flex-wrap gap-2 max-w-xs">
												{typeof alumni.domains === "string" ? (
													<span className="text-white/70 text-xs font-light rounded-full backdrop-blur-md bg-white/10 border border-white/10 px-3 py-1">
														{alumni.domains}
													</span>
												) : (
													alumni.domains.slice(0, 3).map((domain, index) => (
														<span
															key={index}
															className="text-white/70 text-xs font-light rounded-full backdrop-blur-md bg-white/10 border border-white/10 px-3 py-1"
														>
															{domain}
														</span>
													))
												)}
												{typeof alumni.domains !== "string" && alumni.domains.length > 3 && (
													<span className="text-white/50 text-xs font-light rounded-full backdrop-blur-md bg-white/10 border border-white/10 px-3 py-1">
														+{alumni.domains.length - 3}
													</span>
												)}
											</div>
										</div>
									</div>
								</Link>
							))}
						</div>
					)}
				</div>
			{/* Pagination */}
			{/* <div className='flex place-self-center bg-white/15 rounded-lg mb-8 '>
        <button className='hover:bg-white/20 duration-200 rounded-lg active:bg-white/10'>
          <ChevronLeft className='text-zinc-200' size={40} />
        </button>
        <div className='text-lg text-zinc-200 place-content-center px-4'>Page No.</div>
        <button className='hover:bg-white/20 duration-200 rounded-lg active:bg-white/10'>
          <ChevronRight className='text-zinc-200' size={40} />
        </button>
      </div> */}
		</div>
	);
}
