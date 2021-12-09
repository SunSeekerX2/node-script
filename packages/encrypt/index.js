const CryptoJS = require('crypto-js')

/**
 * AES 加密
 * @param data 需要加密的数据
 * @param key 需要加密的密码
 * @param cfg 加密配置
 * @returns
 */
function _getAesKeyAndIv(password, salt = '') {
  const iterations = 10
  // sizes must be a multiple of 32
  const keySize = 256
  const ivSize = 128
  // var salt = CryptoJS.lib.WordArray.random(128/8);
  // console.log(salt.toString(CryptoJS.enc.Base64));

  const output = CryptoJS.PBKDF2(password, salt, {
    keySize: (keySize + ivSize) / 32,
    iterations: iterations,
  })

  // the underlying words arrays might have more content than was asked: remove insignificant words
  output.clamp()

  // split key and IV
  const key = CryptoJS.lib.WordArray.create(output.words.slice(0, keySize / 64))
  const iv = CryptoJS.lib.WordArray.create(output.words.slice(keySize / 32))
  console.log(key.toString(CryptoJS.enc.Hex))
  console.log(iv.toString(CryptoJS.enc.Hex))
  return {
    key,
    iv,
  }
}
function encryptAES(data, key, cfg) {
  return CryptoJS.AES.encrypt(
    data,
    CryptoJS.enc.Utf8.parse(key),
    Object.assign(
      {
        iv: CryptoJS.enc.Utf8.parse('121'),
        // mode: CryptoJS.mode.ECB,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      },
      cfg
    )
  )
}
function encryptAES2Base64(data, password, cfg) {
  return encryptAES(data, password, cfg).toString()
}
function encryptAES2HexString(data, password, cfg) {
  return encryptAES(data, password, cfg).toString(CryptoJS.format.Hex)
}
// 解密
function decryptAES(data, key, cfg) {
  return CryptoJS.AES.decrypt(
    data,
    CryptoJS.enc.Utf8.parse(key),
    Object.assign(
      {
        iv: CryptoJS.enc.Utf8.parse('12'),
        // mode: CryptoJS.mode.ECB,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      },
      cfg
    )
  )
}
function decryptBase64AES2String(data, key, cfg) {
  return decryptAES(data, key, cfg).toString(CryptoJS.enc.Utf8)
}
function decryptHexAES(data, key, cfg) {
  const encryptedHex = CryptoJS.enc.Hex.parse(data)
  const encryptedBase64 = CryptoJS.enc.Base64.stringify(encryptedHex)
  return decryptAES(encryptedBase64, key, cfg)
}
function decryptHexAES2String(data, key, cfg) {
  return decryptHexAES(data, key, cfg).toString(CryptoJS.enc.Utf8)
}

const encryptText = 'encryptText'
const cipher = 'y9QPCIn3Oo56XNohGVqmQA=='
// const encryptRes = encryptAES(encryptText, cipher)
const encryptAES2Base64Res = encryptAES2Base64(encryptText, cipher)
const encryptAES2HexStringRes = encryptAES2HexString(encryptText, cipher)
// const decryptRes = decryptAES(encryptTextRes, cipher)
// const decryptTextRes = decryptBase64AES(encryptTextRes, cipher)
const decryptBase64AES2StringRes = decryptBase64AES2String(encryptAES2Base64Res, cipher)
const decryptHexAES2StringRes = decryptHexAES2String(encryptAES2HexStringRes, cipher)
console.log({
  encryptAES2Base64Res,
  encryptAES2HexStringRes,
  decryptBase64AES2StringRes,
  decryptHexAES2StringRes,
})
