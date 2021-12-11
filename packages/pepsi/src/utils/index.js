import { SnowFlake } from './snowflake.js'

const idWorker = new SnowFlake(1n, 1n)

/**
 * 获取雪花id
 */
export function genId() {
  return idWorker.nextId().toString()
}
