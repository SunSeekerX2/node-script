/**
 * @name
 * @author SunSeekerX
 * @time 2020-03-19 15:08:24
 * @LastEditors: SunSeekerX
 * @LastEditTime: 2020-05-18 16:46:27
 */

const axios = require('axios')
const schedule = require('node-schedule')
const moment = require('moment')

schedule.scheduleJob('0 30 9 * * *', () => {
  /**
   * 每天9点半执行签到有道赠送空间
   */
  youdao()
})

async function youdao() {
  // server酱开关，填0不开启(默认)，填1只开启cookie失效通知，填2同时开启cookie失效通知和签到成功通知
  const sever = 2
  // 填写server酱sckey,不开启server酱则不用填
  const sckey = 'SCU90208Te5f5f29918f76f254513137ffe2794c85e730c7727aab'
  // 填入有道云笔记账号对应cookie
  const cookie =
    'OUTFOX_SEARCH_USER_ID=-1493422486@119.39.121.53; JSESSIONID=aaaVonBxGeGkE6H92QTdx; Hm_lvt_30b679eb2c90c60ff8679ce4ca562fcc=1584325639,1584602885; __yadk_uid=XoyB596SfQoP4bTyEYC2VuPyPwmHGNKf; _ga=GA1.2.1735636628.1584602887; _gid=GA1.2.835743931.1584602887; OUTFOX_SEARCH_USER_ID_NCOO=2144761281.1555107; YNOTE_SESS=v2|BSqLdMFCvcYGhMeS0Mpu0zW0Lgy6Mw4RkG64OAO4TB0pLhMJy0LQyRPyPMQK6MzA0qFRfT40LOGRJuhHz5O4PLRQZ0MOERHOf0; YNOTE_PERS=v2|cqq||YNOTE||web||7776000000||1584602896804||119.39.121.53||qqE308DD004FA7A6FCD547F9727C66779D||lGRfUGh4Yf06Khfg40LT4Rk5kfQF0Mpz0pShfqy6LzY0gFnfqK0fOA0wFh4pLhflGRqBhLwSOMkY0OMkMUY0LPu0; YNOTE_CSTK=PzMTX5FY; Hm_lpvt_30b679eb2c90c60ff8679ce4ca562fcc=1584603018; YNOTE_USER=1; _gat=1; YNOTE_LOGIN=5||1584603127773'
  // const cookie = ''

  /**
   * 1.每日打开客户端（即登陆）
   * 2.每日打卡签到
   * 3.每日看广告（前三次有奖励）
   */
  let rewardSpace = 0

  try {
    // return
    const openClientRes = await axios.request({
      url: 'https://note.youdao.com/yws/api/daupromotion?method=sync',
      method: 'post', // default
      headers: { Cookie: cookie }
    })
    rewardSpace += openClientRes.data.rewardSpace

    const signRes = await axios.request({
      url: 'https://note.youdao.com/yws/mapi/user?method=checkin',
      method: 'post', // default
      headers: { Cookie: cookie }
    })
    rewardSpace += signRes.data.space

    const seeAdResArr = []
    for (let i = 0; i < 3; i++) {
      const seeAdRes = await axios.request({
        url: 'https://note.youdao.com/yws/mapi/user?method=adRandomPrompt',
        method: 'post', // default
        headers: { Cookie: cookie }
      })
      rewardSpace += seeAdRes.data.space
      seeAdResArr.push(JSON.stringify(seeAdRes.data))
    }

    if (sever === 2) {
      axios.get(`https://sc.ftqq.com/${sckey}.send`, {
        params: {
          text: `我签到成功啦！！！`,
          desp: `有道云笔记签到成功共获得空间:${rewardSpace / 1048576}M`
        }
      })
    }
  } catch (error) {
    // 登陆失败
    if ([1, 2].includes(sever)) {
      axios.get(`https://sc.ftqq.com/${sckey}.send`, {
        params: {
          text: '有道云笔记签到cookie失效请更新',
          desp: error.message
        }
      })
    }
  }
}
console.log(`启动成功>>>：${moment(new Date()).format('YYYY-MM-DD HH:mm:ss')}`)
