import React, { createContext, useState, useEffect } from 'react';
import { postService, categoryService } from '../service/api';

export const PostsContext = createContext();

export const PostsProvider = ({ children }) => {
  const [postsState, setPostsState] = useState({ items: [], page:1, limit:10, total:0, loading:false });
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({ q: '', category: null });

  const fetchPosts = async (page = 1, limit = 10, category = null, q = null) => {
    setPostsState(s => ({ ...s, loading: true }));
    try {
      const res = await postService.getAllPosts(page, limit, category, q);
      // api returns { success, data, page, limit, total } or similar
      const items = res.data || res;
      setPostsState({ items, page: res.page || page, limit: res.limit || limit, total: res.total || (Array.isArray(items) ? items.length : 0), loading: false });
    } catch (err) {
      setPostsState(s => ({ ...s, loading: false }));
      throw err;
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await categoryService.getAllCategories();
      const list = res.data || res;
      setCategories(list);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  return (
    <PostsContext.Provider value={{ postsState, fetchPosts, categories, setPostsState, filters, setFilters }}>
      {children}
    </PostsContext.Provider>
  );
};