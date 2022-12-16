const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    commentId: {   
        type: Number,
        required: true,  
        unique: true 
    },
    postId: {   
        type: Number,
        required: true,  
    },
    user: {   
        type: String,
        required: true, 
    },
    password: {   
        type: String,
        required: true, 
    },
    content: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
    }
}); 

module.exports = mongoose.model("comments", commentSchema);
// Goods 라는 모델명으로 goodsSchema를 사용할것이다.
//  Goods --> 컬렉션 명,  goodsSchema --> 데이터가 생성될 스키마라고 보자  