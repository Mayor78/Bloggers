const Post = require('../models/postModel')
const User = require ('../models/userModel')
const path = require('path')
const fs =require('fs')
const {v4: uuid} = require('uuid')
const HttpError = require('../models/errorModel')

// ================== CREATE A POST //POST : api/posts
// PROTECTED

// const createPost = async (req, res, next) => {
//     try {
//         let{title,category,description} = req.body;
//         if(!title || !category || !description || !req.files){
//             return next(new HttpError("Please enter all fields and choose an image",422))
//         }
//         const {thumbnail} = req.files;
//         // check file size
//         if(thumbnail.size > 2000000){
//             return next(new HttpError("Image size is too big should be less than 2MB",422))
//         }
//         // check file name
//         let fileName = thumbnail.name;
//         let splittedFilename = fileName.split('.')
//         let newFilename = splittedFilename[0] +uuid() +"." +splittedFilename[splittedFilename.length -1]
//         thumbnail.mv(path.join(__dirname, '..', '/uploads', newFilename), async(err)=>{
//             if(err){
//                 return next(new HttpError(err))
//             }else {
//                 const newPost = await Post.create({title, category, description,thumbnail: newFilename,
//                     creator: req.user.id
//                 })
//                 if(!newPost){
//                     return next(new HttpError("Post couldnt be created", 422))

//                 }
//                 // find user and increase post count by 1
//                 const currentUser = await User.findById(req.user.id);
//                 const userPostCount = currentUser.posts +1;
//                 await User.findByIdAndUpdate(req.user.id, {posts:userPostCount})
//                 res.status(201).json(newPost)
//             }
          
//         })
//     } catch (error) {
        
//     }
// }


const createPost = async (req, res, next) => {
    try {
        let { title, category, description } = req.body;

        // Validate input
        if (!title || !category || !description || !req.files || !req.files.thumbnail) {
            return next(new HttpError("Please enter all fields and choose an image", 422));
        }

        const thumbnail = req.files.thumbnail;

        // Validate thumbnail size
        if (thumbnail.size > 2000000) {
            return next(new HttpError("Image size is too large, should be less than 2MB", 422));
        }

        // Generate new filename for the thumbnail
        let fileName = thumbnail.name;
        let splittedFilename = fileName.split('.');
        let newFilename = `${splittedFilename[0]}_${uuid()}.${splittedFilename[splittedFilename.length - 1]}`;

        const uploadPath = path.join(__dirname, '..', 'uploads', newFilename);

        // Move the uploaded file to the uploads folder
        thumbnail.mv(uploadPath, async (err) => {
            if (err) {
                return next(new HttpError("File upload failed", 500));
            }

            try {
                // Create new post in the database
                const newPost = await Post.create({
                    title,
                    category,
                    description,
                    thumbnail: newFilename,
                    creator: req.user.id
                });

                if (!newPost) {
                    return next(new HttpError("Post couldn't be created", 500));
                }

                // Update user's post count
                const currentUser = await User.findById(req.user.id);
                if (currentUser) {
                    const userPostCount = (currentUser.posts || 0) + 1; // Ensure postsCount starts at 0 if undefined
                    await User.findByIdAndUpdate(req.user.id, { posts: userPostCount });
                }

                res.status(201).json(newPost);
            } catch (error) {
                return next(new HttpError("Post creation failed", 500));
            }
        });

    } catch (error) {
        return next(new HttpError("Internal Server Error", 500));
    }
};

  





// ================== GET ALL POSTS //GET : api/posts
// UNPROTECTED

const getAllPosts = async (req, res, next)=>{
    try{
  const posts = await Post.find().sort({updatedAt: -1})
  res.status(200).json(posts)
    }catch{
        return next(new HttpError("Internal Server Error", 500));

    }
}



// ================== GET SINGLE POST  //GET : api/posts/:id
// UNPROTECTED

const getPost = async (req, res, next)=>{
   try {
     const postId = req.params.id;
     const post = await Post.findById(postId);
    if(!post){
         return next(new HttpError("Post not found", 404));
    }
     res.status(200).json(post)
   } catch (error) {
     return next(new HttpError("Post not found", 404));
    
   }
}



