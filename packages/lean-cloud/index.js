/**
 * @name: lean-cloud
 * @author: SunSeekerX
 * @Date: 2020-05-18 16:45:37
 * @LastEditors: SunSeekerX
 * @LastEditTime: 2020-05-20 18:47:27
 */

const axios = require('axios')
const schedule = require('node-schedule')
const moment = require('moment')
const chalk = require('chalk')
const log = console.log

/**
 * @name 配置信息
 */
const config = {
  // 是否打开Qmsg酱
  isOpenQmsg: true,
  // Qmsg酱的key
  qmsgKey: '',
  // Valine应用
  valines: [
    // SunSeekerX - Doc
    {
      // 应用名
      name: 'SunSeekerX - Doc',
      // 评论管理地址
      url: 'https://leanapp-sunseekerx.yoouu.cn/comments',
    },
    // SunSeekerX - Ghost
    {
      // 应用名
      name: 'SunSeekerX - Ghost',
      // 评论管理地址
      url: 'https://leanapp-ghost.yoouu.cn/comments',
    },
  ],
}

/**
 * @name 定时任务
 * @description Every 25 minutes, between 07:00 AM and 11:59 PM
 */
schedule.scheduleJob('0 */25 7-23 * * *', () => {
  // 干活~
  doWork()
})

/**
 * @name 别说了,干活~~~
 */
async function doWork() {
  const { valines } = config
  if (valines.length) {
    // 结果对象
    const result = []
    for (const item of valines) {
      try {
        const res = await axios({
          url: item.url,
          method: 'get',
        })
        // 判断http请求是否成功
        if (res.status === 200) {
          result.push({
            name: item.name,
            // data: res,
            message: `${moment(new Date()).format(
              'YYYY-MM-DD HH:mm:ss'
            )} 唤醒成功`,
            success: true,
          })
        } else {
          result.push({
            name: item.name,
            error: res.status,
            message: `${moment(new Date()).format(
              'YYYY-MM-DD HH:mm:ss'
            )} 请求出错`,
            success: false,
          })
        }
      } catch (error) {
        // 请求失败
        result.push({
          name: item.name,
          // data: res,
          message: `${moment(new Date()).format(
            'YYYY-MM-DD HH:mm:ss'
          )} 请求失败`,
          error: error.message,
          success: false,
        })
      }
    }
    // 推送
    let resultStr = ``
    for (const item of result) {
      resultStr += `${item.name}\n`
      resultStr += `${item.message}\n`
      if (!item.success) {
        resultStr += `${item.error}\n`
      }
      resultStr += `-------------\n`
    }
    if (config.isOpenQmsg) {
      qmsg(resultStr)
    }
    log(chalk.blue(resultStr))
  } else {
    log(chalk.red('哥哥你没有配置valines应用啦,到config添加几个💔'))
  }
}

/**
 * @name Qmsg酱推送
 * @param { String } msg 推送信息文本
 */
async function qmsg(msg) {
  try {
    const res = await axios({
      method: 'get',
      url: `https://qmsg.zendee.cn:443/send/${config.qmsgKey}.html`,
      params: {
        msg,
      },
    })
    if (!res.data.success) {
      log(
        chalk.red(
          `Qmsg酱发送失败：${moment(new Date()).format('YYYY-MM-DD HH:mm:ss')}`
        ),
        res.data
      )
    }
  } catch (error) {
    console.log(error.message)
  }
}

// 启动提示
log(
  chalk.bgGreen.black(
    `启动成功>>>：${moment(new Date()).format('YYYY-MM-DD HH:mm:ss')}`
  )
)
