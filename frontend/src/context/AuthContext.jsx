import React, { createContext, useContext, useState } from "react";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
	const [token, setToken] = useState(null);
    const [isEditor, setIsEditor] = useState(false);

	return (
		<AuthContext.Provider value={{ token, setToken, isEditor, setIsEditor }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};
