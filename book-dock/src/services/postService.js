export const getPosts = async () => {
    const res = await fetch('/admin/posts');
    return res.json();
  };
    
export const approvePost = async (post) => {
    const res = await fetch('/admin/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(post),
    });
  
    return res.json();
  };
  
  export const deletePost = async (postID) => {
    const res = await fetch(`/admin/posts/${postID}`, {
      method: 'DELETE',
    });
  
    return res.json();
  };