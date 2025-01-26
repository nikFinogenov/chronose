

import React, { useEffect, useState } from 'react';
// import { fetchPosts } from '../services/postService';
// import PostPreview from '../components/PostPreview';
import { useLocation, useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import kto from '../assets/kto.jpeg';


function Main() {
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const loadCals = async () => {
            try {
                // const { posts } = await fetchPosts(1); 
                // setPosts(posts);
            } catch (error) {
                console.error('Failed to load posts:', error);
            }
            finally {
                setLoading(false);
            }
        };

        loadCals();
    }, [location]);

    if (loading) return <LoadingSpinner />;

    return (
        <div className="flex flex-col items-center pt-16 min-h-screen">
            <div className="w-full bg-purple-200 text-black p-8 text-center mb-6">
                <h1 className="text-4xl font-boldtext-center font-bold">Welcome to the McOK Calendar!</h1>
                <p className="text-3xl mt-2 italic">Вы кто такие? Я вас не звал. Идите нахуй!</p>
            </div>
            <img
                src={kto}
                alt="Kto?"
                className="rounded-full mr-2"
            />
            <button class="btn btn-secondary mt-5" onClick={() => navigate('/login')}>Go to Login</button>
        </div>

    );
}

export default Main;
