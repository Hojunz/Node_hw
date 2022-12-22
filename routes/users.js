const express = require("express");
const router = express.Router()  
const jwt = require('jsonwebtoken')

const { Op } = require("sequelize");
const { User } = require("../models");

const { body, validationResult } = require("express-validator");
const { secretKey, option } = require("../config/secretKey");

const authMiddleware = require('../middlewares/auth-Middleware.js');

// 유효성검사---------------------
const validationFunc = (req,res,next) => {
    const err = validationResult(req)
    if (!err.isEmpty()) {
        return res.status(400).json({message: err.array()})
    }
    next()
}

// 회원가입 -----------------------------------------------------------------------------------------------
router.post('/signup', [
    body('nickname').trim().isAlphanumeric().withMessage('알파벳과 숫자만 가능').isLength({min: 3}).withMessage('닉네임은 3글자 이상으로'),
    body('password').trim().isLength({min: 4}).withMessage('비밀번호는 4글자 이상'),
    validationFunc,
    ],
    async(req, res, next) => {
        const {email, nickname, password, confirmPassword} = req.body
        //비밀번호 확인
        if (password !== confirmPassword) {
            res.status(400).send({errorMessage: '패스워드가 일치하지 않습니다.'})
            return
        }
        // 닉네임 포함여부
        if (password.includes(nickname) == true) {
            return res.status(400).send({errorMessage:'닉네임 포함 NO'})
        }
        //email, nickname 동일할 때 실패
        const existsUsers = await User.findAll({
            where: {
                [Op.or] : [{email}, {nickname}],
            }
        })
        if (existsUsers.length > 0) {
            res.status(400).send({errorMessage:'이메일 또는 닉네임이 이미 사용중입니다.'})
            return
        }
        await User.create({email, nickname, password})
        res.status(201).send({message: '회원가입에 성공하였습니다.'})
})

// 로그인 ------------------------------------------------------------------------------------
router.post('/login', async(req, res, next) => {
    const {email, password} = req.body

    const user = await User.findOne({
        where: {email}
    })
    //정보가 틀렸을 때
    if(!user || password !== user.password) {
        res.status(400).send({errorMessage:'닉네임 또는 패스워드를 확인해주세요.'})
        return
    }
    //성공 시
    res.send({
        token: jwt.sign({id: user.id}, secretKey, option)
    })
})

//로그인 검사 ----------------------------------------------------------------------------------
router.get('/user/me', authMiddleware, async(req,res) => {
    res.json({ user: res.locals.user });
})
 
 
module.exports = router