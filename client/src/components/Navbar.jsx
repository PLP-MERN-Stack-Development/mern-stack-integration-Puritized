import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav style={{display:'flex', alignItems:'center', justifyContent:'center', padding:12}}>
      <Link to="/" style={{fontSize:18, fontWeight:700}}>MERN Blog</Link>
      <div style={{marginLeft:10}}>
        <Link to="/">Posts</Link>
        <Link to="/create" style={{marginLeft:5}}>Create Post</Link>
        <li><a href="/create-category" style={{marginLeft:5}}>Create Category</a></li>
      </div>
    </nav>
  );
}