import { useState, useEffect } from "react";
import { UserRound } from "lucide-react";
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
			const response = await protectedAxios.get("alumni/");
			setData(response.data);
		} catch (error) {
			console.log(error);
			setData(null); // Set data to null if there's an error
		}
	}
	useEffect(() => {
		console.log("Loading alumni data...");

		load();
	}, []);

	if (data === null) {
		return (
			<div className="bg-gray-900 min-h-screen">
				<div className="flex flex-col rounded-t-xl px-20 pt-8 pb-2">
					<div className="flex flex-row items-center justify-center text-3xl text-white/60 bg-white/15 border-t border-stone-800 px-4 py-2">
						Unable to connect to server!!
					</div>
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
		<div className="bg-black min-h-screen">
			<div className="flex flex-col  rounded-t-xl mx-15 pt-8 mb-2">
				{/* Search bar */}
				<div className="flex flex-row">
					<Input
						className="w-full text-white/90 rounded-t-lg rounded-b-none focus-visible:bg-white/15 bg-white/20 p-4"
						type="text"
						placeholder="Search for alumni"
						onChange={(e) => handleSearchChange(e)}
					/>
				</div>

				{/* Filter buttons */}
				<div className="flex flex-row flex-wrap justify-between bg-white/20 border-t border-stone-800 px-4 py-2">
					<div>
						{choices.map((choice, index) => (
							<Toggle
								key={index}
								pressed={selectedChoices.includes(choice)}
								onPressedChange={() =>
									handleToggleChange(choice)
								}
								className="text-zinc-200 rounded-full active:scale-[.97] duration-200 bg-white/15 place-self-center h-fit m-1 py-1 px-3"
							>
								{choice}
							</Toggle>
						))}
					</div>
					<div>
						<Button
							onClick={() => setSelectedChoices([])}
							className="text-zinc-200 bg-white/15 rounded-full active:scale-[.97] duration-200 h-fit mx-1 py-1 px-3"
						>
							Clear
						</Button>
					</div>
				</div>

				{/* Alumni list */}
				<ul>
					{!Alumni ? (
						<p className="text-muted-foreground">
							Alumni not found
						</p>
					) : (
						<div>
							{Alumni.filter(
								(alumni) =>
									alumni.name
										.toLowerCase()
										.includes(search.toLowerCase()) &&
									(selectedChoices.length === 0 ||
										(typeof alumni.domains === "string"
											? selectedChoices.includes(
													alumni.domains
											  )
											: alumni.domains.some((domain) =>
													selectedChoices.includes(
														domain
													)
											  )))
							).map((alumni) => (
								<Link key={alumni.id} to={`/${alumni.id}`}>
									<li className="flex items-center bg-gray-900 active:bg-white/10 active:scale-[.994] hover:bg-white/20 duration-200 border border-stone-800 p-4">
										<div className="rounded-full flex-none overflow-hidden text-zinc-200">
											<Avatar className="h-16 w-16 md:h-20 md:w-20">
												{alumni.dp ? (
													<div>
														<AvatarImage
															src={`${BASE_URL}${alumni.dp}`}
															className="object-cover"
															alt={alumni.name}
														/>
														<AvatarFallback className="">
															{" "}
															<UserRound
																size={30}
															/>{" "}
														</AvatarFallback>
													</div>
												) : (
													<AvatarFallback className="">
														{" "}
														<UserRound
															size={30}
														/>{" "}
													</AvatarFallback>
												)}
											</Avatar>
										</div>
										<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pl-5 w-full">
											<div className="font-medium text-2xl text-zinc-200">
												{alumni.name}{" "}
												<span className="text-zinc-400 font-medium text-sm">
													{alumni.batch}
												</span>
											</div>
										</div>
										<div className="basis-[30%] flex flex-wrap">
											{typeof alumni.domains ===
											"string" ? (
												<div className="text-zinc-200 rounded-full bg-white/15 place-self-center h-fit m-1 px-2">
													{alumni.domains}
												</div>
											) : (
												alumni.domains.map(
													(domain, index) => (
														<div
															key={index}
															className="text-zinc-200 rounded-full bg-white/15 place-self-center h-fit m-1 px-3"
														>
															{domain}
														</div>
													)
												)
											)}
										</div>
									</li>
								</Link>
							))}
						</div>
					)}
				</ul>
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

// export async function alumniLoader() {
//   const token = localStorage.getItem('token');
//   if (!token) {
//     return null; // or redirect to login page
//   }
//   try {
//     const response = await axiosInstance.get('alumni/', {
//       headers: {
//         'Authorization': `Bearer ${token}`
//       }
//     });
//     return response.data;
//   } catch (error) {
//     console.log(error);
//     return null;
//   }
// }
