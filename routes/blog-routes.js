import express from 'express';
import { getAllBlogs, newBlog, updateBlog, getById, deleteBlog, getUserById } from '../controllers/blog-controller';

const blogRouter = express.Router()


blogRouter.get('/allblogs', getAllBlogs);
blogRouter.post('/new',newBlog);
blogRouter.put('/update/:id',updateBlog);
blogRouter.get('/:id',getById);
blogRouter.delete('/:id',deleteBlog);
blogRouter.get('/user/:id',getUserById);

export default blogRouter;      