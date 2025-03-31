import { rest } from 'msw';

let users = [
  {
    userID: 101,
    name: 'John',
    surname: 'Doe',
    email: 'sailor123@example.com',
    password: 'securepassword',
    phone_number: '1234567890',
    role: 'sailor',
  },
];

// Expose GET, PUT, DELETE routes as per the admin docs
export const handlers = [
  // ✅ GET /admin/users
  rest.get('/admin/users', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(users));
  }),

  // ✅ PUT /admin/users/:userID
  rest.put('/admin/users/:userID', async (req, res, ctx) => {
    const { userID } = req.params;
    const updatedUser = await req.json();

    let userFound = false;
    users = users.map(user => {
      if (user.userID === parseInt(userID)) {
        userFound = true;
        return { ...user, ...updatedUser };
      }
      return user;
    });

    if (!userFound) {
      return res(ctx.status(404), ctx.json({ message: 'User not found' }));
    }

    return res(ctx.status(200), ctx.json({ message: 'User updated' }));
  }),

  // ✅ DELETE /admin/users/:userID
  rest.delete('/admin/users/:userID', (req, res, ctx) => {
    const { userID } = req.params;
    const initialLength = users.length;
    users = users.filter(user => user.userID !== parseInt(userID));

    if (users.length === initialLength) {
      return res(ctx.status(404), ctx.json({ message: 'User not found' }));
    }

    return res(ctx.status(200), ctx.json({ message: 'User deleted' }));
  }),
];

let posts = [
  {
    postID: 1,
    title: 'Dock Maintenance',
    content: 'Details about dock maintenance...',
    authorID: 101,
    publication_date: '2025-03-31',
  },
];

handlers.push(
  rest.get('/admin/posts', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(posts));
  }),

  rest.post('/admin/posts', async (req, res, ctx) => {
    const post = await req.json();

    if (post.title.includes('banned')) {
      return res(
        ctx.status(400),
        ctx.json({
          message: 'Post rejected',
          reason: 'Inappropriate content',
        })
      );
    }

    const newPost = { ...post, postID: Date.now() };
    posts.push(newPost);

    return res(ctx.status(201), ctx.json({ message: 'Post approved' }));
  }),

  rest.delete('/admin/posts/:postID', (req, res, ctx) => {
    const { postID } = req.params;
    const initialLength = posts.length;
    posts = posts.filter(p => p.postID !== parseInt(postID));

    if (posts.length === initialLength) {
      return res(ctx.status(404), ctx.json({ message: 'Post not found' }));
    }

    return res(ctx.status(200), ctx.json({ message: 'Post deleted' }));
  })
);

let guides = [
  {
    guideID: 401,
    title: "Exploring Lomza",
    content: "A guide to the best spots in Lomza.",
    authorID: 301,
    publicationDate: "2022-07-01",
    pictures: [
      {
        url: "https://example.com/lomza1.jpg",
        description: "A scenic view of Lomza’s Old Town.",
      },
      {
        url: "https://example.com/lomza2.jpg",
        description: "The Narew River in Lomza.",
      },
    ],
    links: [
      {
        url: "https://tourism.lomza.com",
        description: "Official Lomza Tourism Website",
      },
      {
        url: "https://example.com/best-cafes-lomza",
        description: "Top cafes to visit in Lomza",
      },
    ],
  },
];

let comments = []; // For comments on guides


handlers.push(
  // ✅ GET /guides (needed to fetch the list)
  rest.get('/guides', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(guides));
  })
);

handlers.push(
  // ✅ POST /guides
  rest.post('/guides', async (req, res, ctx) => {
    const guide = await req.json();
    const newGuide = { ...guide, guideID: Date.now() };
    guides.push(newGuide);
    return res(ctx.status(201), ctx.json({
      message: 'Guide added successfully.',
      guideID: newGuide.guideID
    }));
  }),

  // ✅ PUT /guides/:guideID
  rest.put('/guides/:guideID', async (req, res, ctx) => {
    const { guideID } = req.params;
    const updatedGuide = await req.json();
    let found = false;

    guides = guides.map(guide => {
      if (guide.guideID === parseInt(guideID)) {
        found = true;
        return { ...guide, ...updatedGuide };
      }
      return guide;
    });

    if (!found) {
      return res(ctx.status(404), ctx.json({ message: 'Guide not found' }));
    }

    return res(ctx.status(200), ctx.json({ message: 'Guide updated successfully.' }));
  }),

  // ✅ DELETE /guides/:guideID
  rest.delete('/guides/:guideID', (req, res, ctx) => {
    const { guideID } = req.params;
    const initialLength = guides.length;
    guides = guides.filter(g => g.guideID !== parseInt(guideID));

    if (guides.length === initialLength) {
      return res(ctx.status(404), ctx.json({ message: 'Guide not found' }));
    }

    return res(ctx.status(200), ctx.json({ message: 'Guide deleted successfully.' }));
  }),

  // ✅ POST /guides/:guideID/comments
  rest.post('/guides/:guideID/comments', async (req, res, ctx) => {
    const { guideID } = req.params;
    const { userID, content } = await req.json();
    const commentID = Date.now();

    comments.push({
      commentID,
      guideID: parseInt(guideID),
      userID,
      content,
    });

    return res(ctx.status(201), ctx.json({
      message: 'Comment added successfully.',
      commentID
    }));
  })
);