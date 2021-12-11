import { EntitySchema } from 'typeorm'
import { PepsiModel } from '../models/index.js'

export const PepsiEntity = new EntitySchema({
  name: 'Pepsi',
  tableName: 'app_pepsi_wallet',
  target: PepsiModel,
  columns: {
    id: {
      type: 'bigint',
      primary: true,
      nullable: false,
      unsigned: true,
      comment: 'id',
    },
    walletAddress: {
      type: 'varchar',
      name: 'wallet_address',
    },
    canMint: {
      type: 'int',
      name: 'can_mint',
      precision: 1,
    },
    mintedAt: {
      type: 'datetime',
      name: 'minted_at',
      default: null,
    },
    createdAt: {
      type: 'datetime',
      name: 'created_at',
      default: null,
    },
    updatedAt: {
      type: 'datetime',
      name: 'updated_at',
      default: null,
      nullable: true,
    },
    leaf: {
      type: 'datetime',
      name: 'leaf',
      default: null,
    },
    proof: {
      type: 'datetime',
      name: 'proof',
      default: null,
    },
  },
})
