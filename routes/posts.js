const express = require('express');
const res = require('express/lib/response');
const router = express.Router();
const Post = require('../model/Post');

//retrieve data on database
router.get('/', async (req, res) => {
   try{
       const posts = await Post.find();
       res.json(posts);

   }catch(err) {
       res.json({ message: err });
   }
});


//endpoint to submit data in the database
router.post('/', async (req,res) =>{
   const post = new Post({
       name: req.body.name,
       course: req.body.course
   });
   try{
       const savedPost =  await post.save();
       res.json(savedPost);
   }catch(err){
       res.json({message: err});
   }
});

//specific posts
router.get('/:postId', async (req, res) => {
    try{
    const post = await Post.findById(req.params.postId);
    res.json(post);
    }catch(err){
        res.json({mesage:err});
    }
})

//delete Post
try{
    router.delete('/:postId', async (req,res) =>{
       const removePost = await Post.remove({_id: req.params.postId });
       res.json(removePost);
    });
}catch(err){
    res.json({message:err});
}

//update a post
router.patch('/:postId', async (req,res) => {
 try{
   const updatePost = await Post.updateOne({_id: req.params.postId}, 
    {$set : {course: req.body.course}});
   res.json(updatePost);
    
}catch(err){
    res.json({message:err});
}
});

module.exports = router;