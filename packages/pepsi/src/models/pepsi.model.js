export class PepsiModel {
  constructor(id, walletAddress, canMint, mintedAt, createdAt, updatedAt, leaf, proof) {
    this.id = id
    this.walletAddress = walletAddress
    this.canMint = canMint
    this.mintedAt = mintedAt
    this.createdAt = createdAt
    this.updatedAt = updatedAt
    this.leaf = leaf
    this.proof = proof
  }
}
