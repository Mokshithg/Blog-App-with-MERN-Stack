import Blog from "../models/Blog";
import User from "../models/User";
import mongoose from "mongoose";

export const getAllBlogs = async(req,res,next)=>{
    try{
        let blogs = await Blog.find();
        if (blogs.length === 0){
            return res.status(404).json({message : "No Blogs Found"})
        }
        return res.status(200).json({blogs})
    }catch(err){
        console.log(err);
        return res.status(500).json({message: "Internal server error"})
    }
}

export const newBlog = async(req,res,next)=>{
    const {title, description, image, user} = req.body;

    let existingUser;
    try{
        existingUser = await User.findById(user)
    }catch(err){
        return console.log(err);
    }
    if(!existingUser){
        return res.status(404).json({message : "unable to find existing user by this userId"})
    }

    const blog = new Blog({
        title,
        description,
        image,
        user
    });
    try{
        const session = await mongoose.startSession();
        session.startTransaction();
        await blog.save({session});
        existingUser.blogs.push(blog);
        await existingUser.save({session});
        await session.commitTransaction();
    }catch(err){
        console.log(err);
        return res.status(500).json({message : err})
    }
    return res.status(200).json({blog});
}

export const updateBlog = async(req,res,next) =>{
    const {title, description} = req.body

    const blogId = req.params.id;

    let blog;
    try{
        blog = await Blog.findByIdAndUpdate(blogId, {
            title, 
            description
        });
    }catch(err){
        return console.log(err);   
    }
    if (!blog){
        return res.status(500).json({message : "Unable to update the blog"})
    }
    return res.status(200).json({blog})
}

export const getById = async(req,res,next) =>{
    const id = req.params.id;

    let blog;
    try{
        blog = await Blog.findById(id);
    }catch(err){
        return console.log(err)
    }
    if (!blog){
        return res.status(404).json({message : "Not Found!"})
    }
    return res.status(200).json({blog})
}

export const deleteBlog = async(req,res,next)=>{
    const id = req.params.id;   

    let blog;
    // try{
    //     blog = await Blog.findByIdAndDelete(id).populate("user");
    //     await blog.user.blogs.pull(blog);
    //     await blog.user.save();
    // }catch(err){
    //     return console.log(err);
    // }
    // if (!blog){
    //     return res.status(404).json({message : "Unable to Delete!"})
    // }
    // return res.status(200).json({message : "Successfully deleted"})
    try {
        const blog = await Blog.findByIdAndDelete(id).populate("user");
        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }
        if (blog.user) {
            await blog.user.blogs.pull(blog);
            await blog.user.save();
        }
        return res.status(200).json({ message: "Blog deleted successfully" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }    
}

export const getUserById = async(req,res,next)=>{
    const userId = req.params.id;
    let userBlogs;
    try{
        userBlogs = await User.findById(userId).populate("blog")
    }catch(err){
        return console.log(err)
    }
    if(!userBlogs){
        return res.status(404).json({message : "No Blog Found!"})
    }
    return res.status(200).json({blogs : userBlogs})
}