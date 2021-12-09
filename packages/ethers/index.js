import { ethers } from 'ethers'
import * as bip39 from 'bip39'

// 生成助记词
export function generateMnemonic() {
  return bip39.generateMnemonic()
}

// 校验是否为 eth 地址
export function isValidAddress(address) {
  return ethers.utils.isAddress(address)
}

// 通过助记词获取地址
export function getAddressByMnemonic(mnemonic) {
  const wallet = ethers.Wallet.fromMnemonic(mnemonic)
  return wallet.address
}

// 通过助记词获取私钥
export function getPrivateKeyByMnemonic(mnemonic) {
  const wallet = ethers.Wallet.fromMnemonic(mnemonic)
  return wallet.privateKey
}

/**
 * 以太坊转账
 * https://ethereum.org/en/developers/tutorials/send-token-etherjs/
 */
export async function signTransaction({
  privatekey,
  to,
  value,
  gasLimit,
  gasPrice,
  maxPriorityFeePerGas,
  maxFeePerGas,
  nonce,
  type,
  chainId,
}) {
  const wallet = new ethers.Wallet(privatekey)
  const transactionConfig = {
    to,
    value: value,
    gasLimit: gasLimit || 21000,
    nonce,
    type,
    chainId,
  }
  gasPrice && (transactionConfig['gasPrice'] = gasPrice)
  maxPriorityFeePerGas && (transactionConfig['maxPriorityFeePerGas'] = maxPriorityFeePerGas)
  maxFeePerGas && (transactionConfig['maxFeePerGas'] = maxFeePerGas)
  // console.log({ transactionConfig })
  const transaction = await wallet.signTransaction(transactionConfig)
  // console.log('Raw txhash string ' + rawTransaction)
  return transaction
}

/**
 * erc20 转账
 * https://github.com/ethers-io/ethers.js/issues/838
 */
export async function signErc20Transaction({
  contractAddress,
  toAddress,
  value,
  privatekey,
  abi,
  gasLimit,
  gasPrice,
  nonce,
  maxPriorityFeePerGas,
  maxFeePerGas,
  type,
  chainId,
}) {
  // provider
  const provider = ethers.getDefaultProvider(chainId)
  // wallet
  const wallet = new ethers.Wallet(privatekey, provider)
  // contract
  const contract = new ethers.Contract(contractAddress, abi, wallet)
  // transactionConfig
  const transactionConfig = {
    gasLimit: gasLimit || 70000,
    type,
    nonce,
  }
  gasPrice && (transactionConfig['gasPrice'] = gasPrice)
  maxPriorityFeePerGas && (transactionConfig['maxPriorityFeePerGas'] = maxPriorityFeePerGas)
  maxFeePerGas && (transactionConfig['maxFeePerGas'] = maxFeePerGas)

  const unsignedTx = await contract.populateTransaction.transfer(toAddress, value, transactionConfig)
  const transaction = await wallet.signTransaction(unsignedTx)
  return transaction
}

/**
 * ETH transfer
 */
async function ethTransfer() {
  // mnemonic
  const mnemonic = generateMnemonic()
  const privatekey = getPrivateKeyByMnemonic(mnemonic)
  // to
  const to = ''
  // value
  const value = ethers.utils.parseEther('0.1')
  // gasLimit
  const gasLimit = 21000
  // gasPrice
  const gasPrice = ethers.utils.parseUnits('200', 'gwei')
  // nonce
  const nonce = 15
  // type Legacy: 0 eip1559: 2
  const type = 0
  // chainId https://chainlist.org/
  const chainId = 3
  // 转账信息
  const transactionInfo = {
    privatekey,
    to,
    value,
    gasLimit,
    gasPrice,
    nonce,
    type,
    chainId,
  }

  // transaction https://ropsten.etherscan.io/
  const transaction = await signTransaction(transactionInfo)

  console.log({
    transactionInfo,
    transaction,
  })
}

/**
 * ETH erc20 transfer
 */
