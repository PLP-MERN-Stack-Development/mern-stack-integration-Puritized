import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { postService } from '../service/api';

export default function PostView() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    (async ()=>{
      try {
        const res = await postService.getPost(id);
        const data = res.data || res;
        setPost(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <div>Loading post...</div>;
  if (!post) return <div>Post not found</div>;

  const imgSrc = post.featuredImage && (post.featuredImage.startsWith('/uploads') ? (import.meta.env.VITE_API_URL?.replace('/api','') || 'http://localhost:5000') + post.featuredImage : post.featuredImage);

  return (
    <article>
      <h1>{post.title}</h1>
      {post.featuredImage && <img className="featured" src={imgSrc} alt={post.title} />}
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
      <section>
        <h3>Comments ({post.comments?.length || 0})</h3>
        {post.comments?.map(c => (
          <div key={c._id} className="card">
            <div className="small">{c.user ? c.user : 'Unknown'}</div>
            <div>{c.content}</div>
            <div className="small">{new Date(c.createdAt).toLocaleString()}</div>
          </div>
        ))}
      </section>
    </article>
  );
}