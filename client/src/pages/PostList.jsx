import React, { useContext, useEffect, useState } from 'react';
import { PostsContext } from '../context/PostsContext';
import { Link } from 'react-router-dom';
import useApi from '../hooks/useApi';
import { postService } from '../service/api';

export default function PostList() {
  const { postsState, fetchPosts, categories, setPostsState, filters, setFilters } = useContext(PostsContext);
  const { loading, error, call } = useApi();
  const [page, setPage] = useState(1);

  useEffect(() => {
    call(fetchPosts, page, postsState.limit, filters.category, filters.q).catch(()=>{});
  }, [page, filters]);

  const onDelete = async (id) => {
    // optimistic UI update
    const prev = postsState.items;
    setPostsState(s => ({ ...s, items: s.items.filter(p => p._id !== id) }));
    try {
      await postService.deletePost(id);
    } catch (err) {
      // rollback
      setPostsState(s => ({ ...s, items: prev }));
      alert('Delete failed');
    }
  };

  return (
    <div>
      <h1>Posts</h1>
      <div style={{display:'flex', gap:8, marginBottom:12}}>
        <select value={filters.category || ''} onChange={e => setFilters(f => ({ ...f, category: e.target.value || null }))}>
          <option value=''>All categories</option>
          {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
        </select>
        <input placeholder="Search..." value={filters.q} onChange={e => setFilters(f => ({ ...f, q: e.target.value }))} />
      </div>

      {postsState.loading || loading ? <div>Loading...</div> : null}
      {error && <div className="card">Error: {error.message || 'Request failed'}</div>}

      {postsState.items.length === 0 && <div>No posts found</div>}
      {postsState.items.map(post => (
        <article key={post._id} className="card">
          <h2><Link to={`/posts/${post.slug || post._id}`}>{post.title}</Link></h2>
          <p className="small">{post.excerpt || (post.content?.slice(0, 160) + '...')}</p>
          <div className="small">Category: {post.category?.name} • By: {post.author?.name}</div>
          <div style={{marginTop:8}}>
            <Link to={`/edit/${post._id}`} style={{marginRight:8}}>Edit</Link>
            <button onClick={() => onDelete(post._id)}>Delete</button>
          </div>
        </article>
      ))}

      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:12}}>
        <div className="small">Total: {postsState.total || postsState.items.length}</div>
        <div>
          <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page===1}>Prev</button>
          <span style={{margin:'0 12px'}}>Page {page}</span>
          <button onClick={() => setPage(p => p+1)}>Next</button>
        </div>
      </div>
    </div>
  );
}