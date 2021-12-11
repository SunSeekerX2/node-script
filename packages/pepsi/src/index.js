import * as fs from 'fs'
import path from 'path'
import typeorm from 'typeorm'
import { load as yamlLoad } from 'js-yaml'

import { PepsiEntity } from './entities/index.js'
import { PepsiModel } from './models/index.js'
import { genId } from './utils/index.js'

const __dirname = path.resolve()
const startTime = performance.now()

async function main() {
  /**
   * 解析 yaml 配置
   */
  try {
    const envFilePath = path.join(__dirname, `./env.${process.env.NODE_ENV.toLocaleLowerCase()}.yaml`)
    const localEnvConfig = yamlLoad(fs.readFileSync(envFilePath, 'utf8'))

    const connection = await typeorm.createConnection({
      type: 'mysql',
      host: localEnvConfig['DB_HOST'],
      port: localEnvConfig['DB_PORT'],
      username: localEnvConfig['DB_USER'],
      password: localEnvConfig['DB_PASSWORD'],
      database: localEnvConfig['DB_DATABASE'],
      synchronize: true,
      logging: false,
      entities: [PepsiEntity],
    })

    const pepsiListBuffer = fs.readFileSync(path.join(__dirname, './src/pepsi.js'))
    const pepsiListStr = pepsiListBuffer.toString()
    const pepsiList = JSON.parse(pepsiListStr)
    // 排序
    pepsiList.sort((a, b) => {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    })
    console.log(`排序完成，用时：${(performance.now() - startTime) / 1000}s`);

    // const pepsiRepo = connection.getRepository(PepsiModel)
    const length = pepsiList.length
    for (let i = 0; i < length; i++) {
      const item = pepsiList[i]
      const newItem = new PepsiModel(
        genId(),
        item.walletAddress,
        item.canMint,
        item.mintedAt,
        item.createdAt,
        item.updatedAt,
        item.leaf,
        item.proof
      )
      console.log(`开始插入第 ${i + 1}条, 剩余 ${length - i}`)
      await connection.manager.save(newItem)
    }

    console.log(`插入完成>>>, 用时：${(performance.now() - startTime) / 1000}s`)
    // console.log(pepsiList)
  } catch (error) {
    console.log(error)
  }
}

main()
