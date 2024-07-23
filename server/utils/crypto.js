require('dotenv').config({path: `${__dirname}/../.env`})
const {
  scryptSync,
  createCipheriv,
  createDecipheriv
} = require('node:crypto');

const { Buffer } = require('node:buffer');

const PASSWORD = process.env.IMG_PASS_KEY || 'asd123'
const SECRET = process.env.IMG_PASS_SECRET || null
const IV = process.env.IMG_PASS_IV || null
const ALGORITHM = process.env.IMG_PASS_ALGO || 'aes-192-cbc'

const key =  scryptSync(PASSWORD,SECRET,24)
const iv =  Buffer.from(IV, 'utf8')

const encrypt = (data) => {
  const cipher = createCipheriv(ALGORITHM, key, iv);
  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

const decrypt = (encrypted) => {
  const decipher = createDecipheriv(ALGORITHM, key, iv);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted
}


module.exports = {
  encrypt,
  decrypt
}