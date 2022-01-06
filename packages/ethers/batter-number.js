import { ethers } from 'ethers'
import * as bip39 from 'bip39'
import * as fs from 'fs'

/**
 * 查询靓号
 */
// 生成助记词
export function generateMnemonic() {
  return bip39.generateMnemonic()
}

// 通过助记词获取地址
export function getAddressByMnemonic(mnemonic) {
  const wallet = ethers.Wallet.fromMnemonic(mnemonic)
  return wallet.address
}

let times = 0
let isGoOn = true
let getCont = 0

while (isGoOn) {
  times++
  const mnemonic = generateMnemonic()
  const address = getAddressByMnemonic(mnemonic)

  if (address.startsWith(`0x200${getCont}`)) {
    fs.appendFileSync('./mnemonic.log', mnemonic, {
      encoding: 'utf8',
    })
    getCont++
    if (getCont >= 20) {
      isGoOn = false
    }
  }
}
