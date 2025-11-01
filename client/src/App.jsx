import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PostList from './pages/PostList';
import PostView from './pages/PostView';
import PostForm from './pages/PostForm';
import Navbar from './components/Navbar';
import { PostsProvider } from './context/PostsContext';
import CreateCategory from "./pages/CreateCategory";


export default function App() {
  return (
    <PostsProvider>
      <BrowserRouter>
        <header><Navbar /></header>
        <main className="container">
          <Routes>
            <Route path="/" element={<PostList />} />
            <Route path="/posts/:id" element={<PostView />} />
            <Route path="/create" element={<PostForm />} />
            <Route path="/edit/:id" element={<PostForm />} />
            <Route path="/create-category" element={<CreateCategory />} />
          </Routes>
        </main>
      </BrowserRouter>
    </PostsProvider>
  );
}