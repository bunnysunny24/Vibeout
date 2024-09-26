import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        if (email === 'andronova@andro.com' && password === 'redbull') {
            navigate('/FaceCapture');
        } else {
            alert('Invalid credentials');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-purple-100 flex items-center justify-center p-6 relative overflow-hidden">
            {/* Random background image */}
            <div 
                className="absolute inset-0 bg-cover bg-center filter blur-sm opacity-30"
                style={{
                    backgroundImage: "url('https://source.unsplash.com/random')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md bg-white bg-opacity-80 backdrop-blur-lg rounded-3xl p-8 shadow-2xl relative z-10"
            >
                <motion.h1
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-4xl font-bold mb-2 text-center text-indigo-800"
                >
                    VibeOut
                </motion.h1>
                
                <motion.h2
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-lg font-medium mb-8 text-center text-indigo-600"
                >
                    Vibe with Purpose, Workout with Passion!
                </motion.h2>

                <form onSubmit={handleLogin} className="space-y-6">
                    <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                    >
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-indigo-50 bg-opacity-50 rounded-lg p-4 text-indigo-800 placeholder-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                        />
                    </motion.div>

                    <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="relative"
                    >
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-indigo-50 bg-opacity-50 rounded-lg p-4 text-indigo-800 placeholder-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-indigo-400 hover:text-indigo-600 transition"
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </motion.div>

                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className="flex justify-between items-center"
                    >
                        <label className="flex items-center space-x-2 cursor-pointer">
                            <input type="checkbox" className="form-checkbox h-4 w-4 text-indigo-600" />
                            <span className="text-sm text-indigo-600">Remember me</span>
                        </label>
                        <a href="#" className="text-sm text-indigo-600 hover:text-indigo-500 transition">Forgot Password?</a>
                    </motion.div>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg p-4 font-bold shadow-lg hover:from-indigo-600 hover:to-purple-600 transition duration-300"
                    >
                        Login
                    </motion.button>
                </form>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="mt-8 text-center"
                >
                    <p className="text-indigo-600">
                        Don't have an account? <a href="#" className="text-indigo-600 hover:text-indigo-500 transition">Sign Up</a>
                    </p>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default LoginPage;