'use client'
import { useState } from 'react';
import { supabase } from '../lib/superbase';

export default function Home() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Check if user already exists by email or username
      const { data: existingUserByEmail, error: emailError } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (emailError && emailError.code !== 'PGRST116') {
        throw emailError;
      }

      if (existingUserByEmail) {
        setError('User with this email already exists!');
        setLoading(false);
        return;
      }

      const { data: existingUserByUsername, error: usernameError } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .single();

      if (usernameError && usernameError.code !== 'PGRST116') {
        throw usernameError;
      }

      if (existingUserByUsername) {
        setError('Username already taken!');
        setLoading(false);
        return;
      }

      // If no user exists, proceed to insert the new user
      const { error } = await supabase
        .from('users')
        .insert([
          {
            username,
            email,
            password_hash: password, // Ideally, hash the password before inserting
          },
        ]);

      if (error) throw error;

      setSuccess('User added successfully!');
      setUsername('');
      setEmail('');
      setPassword('');
    } catch (error: unknown) {  // Use `unknown` instead of `any`
      if (error instanceof Error) {
        console.error('Error adding user:', error.message);
        setError('Error adding user');
      } else {
        console.error('Unknown error:', error);
        setError('Unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-semibold text-center text-gray-800 mb-6">Add New User</h1>
        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
        {success && <p className="text-green-600 text-sm mb-4">{success}</p>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-gray-600">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-gray-600">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-gray-600">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full p-3 text-white rounded-md mt-4 focus:outline-none ${
              loading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            {loading ? 'Adding...' : 'Add User'}
          </button>
        </form>
      </div>
    </div>
  );
}
