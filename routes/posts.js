const express = require('express') 
const router = express.Router()  
const bcrypt = require('bcrypt')

const Post = require('../schemas/post.js')
  

//게시글 목록 조회
router.get('/posts', async(req,res) =>{
    const posts = await Post.find({}).sort({updatedAt: -1})
    const results = posts.map((post) => {
        return {
            title: post.title,
            user: post.user,
            updatedAt: post.updatedAt
        }
    })
    res.json({'data': results})
})

// 게시글 상세 조회
router.get('/posts/:_id', async(req,res) => {
    const {_id} = req.params
    const detail = await Post.findById(_id)
         
    res.json({detail})
})

//게시글 생성
router.post('/posts', async (req, res) => {
    const {user, password, title, content} = req.body

    // const posts = await Post.findById(_id)
    // if (posts.length){
    //     return res.status(400).json({
    //         success:false,
    //         errorMessage:"이미 작성한 게시글입니다."
    //     })
    // }
    
    const createdPosts = await Post.create({user, password, title, content})

    res.json({posts: createdPosts})
})

//게시글 수정
router.put('/posts/:_id', async(req, res) => {
    const {_id} = req.params
    const {user, password, title, content} = req.body

    const uppost = await Post.find({_id})
    if(uppost.length){
        // uppost.comparePassword(req.body.password, (err, isMatch) => {
        //     if(!isMatch)
        //         return res.json({success:false, message:"비밀번호가 일치하지 않습니다."})
            
        //     Post.update(
        //             {_id:_id},
        //             {$set: {title: title, content: content}}
        //     )
        // })

        // const ok = await bcrypt.compare(password, uppost.passwordHash)
        // if(!ok) {
        //     return res.json({success:false, message:"비밀번호가 일치하지 않습니다."})
        // }else{
        //     await Post.update(
        //         {_id:_id},
        //         {$set: {title: title, content: content}}
        //     )
        // }

        // 수틀리면 위에꺼 다지우고 이거만 쓰자
        await Post.update(
            {_id:_id},
            {$set: {title: title, content: content}}
        )
    }else{
        return res.status(404).json({
            success:false,
            errorMessage:"게시글 조회에 실패하였습니다."
        })
    }
    res.json({success:true, message: "게시글을 수정하였습니다."})
})

//게시글 삭제
router.delete('/posts/:_id', async(req, res) => {
    const {_id} = req.params

    const uppost = await Post.find({_id})
    if(uppost.length){
        await Post.deleteOne({_id})
    }
    res.json({result:'success', message:'게시글을 삭제하였습니다.'})
})






module.exports = router