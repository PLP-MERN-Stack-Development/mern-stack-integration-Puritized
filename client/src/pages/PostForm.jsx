import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { postService, categoryService } from '../service/api';

export default function PostForm() {
  const { id } = useParams();
  const isEdit = !!id;
  const [form, setForm] = useState({ title:'', content:'', category:'', tags:'' });
  const [file, setFile] = useState(null);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(()=>{
    (async ()=>{
      try {
        const catRes = await categoryService.getAllCategories();
        setCategories(catRes.data || catRes);

        if (isEdit) {
          const res = await postService.getPost(id);
          const p = res.data || res;
          setForm({ title: p.title, content: p.content, category: p.category?._id || '', tags: (p.tags || []).join(',') });
        }
      } catch (err) {
        console.error(err);
      }
    })();
  }, [id]);

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      // validation
      if (!form.title || !form.content || !form.category) {
        alert('Title, content and category are required');
        return;
      }

      const payload = new FormData();
      payload.append('title', form.title);
      payload.append('content', form.content);
      payload.append('category', form.category);
      payload.append('excerpt', form.content.slice(0, 140));
      // tags array
      const tagsArray = form.tags.split(',').map(t => t.trim()).filter(Boolean);
      tagsArray.forEach(tag => payload.append('tags[]', tag));
      if (file) payload.append('featuredImage', file);

      if (isEdit) {
        await postService.updatePost(id, payload);
      } else {
        await postService.createPost(payload);
      }
      navigate('/');
    } catch (err) {
      console.error(err);
      alert('Failed to save post');
    }
  };

  return (
    <form onSubmit={onSubmit} className="card">
      <h2>{isEdit ? 'Edit Post' : 'Create Post'}</h2>
      <label>Title</label>
      <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required />
      <label>Category</label>
      <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} required>
        <option value=''>Select category</option>
        {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
      </select>
      <label>Content</label>
      <textarea rows={8} value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} required />
      <label>Tags (comma separated)</label>
      <input value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} />
      <label>Featured image</label>
      <input type="file" onChange={e => setFile(e.target.files[0])} />
      <div style={{marginTop:8}}>
        <button type="submit">{isEdit ? 'Update' : 'Create'}</button>
      </div>
    </form>
  );
}