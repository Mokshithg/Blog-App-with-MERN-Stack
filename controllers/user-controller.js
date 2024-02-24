import User from "../models/User";
import bcrypt from 'bcrypt';

export const getAllUsers = async(req,res,next)=>{
    try{
        const users = await User.find();
        return res.status(200).json({users})
    }
    catch(err){
        console.log(err)
        return res.status(500).json({message : "Internal server error"})
    }
}

export const signup = async(req,res,next)=>{
    const {name, email, password} = req.body;

    let existinguser;
    try{
        existinguser = await User.findOne({email})
    }catch(err){
        return console.log(err)
    }
    if(existinguser){
        return res
        .status(400)
        .json({message : "User Already exist! Please login"})
    }

    const hashedPassword = bcrypt.hashSync(password,10);

    const user = new User({
        name,
        email,
        password : hashedPassword,
        blogs : []
    })

    try{
        await user.save()
    }catch(err){
        return console.log(err)
    }
    return res.status(201).json({user})
}

export const login = async(req,res,next)=>{
    const {email, password} = req.body;

    let existinguser;

    try{
        existinguser = await User.findOne({email})
    }catch(err){
        return console.log(err)
    }
    if(!existinguser){
        return res.status(404).json({message : "Coudn't find the user"});
    }

    const isPasswordCorrect = bcrypt.compareSync(password, existinguser.password);
    if(!isPasswordCorrect){
        return res.status(404).json({message : "Incorrect Password"});
    }
    return res.status(200).json({message : "Login Successfull"});
}

export const deleteUser = async(req,res,next)=>{
    const id = req.params.id;
    
    let user;
    try{
        user = await User.findByIdAndDelete(id).populate("blog");
        await user.blogs.users.pull(user);
        await user.save(); 
    }catch(err){
        return console.log(err)
    }
}