async function ethErc20Transfer() {
  // mnemonic
  const mnemonic = generateMnemonic()
  // privatekey
  const privatekey = getPrivateKeyByMnemonic(mnemonic)
  // contractAddress
  const contractAddress = ''
  // toAddress
  const toAddress = ''
  // value
  const value = ethers.utils.parseEther('1000', 18)
  // abi
  const abi = [
    {
      inputs: [
        { indexed: true, name: 'owner', internalType: 'address', type: 'address' },
        { indexed: true, name: 'spender', internalType: 'address', type: 'address' },
        { indexed: false, name: 'value', internalType: 'uint256', type: 'uint256' },
      ],
      name: 'Approval',
      anonymous: false,
      type: 'event',
    },
    {
      inputs: [
        { indexed: true, name: 'from', internalType: 'address', type: 'address' },
        { indexed: true, name: 'to', internalType: 'address', type: 'address' },
        { indexed: false, name: 'value', internalType: 'uint256', type: 'uint256' },
      ],
      name: 'Transfer',
      anonymous: false,
      type: 'event',
    },
    {
      outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
      inputs: [],
      name: 'DOMAIN_SEPARATOR',
      stateMutability: 'view',
      type: 'function',
    },
    {
      outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
      inputs: [
        { name: 'owner', internalType: 'address', type: 'address' },
        { name: 'spender', internalType: 'address', type: 'address' },
      ],
      name: 'allowance',
      stateMutability: 'view',
      type: 'function',
    },
    {
      outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
      inputs: [
        { name: 'spender', internalType: 'address', type: 'address' },
        { name: 'amount', internalType: 'uint256', type: 'uint256' },
      ],
      name: 'approve',
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
      inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
      name: 'balanceOf',
      stateMutability: 'view',
      type: 'function',
    },
    {
      outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
      inputs: [],
      name: 'decimals',
      stateMutability: 'view',
      type: 'function',
    },
    {
      outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
      inputs: [
        { name: 'spender', internalType: 'address', type: 'address' },
        { name: 'subtractedValue', internalType: 'uint256', type: 'uint256' },
      ],
      name: 'decreaseAllowance',
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      outputs: [{ name: '_data', internalType: 'bytes', type: 'bytes' }],
      inputs: [
        { name: '_name', internalType: 'string', type: 'string' },
        { name: '_symbol', internalType: 'string', type: 'string' },
        { name: '_owner', internalType: 'address', type: 'address' },
        { name: '_initialSupply', internalType: 'uint256', type: 'uint256' },
      ],
      name: 'getInitData',
      stateMutability: 'pure',
      type: 'function',
    },
    {
      outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
      inputs: [
        { name: 'spender', internalType: 'address', type: 'address' },
        { name: 'addedValue', internalType: 'uint256', type: 'uint256' },
      ],
      name: 'increaseAllowance',
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      outputs: [],
      inputs: [{ name: '_data', internalType: 'bytes', type: 'bytes' }],
      name: 'init',
      stateMutability: 'payable',
      type: 'function',
    },
    {
      outputs: [],
      inputs: [{ name: '_data', internalType: 'bytes', type: 'bytes' }],
      name: 'initToken',
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      outputs: [],
      inputs: [
        { name: '_name', internalType: 'string', type: 'string' },
        { name: '_symbol', internalType: 'string', type: 'string' },
        { name: '_owner', internalType: 'address', type: 'address' },
        { name: '_initialSupply', internalType: 'uint256', type: 'uint256' },
      ],
      name: 'initToken',
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      outputs: [{ name: '', internalType: 'string', type: 'string' }],
      inputs: [],
      name: 'name',
      stateMutability: 'view',
      type: 'function',
    },
    {
      outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
      inputs: [{ name: '', internalType: 'address', type: 'address' }],
      name: 'nonces',
      stateMutability: 'view',
      type: 'function',
    },
    {
      outputs: [],
      inputs: [
        { name: 'owner_', internalType: 'address', type: 'address' },
        { name: 'spender', internalType: 'address', type: 'address' },
        { name: 'value', internalType: 'uint256', type: 'uint256' },
        { name: 'deadline', internalType: 'uint256', type: 'uint256' },
        { name: 'v', internalType: 'uint8', type: 'uint8' },
        { name: 'r', internalType: 'bytes32', type: 'bytes32' },
        { name: 's', internalType: 'bytes32', type: 'bytes32' },
      ],
      name: 'permit',
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      outputs: [{ name: '', internalType: 'string', type: 'string' }],
      inputs: [],
      name: 'symbol',
      stateMutability: 'view',
      type: 'function',
    },
    {
      outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
      inputs: [],
      name: 'tokenTemplate',
      stateMutability: 'view',
      type: 'function',
    },
    {
      outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
      inputs: [],
      name: 'totalSupply',
      stateMutability: 'view',
      type: 'function',
    },
    {
      outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
      inputs: [
        { name: 'recipient', internalType: 'address', type: 'address' },
        { name: 'amount', internalType: 'uint256', type: 'uint256' },
      ],
      name: 'transfer',
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
      inputs: [
        { name: 'sender', internalType: 'address', type: 'address' },
        { name: 'recipient', internalType: 'address', type: 'address' },
        { name: 'amount', internalType: 'uint256', type: 'uint256' },
      ],
      name: 'transferFrom',
      stateMutability: 'nonpayable',
      type: 'function',
    },
  ]
  // gasLimit
  const gasLimit = 70000
  // gasPrice
  const gasPrice = ethers.utils.parseUnits('150', 'gwei')
  // nonce
  const nonce = 18
  // type Legacy: 0 eip1559: 2
  const type = 0
  // chainId https://chainlist.org/
  const chainId = 3
  // 转账信息
  const transactionInfo = {
    contractAddress,
    toAddress,
    value,
    privatekey,
    abi,
    gasLimit,
    gasPrice,
    nonce,
    type,
    chainId,
  }

  // transaction https://ropsten.etherscan.io/
  const transaction = await signErc20Transaction(transactionInfo)

  console.log({
    transactionInfo,
    transaction,
  })
}

// 以太坊转账
// ethTransfer()

// erc20 转账
// ethErc20Transfer()
