import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TheoryBoard = () => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ title: '', content: '', author: '' });
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      const res = await axios.get('/api/posts');
      setPosts(res.data);
    } catch (err) {
      console.error("Error loading theories", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPosts(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/posts', newPost);
      setNewPost({ title: '', content: '', author: '' });
      fetchPosts(); // Refresh list
    } catch (err) {
      alert("Error posting theory");
    }
  };

  return (
    <div style={{ padding: '40px 20px', backgroundColor: '#0b0b0b', minHeight: '100vh', color: 'white' }}>
      <h1 style={{ color: '#ed1d24', textAlign: 'center' }}>MULTIVERSE THEORIES</h1>

      {/* Post Form */}
      <form onSubmit={handleSubmit} style={{ maxWidth: '600px', margin: '0 auto 40px', backgroundColor: '#1a1a1a', padding: '20px', borderRadius: '8px' }}>
        <input 
          type="text" placeholder="Theory Title" 
          value={newPost.title} onChange={(e) => setNewPost({...newPost, title: e.target.value})}
          style={{ width: '100%', padding: '10px', marginBottom: '10px', background: '#222', border: '1px solid #333', color: 'white' }}
          required 
        />
        <textarea 
          placeholder="Share your theory..." 
          value={newPost.content} onChange={(e) => setNewPost({...newPost, content: e.target.value})}
          style={{ width: '100%', padding: '10px', height: '100px', background: '#222', border: '1px solid #333', color: 'white' }}
          required
        ></textarea>
        <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#ed1d24', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
          POST TO MULTIVERSE
        </button>
      </form>

      {/* Post List */}
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {loading ? <p>Loading theories...</p> : posts.map(post => (
          <div key={post._id} style={{ backgroundColor: '#151515', padding: '20px', marginBottom: '20px', borderRadius: '8px', borderLeft: '5px solid #ed1d24' }}>
            <h3>{post.title}</h3>
            <p style={{ color: '#ccc' }}>{post.content}</p>
            <small style={{ color: '#666' }}>Posted on {new Date(post.createdAt).toLocaleDateString()}</small>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TheoryBoard;
