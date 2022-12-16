const mongoose = require("mongoose")
const bcrypt = require('bcrypt')
const saltRounds = 10

const postSchema = new mongoose.Schema({
    user: {
      type: String,  
      required: true,
    },
    password: {
      type: String,
    },
    title: {
      type: String,
    },
    content: {
      type: String,
    },
  });

postSchema.set('timestamps', true)

//해쉬
postSchema.pre('save',function(next){
  let post = this

  if(post.isModified('password')){
    bcrypt.genSalt(saltRounds,function(err,salt){
      if(err) return next(err)
      bcrypt.hash(post.password, salt, function(err,hash){
        if(err) return next(err)
        post.password=hash
        next()
      })
    })
  }else{
    next()
  }
})

postSchema.methods.comparePassword = function(plainPassword, cb) {
  bcrypt.compare(plainPassword, this.password, function(err, isMatch){
    if(err) return cb(err),
    cb(null, isMatch)
  })
}

module.exports = mongoose.model("post", postSchema);
