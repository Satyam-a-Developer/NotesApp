'use client';
import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
// Initialize Supabase client

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const PatternedBackground = () => {
  const [title, setTitle] = useState('');
  const router = useRouter();
  const [content, setContent] = useState('');
  const [isEditing, setIsEditing] = useState(true);
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [time, setTime] = useState('00:00');
  const [loading, setLoading] = useState(false);

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const handleSubmit = async (e: React.FormEvent) => {

    if(isEditing) {
      router.push('/Daily');
    }
    
    e.preventDefault();

    const noteData = {
      title,
      content,
      day: selectedDay,
      time,
    };

    try {
      setLoading(true);
      const { data, error } = await supabase.from('notes').insert([noteData]);

      if (error) {
        console.error('Error inserting note:', error.message);
        alert('Failed to save the note. Please try again.');
      } else {
        console.log('Note saved:', data);
        alert('Note successfully saved!');
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      alert('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-slate-600 h-[100vh] ">
      {/* Days Selector */}
      {isEditing && (
        <div className="flex justify-between items-center p-4 bg-white rounded-lg shadow-md mb-4 mt-12">
        <div className="flex items-center space-x-2">
          {daysOfWeek.map((day) => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-4 py-2 rounded-md ${
                selectedDay === day
                  ? 'bg-blue-500 text-white font-bold'
                  : 'bg-gray-200 text-gray-700'
              } transition-colors`}
            >
              {day}
            </button>
          ))}
        </div>
           {/* Time Selector */}
           <div>
          <label className="text-gray-800 font-medium mr-2">Time:</label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          />
        </div>
      </div>
        
        )}

     

      {isEditing && (
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-4">
          <nav className="flex justify-between items-center p-4 bg-white rounded-lg shadow-md">
            <div className="flex items-center">
              <h1 className="text-3xl font-bold text-gray-800">Create New Note</h1>
            </div>
            <div className="flex items-center">
              <button
                type="submit"
                className={`bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md transition-colors ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Create'}
              </button>
            </div>
          </nav>

          <div className="p-6 bg-white rounded-lg shadow-md space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-gray-800">Title</h2>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter title"
                className="w-full p-3 border border-gray-300 text-black rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-gray-800">Content</h2>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Enter content"
                className="w-full p-3 border border-gray-300 rounded-md h-64 text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
              />
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default PatternedBackground;
