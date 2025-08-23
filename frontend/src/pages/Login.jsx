import React, { useState } from 'react'; // Import useState
import { useForm } from 'react-hook-form';
import { useAuth } from '../contexts/auth';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
    const { setToken, setIsEditor } = useAuth();
    const navigate = useNavigate();
    const [apiError, setApiError] = useState(null); // State for API errors

    const onSubmit = async (data) => {
        setApiError(null); // Clear previous errors
        try {
            const response = await axios.post(import.meta.env.VITE_BASE_URL + 'login/', {
                username: data.username,
                password: data.password
            }, { withCredentials: true });

            if (response.status === 200) {
                setToken(response.data.access);
                setIsEditor(response.data.is_editor);
                console.log("Login successful, token set:", response.data.access);
                console.log("Session key:", response.data.session_key);
                navigate('/', { replace: true });
            }
        } catch (error) {
            console.error("Login failed:", error);
            setApiError(error.response?.data?.detail || "Invalid credentials. Please try again.");
        }
    };

    return (
        <>
            <h2>Login</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
                {apiError && <p className='text-red-600'>{apiError}</p>}

                <div>
                    <input {...register("username", {
                        required: "Username is required.",
                        pattern: {
                            value: /^[a-zA-Z0-9_]+$/i,
                            message: "Username can only contain letters, numbers, and underscores."
                        }
                    })} placeholder="Username" />
                    {errors.username && <span className='text-red-600'>{errors.username.message}</span>}
                </div>

                <div>
                    <input {...register("password", {
                        required: "Password is required.",
                        minLength: {
                            value: 8,
                            message: "Password must be at least 8 characters long."
                        },
                        validate: (value) => {
                            const hasLetter = /[a-zA-Z]/.test(value);
                            return (hasLetter) || "Password must contain at least one letter.";
                        }
                    })} type="password" placeholder="Password" />
                    {errors.password && <span className='text-red-600'>{errors.password.message}</span>}
                </div>
                
                <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Logging in...' : 'Login'}
                </button>
            </form>
        </>
    );
}

export default Login;