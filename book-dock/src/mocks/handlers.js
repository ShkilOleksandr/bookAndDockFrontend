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
