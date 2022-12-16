const bcrypt = require('bcrypt')

const PW = 'abcd1234'
const salt = 12

//hash 비동기콜백
bcrypt.hash(PW, salt, (err, encryptedPW) =>{

})

//hashSync 동기
const hash = bcrypt.hashSync(PW, salt)

//asnyc/await 사용
const hash = await bcrypt.hash(PW, salt)