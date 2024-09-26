import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera, faSave, faCalculator, faUser } from '@fortawesome/free-solid-svg-icons';
import * as faceapi from 'face-api.js';

const FaceCapture = () => {
    const [vitals, setVitals] = useState({
        name: '',
        age: '',
        height: '',
        weight: '',
        gender: ''
    });
    const [bmi, setBmi] = useState('');
    const [bodyType, setBodyType] = useState('');
    const [isCapturing, setIsCapturing] = useState(false);
    const [photo, setPhoto] = useState(null);
    const [emotion, setEmotion] = useState('');
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const loadModels = async () => {
            await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
            await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
            await faceapi.nets.faceExpressionNet.loadFromUri('/models');
        };

        loadModels();

        if (isCapturing) {
            navigator.mediaDevices.getUserMedia({ video: true })
                .then(stream => {
                    if (videoRef.current) {
                        videoRef.current.srcObject = stream;
                        videoRef.current.play();
                        videoRef.current.addEventListener('play', () => {
                            detectFace();
                        });
                    }
                })
                .catch(err => {
                    console.error('Error accessing camera: ', err);
                });
        }

        return () => {
            if (videoRef.current && videoRef.current.srcObject) {
                const stream = videoRef.current.srcObject;
                const tracks = stream.getTracks();
                tracks.forEach(track => track.stop());
            }
        };
    }, [isCapturing]);

    const detectFace = async () => {
        if (videoRef.current && canvasRef.current) {
            const detections = await faceapi.detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
                .withFaceLandmarks()
                .withFaceExpressions();

            canvasRef.current.innerHTML = faceapi.createCanvasFromMedia(videoRef.current);
            const context = canvasRef.current.getContext('2d');
            faceapi.matchDimensions(canvasRef.current, { width: videoRef.current.width, height: videoRef.current.height });

            const resizedDetections = faceapi.resizeResults(detections, { width: videoRef.current.width, height: videoRef.current.height });
            faceapi.draw.drawDetections(canvasRef.current, resizedDetections);
            faceapi.draw.drawFaceLandmarks(canvasRef.current, resizedDetections);
            faceapi.draw.drawFaceExpressions(canvasRef.current, resizedDetections);

            if (resizedDetections[0]) {
                const { expressions } = resizedDetections[0];
                if (expressions.happy > 0.5) {
                    setEmotion('smiling');
                } else if (expressions.sad > 0.5) {
                    setEmotion('sad');
                } else {
                    setEmotion('');
                }
            }

            requestAnimationFrame(detectFace);
        }
    };

    const handleSaveProfile = () => {
        const profileData = {
            ...vitals,
            bmi: bmi,
            bodyType: bodyType,
            photo: photo
        };
        localStorage.setItem('profile', JSON.stringify(profileData));
        navigate('/profile');
    };

    const handleCalculateBMI = () => {
        const { height, weight } = vitals;
        if (height && weight) {
            const heightInMeters = height / 100;
            const bmiValue = (weight / (heightInMeters * heightInMeters)).toFixed(2);
            setBmi(bmiValue);
            setBodyType(getBodyType(bmiValue));
        }
    };

    const getBodyType = (bmi) => {
        if (bmi < 18.5) return 'Underweight';
        if (bmi < 24.9) return 'Normal weight';
        if (bmi < 29.9) return 'Overweight';
        return 'Obesity';
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setVitals({
            ...vitals,
            [name]: value
        });
    };

    const handleCapture = () => {
        if (canvasRef.current && videoRef.current) {
            const context = canvasRef.current.getContext('2d');
            canvasRef.current.width = videoRef.current.videoWidth;
            canvasRef.current.height = videoRef.current.videoHeight;
            context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
            const photoUrl = canvasRef.current.toDataURL('image/png');
            setPhoto(photoUrl);
            setIsCapturing(false);
        }
    };

    const toggleCapture = () => {
        setIsCapturing(prev => !prev);
        setPhoto(null);
        setEmotion('');
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-purple-100 p-8">
            <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-3xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden"
            >
                <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-6 text-white">
                    <h1 className="text-4xl font-bold mb-2">Face Capture and Profile Info</h1>
                    <p className="opacity-80">Capture your face, enter your vitals, and get your BMI and body type.</p>
                </div>

                <div className="p-6 space-y-6">
                    {photo ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-gray-50 p-6 rounded-xl shadow-md"
                        >
                            <img src={photo} alt="Captured" className="w-full h-auto rounded-lg" />
                            <button
                                onClick={toggleCapture}
                                className="mt-4 bg-indigo-500 text-white p-2 rounded-lg hover:bg-indigo-600 transition"
                            >
                                Start Camera
                            </button>
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-gray-50 p-6 rounded-xl shadow-md"
                        >
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
                                    <FontAwesomeIcon icon={faCamera} className="mr-2 text-indigo-500" /> Capture Face
                                </h2>
                            </div>
                            {isCapturing ? (
                                <div className="relative">
                                    <video ref={videoRef} className="w-full h-auto rounded-lg" />
                                    <canvas ref={canvasRef} style={{ display: 'none' }} />
                                    <button
                                        onClick={handleCapture}
                                        className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-indigo-500 text-white p-2 rounded-full hover:bg-indigo-600 transition"
                                    >
                                        Capture
                                    </button>
                                    <canvas ref={canvasRef} className="absolute inset-0" />
                                    {emotion && (
                                        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-2xl font-semibold text-gray-700">
                                            {emotion === 'smiling' ? '😊' : '😢'}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <button
                                    onClick={toggleCapture}
                                    className="bg-indigo-500 text-white p-2 rounded-lg hover:bg-indigo-600 transition"
                                >
                                    Start Camera
                                </button>
                            )}
                        </motion.div>
                    )}

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gray-50 p-6 rounded-xl shadow-md"
                    >
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Enter Your Vitals</h2>
                        <div className="space-y-4">
                            <div className="flex items-center border-b border-gray-200 pb-2">
                                <FontAwesomeIcon icon={faUser} className="mr-2 text-indigo-500" />
                                <input
                                    type="text"
                                    name="name"
                                    value={vitals.name}
                                    onChange={handleChange}
                                    placeholder="Name"
                                    className="w-full p-2 border rounded-lg"
                                />
                            </div>
                            <div className="flex items-center border-b border-gray-200 pb-2">
                                <FontAwesomeIcon icon={faUser} className="mr-2 text-indigo-500" />
                                <input
                                    type="number"
                                    name="age"
                                    value={vitals.age}
                                    onChange={handleChange}
                                    placeholder="Age"
                                    className="w-full p-2 border rounded-lg"
                                />
                            </div>
                            <div className="flex items-center border-b border-gray-200 pb-2">
                                <FontAwesomeIcon icon={faUser} className="mr-2 text-indigo-500" />
                                <input
                                    type="number"
                                    name="height"
                                    value={vitals.height}
                                    onChange={handleChange}
                                    placeholder="Height (cm)"
                                    className="w-full p-2 border rounded-lg"
                                />
                            </div>
                            <div className="flex items-center border-b border-gray-200 pb-2">
                                <FontAwesomeIcon icon={faUser} className="mr-2 text-indigo-500" />
                                <input
                                    type="number"
                                    name="weight"
                                    value={vitals.weight}
                                    onChange={handleChange}
                                    placeholder="Weight (kg)"
                                    className="w-full p-2 border rounded-lg"
                                />
                            </div>
                            <div className="flex items-center border-b border-gray-200 pb-2">
                                <FontAwesomeIcon icon={faUser} className="mr-2 text-indigo-500" />
                                <select
                                    name="gender"
                                    value={vitals.gender}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded-lg"
                                >
                                    <option value="">Select Gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                        </div>
                        <button
                            onClick={handleCalculateBMI}
                            className="mt-4 bg-indigo-500 text-white p-2 rounded-lg hover:bg-indigo-600 transition"
                        >
                            <FontAwesomeIcon icon={faCalculator} className="mr-2" />
                            Calculate BMI
                        </button>
                        {bmi && (
                            <div className="mt-4 text-gray-700">
                                <div className="flex items-center">
                                    <FontAwesomeIcon icon={faCalculator} className="mr-2 text-indigo-500" />
                                    <span>BMI: {bmi}</span>
                                </div>
                                <div className="flex items-center">
                                    <FontAwesomeIcon icon={faCalculator} className="mr-2 text-indigo-500" />
                                    <span>Body Type: {bodyType}</span>
                                </div>
                            </div>
                        )}
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gray-50 p-6 rounded-xl shadow-md"
                    >
                        <button
                            onClick={handleSaveProfile}
                            className="w-full bg-indigo-500 text-white p-2 rounded-lg hover:bg-indigo-600 transition"
                        >
                            <FontAwesomeIcon icon={faSave} className="mr-2" />
                            Save & Continue
                        </button>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
};

export default FaceCapture;