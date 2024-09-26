import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';
import { faChevronLeft, faChevronRight, faPause, faPlay, faDumbbell, faHeartbeat, faBolt, faUtensils, faCoffee, faRunning, faHome, faGlobeAmericas, faChartBar, faUser, faUpload, faSpinner } from '@fortawesome/free-solid-svg-icons';

const exerciseIcons = {
    'Push ups': faDumbbell,
    'Squats': faRunning,
    'Crunches': faHeartbeat,
    'Burpees': faBolt,
    'Plank': faRunning,
};

const ExerciseCard = ({ title, sets, reps, onClick }) => {
    const Icon = exerciseIcons[title] || faDumbbell;
    return (
        <motion.div
            whileHover={{ scale: 1.05, boxShadow: "0px 0px 8px rgba(0,0,0,0.2)" }}
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            className="rounded-lg overflow-hidden cursor-pointer bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg"
        >
            <div className="font-bold text-lg flex items-center justify-center h-32 bg-opacity-30 bg-black">
                <FontAwesomeIcon icon={Icon} size="3x" className="text-white" />
            </div>
            <div className="p-4">
                <h3 className="font-bold text-center text-xl">{title}</h3>
                <p className="text-sm text-center text-indigo-200">{`${sets} sets, ${reps}`}</p>
            </div>
        </motion.div>
    );
};

