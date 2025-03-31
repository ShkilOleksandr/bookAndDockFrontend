export const addGuide = async (guide) => {
    const res = await fetch('/guides', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(guide),
    });
    return res.json();
  };
  
  export const updateGuide = async (id, guide) => {
    const res = await fetch(`/guides/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(guide),
    });
    return res.json();
  };
  
  export const deleteGuide = async (id) => {
    const res = await fetch(`/guides/${id}`, { method: 'DELETE' });
    return res.json();
  };
  
  export const addCommentToGuide = async (guideID, userID, content) => {
    const res = await fetch(`/guides/${guideID}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userID, content }),
    });
    return res.json();
  };