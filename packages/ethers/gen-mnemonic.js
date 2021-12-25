/**
 * 生成助记词
 *
 */
import * as bip39 from 'bip39'

// 12 or 24
const mnemonicLength = 24
const accountSize = 10

function main() {
  const strength = mnemonicLength === 24 ? 256 : 128
  const res = []
  for (let i = 0; i < accountSize; i++) {
    res.push(bip39.generateMnemonic(strength))
  }
  console.table(res)
}

main()
