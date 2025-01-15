'use client';
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/superbase'; // Adjust the path as needed

// Define the type for a note
interface Note {
  id: string; // Ensure this matches the primary key type in your Supabase table
  title: string;
  content: string;
  day: string;
  time: string;
  created_at?: string; // Optional, in case it's not always returned
}

const PatternedBackground: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('notes') // Add the type for the table rows
          .select('*')
          .order('created_at', { ascending: false }); // Fetch notes ordered by creation time
        if (error) throw error;
        setNotes(data || []); // Fallback to an empty array if `data` is null
      } catch (error) {
        console.error('Error fetching notes:', (error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, []);

  return (
    <div className="p-4 h-[100vh] mt-12">
      <h1 className="text-3xl font-bold text-white mb-4">Daily routines</h1>
      {loading ? (
        <p className="text-white">Loading...</p>
      ) : (
        <div className="bg-white rounded-lg p-4 shadow-md">
          {notes.length === 0 ? (
            <p className="text-gray-700">No notes available.</p>
          ) : (
            notes.map((note) => (
              <div key={note.id} className="mb-4 border-b pb-2">
                <h2 className="text-xl font-bold text-gray-800">{note.title}</h2>
                <p className="text-gray-600">{note.content}</p>
                <p className="text-gray-500">
                  {note.day}, {note.time}
                </p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default PatternedBackground;
