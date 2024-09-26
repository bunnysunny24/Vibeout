import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';
import { faFire, faDumbbell, faChartLine, faTrophy, faBolt, faRunning } from '@fortawesome/free-solid-svg-icons';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const HomePage = () => {
    const navigate = useNavigate();
    const [dailyStreak, setDailyStreak] = useState(0);
    const [caloriesBurned, setCaloriesBurned] = useState(0);
    const [todaysGoal, setTodaysGoal] = useState(0);
    const [progressData, setProgressData] = useState([]);
    const [profileData, setProfileData] = useState({
        name:   '',
        age:   '',
        height:   '',
        weight:   '',
        gender:   '',
        bmi:   '',
        bodyType:    ''
    });

    useEffect(() => {
        // Simulating data fetch
        setDailyStreak(7);
        setCaloriesBurned(350);
        setTodaysGoal(500);
        setProgressData([
            { day: 'Mon', calories: 300 },
            { day: 'Tue', calories: 450 },
            { day: 'Wed', calories: 200 },
            { day: 'Thu', calories: 600 },
            { day: 'Fri', calories: 350 },
            { day: 'Sat', calories: 400 },
            { day: 'Sun', calories: 350 },
        ]);

        // Retrieve profile data from localStorage
        const storedProfileData = localStorage.getItem('profile');
        if (storedProfileData) {
            setProfileData(JSON.parse(storedProfileData));
        }
    }, []);

    const QuickStartButton = ({ icon, label, onClick }) => (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex flex-col items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-4 text-white shadow-lg"
            onClick={onClick}
        >
            <FontAwesomeIcon icon={icon} size="2x" className="mb-2" />
            <span className="text-sm font-semibold">{label}</span>
        </motion.button>
    );

    const StatCard = ({ icon, value, label }) => (
        <motion.div
            whileHover={{ y: -5 }}
            className="bg-white rounded-xl p-4 shadow-md flex items-center space-x-4"
        >
            <div className="bg-indigo-100 p-3 rounded-full">
                <FontAwesomeIcon icon={icon} size="lg" className="text-indigo-600" />
            </div>
            <div>
                <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
                <p className="text-sm text-gray-600">{label}</p>
            </div>
        </motion.div>
    );

    const handleViewProgress = () => {
        // Store profile data in localStorage
        localStorage.setItem('profile', JSON.stringify(profileData));
        navigate('/profile');
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-purple-100 p-6">
            <motion.h1
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl font-bold text-indigo-800 mb-6"
            >
                Welcome back, Fitness Warrior!
            </motion.h1>

            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="grid grid-cols-2 gap-4 mb-8"
            >
                <QuickStartButton icon={faDumbbell} label="Start Workout" onClick={() => navigate('/analytics')} />
                <QuickStartButton icon={faChartLine} label="View Progress" onClick={handleViewProgress} />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="grid grid-cols-3 gap-4 mb-8"
            >
                <StatCard icon={faFire} value={caloriesBurned} label="Calories Burned Today" />
                <StatCard icon={faBolt} value={dailyStreak} label="Day Streak" />
                <StatCard icon={faTrophy} value={`${Math.round((caloriesBurned / todaysGoal) * 100)}%`} label="Daily Goal Progress" />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-white rounded-xl p-6 shadow-lg mb-8"
            >
                <h2 className="text-2xl font-bold text-indigo-800 mb-4">Weekly Progress</h2>
                <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={progressData}>
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="calories" stroke="#4F46E5" strokeWidth={2} dot={{ fill: '#4F46E5', strokeWidth: 2 }} />
                    </LineChart>
                </ResponsiveContainer>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl p-6 text-white shadow-lg flex items-center justify-between"
            >
                <div>
                    <h2 className="text-2xl font-bold mb-2">Ready for a challenge?</h2>
                    <p className="mb-4">Push your limits with our new HIIT workout!</p>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-white text-purple-600 py-2 px-4 rounded-lg font-semibold"
                    >
                        Start Challenge
                    </motion.button>
                </div>
                <FontAwesomeIcon icon={faRunning} size="5x" className="text-white opacity-50" />
            </motion.div>
        </div>
    );
};

export default HomePage;