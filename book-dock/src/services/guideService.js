// Mock guideService – swap these for real HTTP calls when ready
let _mockGuides = [
  {
    guideID: 1,
    title: 'Gizycko – greatest place on earth. The end.',
    content: 'Gizycko – greatest place on earth. The end.',
    authorID: 2,
    publicationDate: '2025-03-23T02:34:21.592Z',
    pictures: [],
    links: [],
    comments: []
  },
  {
    guideID: 2,
    title: 'Welcome to my Dock: Bogaczewo',
    content: 'Dock here and pay money, the best toilet outside and…',
    authorID: 3,
    publicationDate: '2025-03-23T02:34:21.592Z',
    pictures: [],
    links: [],
    comments: []
  }
];

export function getGuides() {
  return Promise.resolve([..._mockGuides]);
}

export function addGuide(payload) {
  const newID = Math.max(..._mockGuides.map(g => g.guideID)) + 1;
  const newGuide = { ...payload, guideID: newID, comments: [] };
  _mockGuides.push(newGuide);
  return Promise.resolve({ guideID: newID, message: 'Guide added.' });
}

export function updateGuide(id, payload) {
  _mockGuides = _mockGuides.map(g =>
    g.guideID === id ? { ...g, ...payload } : g
  );
  return Promise.resolve({ message: `Guide ${id} updated.` });
}

export function deleteGuide(id) {
  _mockGuides = _mockGuides.filter(g => g.guideID !== id);
  return Promise.resolve({ message: `Guide ${id} deleted.` });
}

export function addCommentToGuide(guideID, userID, content) {
  const guide = _mockGuides.find(g => g.guideID === guideID);
  if (!guide) return Promise.reject('Guide not found');
  guide.comments.push({
    commentID: Date.now(),
    userID,
    content,
    createdOn: new Date().toISOString()
  });
  return Promise.resolve({ message: 'Comment added.' });
}