// ================== GET  POSTS BY CATEGORY //GET : api/posts/categories/:category
//UNPROTECTED

const getCatPosts = async (req, res, next)=>{
 try {
    const {category} = req.params;
    const catPosts = await Post.find({category}).sort({createdAt: - 1})
    res.status(200).json(catPosts)
 } catch (error) {
    
 }
}




// ================== GET POSTS BY AUTHOR //GET : api/posts/users/:id
//UNPROTECTED

const getUserPosts = async (req, res, next)=>{
    try {
        const {id} = req.params;
        const posts = await Post.find({creator: id}).sort({createdAt: -1})
        res.status(200).json(posts)
    } catch (error) {
        return next(new HttpError("Internal Server Error", 500));
    }
}



// ================== EDIT POST //PATCH : api/posts/:id

// PROTECTED

const editPost = async (req, res, next) => {
    try {
        let fileName;
        let newFilename;
        let updatedPost;
        const postId = req.params.id;
        const { title, category, description } = req.body;

        // Validate input
        if (!title || !category || description.length < 12) {
            return next(new HttpError("Please enter all fields", 422));
        }

        if (!req.files || !req.files.thumbnail) {
            // If no new thumbnail file provided, update post without changing thumbnail
            updatedPost = await Post.findByIdAndUpdate(postId, { title, category, description }, { new: true });
        } else {
            // Get old post from database
            const oldPost = await Post.findById(postId);
           

            // Delete old image if it exists
            if (oldPost.thumbnail) {
                fs.unlink(path.join(__dirname, '..', 'uploads', oldPost.thumbnail), async (err) => {
                    if (err) {
                        return next(new HttpError(err));
                    }
                });
            }

            // Upload new image
            const thumbnail = req.files.thumbnail;

            if (thumbnail.size > 2000000) {
                return next(new HttpError("Image size is too large, should be less than 2MB", 422));
            }

            fileName = thumbnail.name;
            const splittedFilename = fileName.split('.');
            newFilename = splittedFilename[0] + uuid() + "." + splittedFilename[splittedFilename.length - 1];

            // Move uploaded file to uploads folder
            thumbnail.mv(path.join(__dirname, '..', 'uploads', newFilename), async (err) => {
                if (err) {
                    return next(new HttpError(err));
                }
            });

            // Update post with new thumbnail filename
            updatedPost = await Post.findByIdAndUpdate(postId, { title, category, description, thumbnail: newFilename }, { new: true });
        }

        if (!updatedPost) {
            return next(new HttpError("Post couldn't be updated", 500));
        }

        // Respond with updated post
        res.status(200).json(updatedPost);

    } catch (error) {
        // Handle any internal server errors
        return next(new HttpError("Internal Server Error", 500));
    }
};



// ================== DELETE POST //DELETE : api/posts/:id

// PROTECTED

const deletePost = async (req, res, next) => {
    const postId = req.params.id;
    try {
        if (!postId) {
            return next(new HttpError("Please enter a post id", 422));
        }

        const post = await Post.findById(postId);
        if (!post) {
            return next(new HttpError("Post not found", 404));
        }

        const fileName = post.thumbnail;
          if(req.user.id == post.creator){

          
        // Delete thumbnail from upload folder
        fs.unlink(path.join(__dirname, '..', 'uploads', fileName), async (err) => {
            if (err) {
                return next(new HttpError(err));
            }

            // Delete post from database
            await Post.findByIdAndDelete(postId);

            // Update user's post count
            const currentUser = await User.findById(req.user.id);
            if (currentUser) {
                const userPostCount = (currentUser.posts || 0) -1; // Ensure postsCount starts at 0 if undefined
                await User.findByIdAndUpdate(req.user.id, { posts: userPostCount });
            }
        });
    }else{
        return next(new HttpError("You don't have permission to delete this post", 403));
    }
        // Respond with success message after everything is completed
        res.status(200).json({ message: `Post ${postId} deleted successfully` });

    } catch (error) {
        return next(new HttpError("Internal Server Error", 500));
    }
};




module.exports = { createPost,getCatPosts,getPost,getAllPosts,getUserPosts,editPost,deletePost,
    
}