const EmotionTimeline = ({ facialEmotions, voiceEmotions }) => {
    const [activeTab, setActiveTab] = useState('facial');

    return (
        <div className="mb-8 bg-white rounded-lg shadow-lg p-4">
            <div className="grid w-full grid-cols-2 gap-2 mb-4">
                <motion.button
                    whileTap={{ scale: 0.95 }}
                    className={`py-2 rounded-lg ${activeTab === 'facial' ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}
                    onClick={() => setActiveTab('facial')}
                >
                    Facial Emotions
                </motion.button>
                <motion.button
                    whileTap={{ scale: 0.95 }}
                    className={`py-2 rounded-lg ${activeTab === 'voice' ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}
                    onClick={() => setActiveTab('voice')}
                >
                    Voice Emotions
                </motion.button>
            </div>
            <AnimatePresence mode="wait">
                {activeTab === 'facial' && (
                    <motion.div
                        key="facial"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        <EmotionChart emotions={facialEmotions} title="Facial Emotions" />
                    </motion.div>
                )}
                {activeTab === 'voice' && (
                    <motion.div
                        key="voice"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        <EmotionChart emotions={voiceEmotions} title="Voice Emotions" />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const EmotionChart = ({ emotions, title }) => {
    if (!Array.isArray(emotions) || emotions.length === 0) {
        return <p className="text-center text-gray-500">No data available</p>;
    }

    return (
        <div>
            <h3 className="font-bold mb-4 text-lg text-indigo-800">{title}</h3>
            <div className="flex overflow-x-auto pb-2">
                {emotions.map((emotion, index) => (
                    <motion.div
                        key={index}
                        className="flex-shrink-0 mr-2 text-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <motion.div
                            className={`w-16 h-16 ${getEmotionColor(emotion.emotion)} rounded-full mb-1`}
                            whileHover={{ scale: 1.1 }}
                        ></motion.div>
                        <span className="text-xs text-gray-600">{emotion.time_stamp}</span>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

const getEmotionColor = (emotion) => {
    const colors = {
        'Neutral': 'bg-gray-400',
        'Sad': 'bg-blue-400',
        'Angry': 'bg-red-400',
        'Happy': 'bg-yellow-400',
    };
    return colors[emotion] || 'bg-gray-400';
};

const NutritionPlan = ({ plan }) => (
    <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-2xl font-bold mb-4 text-indigo-800">Nutrition Plan</h3>
        <div className="grid gap-4">
            {Object.entries(plan).map(([meal, details]) => (
                <motion.div
                    key={meal}
                    className="bg-gradient-to-r from-purple-100 to-indigo-100 p-4 rounded-lg"
                    whileHover={{ scale: 1.02 }}
                >
                    <div className="font-bold flex items-center text-indigo-700">
                        <FontAwesomeIcon icon={faCoffee} className="mr-2" /> {details.time}
                    </div>
                    <div className="mt-2">
                        <p className="flex items-center text-indigo-600">
                            <FontAwesomeIcon icon={faUtensils} className="mr-2" /> {details.food}
                        </p>
                    </div>
                </motion.div>
            ))}
        </div>
    </div>
);

const WorkoutView = ({ selectedExercise, togglePlayPause, isPlaying, currentTime, setView }) => {
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const Icon = exerciseIcons[selectedExercise?.exercise_name] || faDumbbell;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-6 bg-gradient-to-b from-indigo-100 via-purple-100 to-pink-100 min-h-screen"
        >
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setView('exercises')}
                className="mb-6 bg-white p-2 rounded-full shadow-lg"
            >
                <FontAwesomeIcon icon={faChevronLeft} size="lg" className="text-indigo-600" />
            </motion.button>
            <motion.div
                className="mb-6 overflow-hidden bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-2xl"
                whileHover={{ boxShadow: "0 0 25px rgba(99, 102, 241, 0.5)" }}
            >
                <div className="h-64 flex items-center justify-center">
                    <FontAwesomeIcon icon={Icon} size="6x" className="text-white" />
                </div>
            </motion.div>
            <h2 className="text-3xl font-bold mb-2 text-indigo-800">{selectedExercise?.exercise_name}</h2>
            <p className="mb-6 text-lg text-indigo-600">
                {selectedExercise?.sets} sets, {selectedExercise?.reps}
            </p>
            <div className="flex justify-between items-center mb-6">
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={togglePlayPause}
                    className="bg-indigo-500 text-white p-4 rounded-full shadow-lg"
                >
                    {isPlaying ? <FontAwesomeIcon icon={faPause} size="lg" /> : <FontAwesomeIcon icon={faPlay} size="lg" />}
                </motion.button>
                <span className="text-2xl font-bold text-indigo-800">{formatTime(currentTime)}</span>
            </div>
            <motion.div
                className="h-64 bg-white rounded-2xl shadow-2xl flex items-center justify-center overflow-hidden"
                whileHover={{ boxShadow: "0 0 25px rgba(99, 102, 241, 0.5)" }}
            >
                <motion.p
                    className="text-2xl text-indigo-800 font-bold"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
                >
                    Workout in progress...
                </motion.p>
            </motion.div>
        </motion.div>
    );
};

const ExercisesView = ({ workoutData, handleExerciseClick }) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-6 bg-gradient-to-b from-indigo-100 via-purple-100 to-pink-100 min-h-screen"
        >
            <motion.h1
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-4xl font-bold mb-2 text-indigo-800"
            >
                EXERCISES OF THE DAY
            </motion.h1>
            <motion.h2
                initial={{ y: -30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-xl mb-6 text-indigo-600"
            >
                Top Global Exercises
            </motion.h2>
            <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="grid grid-cols-2 gap-6 mb-8"
            >
                {workoutData?.workout_exercises?.map((exercise, index) => (
                    <ExerciseCard
                        key={index}
                        title={exercise.name}
                        sets={exercise.sets}
                        reps={exercise.reps}
                        onClick={() => handleExerciseClick(exercise)}
                    />
                ))}
            </motion.div>
            <EmotionTimeline
                facialEmotions={Array.isArray(workoutData?.facial_emotions) ? workoutData.facial_emotions : []}
                voiceEmotions={Array.isArray(workoutData?.voice_emotions) ? workoutData.voice_emotions : []}
            />
            <NutritionPlan plan={workoutData?.nutrition_plan || {}} />
        </motion.div>
    );
};


const NavBar = () => {
    const navigate = useNavigate();

    const handleNavigation = (path) => {
        navigate(path);
    };

    return (
        <motion.div
            className="fixed bottom-0 left-0 right-0 bg-white p-4 flex justify-around items-center"
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
            {[
                { icon: faHome, label: 'Home', path: '/home' },
                { icon: faGlobeAmericas, label: 'Global', path: '/home' },
                { icon: faChartBar, label: 'Analytics', path: '/analytics' },
                { icon: faUser, label: 'Profile', path: '/profile' },
            ].map((item, index) => (
                <motion.button
                    key={index}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleNavigation(item.path)}
                    className={`flex flex-col items-center ${index === 2 ? 'text-indigo-600' : 'text-gray-600'}`}
                >
                    <FontAwesomeIcon icon={item.icon} size="lg" />
                    <span className="text-xs mt-1">{item.label}</span>
                </motion.button>
            ))}
        </motion.div>
    );
};
const UploadView = ({ onUploadSuccess }) => {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) {
            alert('Please select a file to upload');
            return;
        }

        setUploading(true);
        const formData = new FormData();
        formData.append('video_file', file);
        formData.append('prompt', 'Analyze the video and must provide a JSON report with workout exercises minimum 5 (name, sets, reps), facial emotions minimum 10 (emotion, timestamp), voice emotions minimum 8 (emotion, timestamp), and nutrition plan (meal, time, food) dont keep any field empty .. try to keep all fields with data');

        try {
            const response = await axios.post('http://127.0.0.1:8000/process_video/', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setUploadProgress(percentCompleted);
                },
            });

            onUploadSuccess(response.data);
        } catch (error) {
            console.error('Error uploading file:', error);
            alert('An error occurred while uploading the file');
        } finally {
            setUploading(false);
            setUploadProgress(0);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-6 bg-gradient-to-b from-indigo-100 via-purple-100 to-pink-100 min-h-screen flex flex-col items-center justify-center"
        >
            <motion.div
                className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full"
                whileHover={{ boxShadow: "0 0 25px rgba(99, 102, 241, 0.5)" }}
            >
                <h2 className="text-3xl font-bold mb-6 text-center text-indigo-800">Upload Workout Video</h2>
                <div className="mb-6">
                    <label htmlFor="file-upload" className="block mb-2 font-semibold text-indigo-600">
                        Choose a video file
                    </label>
                    <input
                        id="file-upload"
                        type="file"
                        onChange={handleFileChange}
                        accept="video/*"
                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                    />
                </div>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleUpload}
                    disabled={uploading}
                    className={`w-full bg-indigo-600 text-white py-2 px-4 rounded-lg font-semibold ${
                        uploading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                >
                    {uploading ? (
                        <span className="flex items-center justify-center">
              <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
              Uploading... {uploadProgress}%
            </span>
                    ) : (
                        <span className="flex items-center justify-center">
              <FontAwesomeIcon icon={faUpload} className="mr-2" />
              Upload Video
            </span>
                    )}
                </motion.button>
            </motion.div>
        </motion.div>
    );
};

const WorkoutApp = () => {
    const [view, setView] = useState('upload');
    const [workoutData, setWorkoutData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [selectedExercise, setSelectedExercise] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const timerRef = useRef(null);

    useEffect(() => {
        if (isPlaying) {
            timerRef.current = setInterval(() => {
                setCurrentTime((prev) => prev + 1);
            }, 1000);
        } else {
            clearInterval(timerRef.current);
        }
        return () => clearInterval(timerRef.current);
    }, [isPlaying]);

    const handleUploadSuccess = (data) => {
        setWorkoutData(data);
        setView('exercises');
    };

    const handleExerciseClick = (exercise) => {
        setSelectedExercise(exercise);
        setView('workout');
    };

    const togglePlayPause = () => {
        setIsPlaying((prev) => !prev);
    };

    return (
        <div className="app-container relative pb-20">
            <AnimatePresence mode="wait">
                {view === 'upload' && (
                    <UploadView onUploadSuccess={handleUploadSuccess} />
                )}
                {view === 'exercises' && (
                    <ExercisesView
                        workoutData={workoutData}
                        handleExerciseClick={handleExerciseClick}
                    />
                )}
                {view === 'workout' && (
                    <WorkoutView
                        selectedExercise={selectedExercise}
                        togglePlayPause={togglePlayPause}
                        isPlaying={isPlaying}
                        currentTime={currentTime}
                        setView={setView}
                    />
                )}
            </AnimatePresence>
            <NavBar />
            {loading && (
                <motion.div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        className="bg-white p-6 rounded-lg shadow-lg"
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    >
                        <p className="text-lg font-bold text-indigo-800">Loading workout data...</p>
                    </motion.div>
                </motion.div>
            )}
        </div>
    );
};

export default WorkoutApp;