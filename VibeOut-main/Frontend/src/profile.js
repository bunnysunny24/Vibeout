import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Award, Activity, Zap, Target } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ProfilePage = () => {
    const [profile, setProfile] = useState({
        name: 'Aayush Kumar',
        age: '66',
        height: '66',
        weight: '66',
        gender: 'male',
        bmi: '151.52',
        bodyType: 'Obesity',
        photo: '' // Add photo field
    });
    const navigate = useNavigate();

    useEffect(() => {
        const storedProfile = JSON.parse(localStorage.getItem('profile'));
        if (storedProfile) {
            setProfile(storedProfile);
        }
    }, []);

    const chartData = [
        { name: 'Mon', calories: 300 },
        { name: 'Tue', calories: 450 },
        { name: 'Wed', calories: 200 },
        { name: 'Thu', calories: 600 },
        { name: 'Fri', calories: 350 },
        { name: 'Sat', calories: 400 },
        { name: 'Sun', calories: 320 }
    ];

    const handleGoHome = () => {
        navigate('/home'); // Assuming '/home' is the route to your dashboard
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-200 p-8">
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
                <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-6 text-white">
                    <h1 className="text-3xl font-bold mb-2">Your Fitness Journey</h1>
                    <p className="opacity-80">Stay motivated, stay healthy!</p>
                </div>

                <div className="p-6 flex flex-col md:flex-row gap-6">
                    <div className="md:w-2/3 space-y-6">
                        <div className="bg-gray-50 p-6 rounded-xl shadow-md transition-all duration-300 hover:shadow-lg">
                            <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
                                <User className="mr-2 text-purple-500" /> Profile Info
                            </h2>
                            <div className="flex items-start mt-4">
                                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-purple-500 mr-4">
                                    <img
                                        src={profile.photo || 'https://via.placeholder.com/100'}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="space-y-4 text-left">
                                    {Object.entries(profile).map(([key, value]) => (
                                        key !== 'photo' && (
                                            <div key={key} className="flex items-center border-b border-gray-200 pb-2">
                                                <label className="font-medium capitalize text-gray-600">{key}:</label>
                                                <span className="text-gray-800 ml-2">{value}</span>
                                            </div>
                                        )
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-50 p-6 rounded-xl shadow-md transition-all duration-300 hover:shadow-lg">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                                <Activity className="mr-2 text-purple-500" /> Weekly Progress
                            </h2>
                            <ResponsiveContainer width="100%" height={200}>
                                <LineChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="calories" stroke="#8884d8" strokeWidth={2} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="md:w-1/3 space-y-6">
                        <div className="bg-gray-50 p-6 rounded-xl shadow-md transition-all duration-300 hover:shadow-lg">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                                <Award className="mr-2 text-purple-500" /> Achievements
                            </h2>
                            <div className="space-y-3">
                                <div className="flex items-center text-gray-700">
                                    <Award className="h-8 w-8 text-yellow-500 mr-2" />
                                    <span>7 Day Streak</span>
                                </div>
                                <div className="flex items-center text-gray-700">
                                    <Zap className="h-8 w-8 text-blue-500 mr-2" />
                                    <span>1000 Calories Burned</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-50 p-6 rounded-xl shadow-md transition-all duration-300 hover:shadow-lg">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                                <Target className="mr-2 text-purple-500" /> Quick Stats
                            </h2>
                            <div className="space-y-2 text-gray-700">
                                <div>Workouts this week: 5</div>
                                <div>Average duration: 45 mins</div>
                                <div>Total calories: 2,500</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-6 text-center">
                    <button
                        onClick={handleGoHome}
                        className="bg-green-500 text-white p-2 rounded hover:bg-green-600 transition"
                    >
                        Go to Dashboard
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;