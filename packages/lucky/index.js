const res = {
  // 我的钱
  myMoney: 1000,
  // 当前下注金额
  curMoney: 1,
  // 总手续费
  rateMoney: 0,
  // 总亏损
  loseMoney: 0,
  // 总盈利
  getMoney: 0,
  // 游戏次数
  gameTimes: 0,
}

// 费率
const rate = 0.01 / 100

while (res.myMoney > res.curMoney * 2) {
  const flag = Boolean(Math.round(Math.random()))
  let result = ''
  if (flag) {
    // 赢了
    const tip = res.curMoney * rate
    const getMoney = res.curMoney - tip
    res.myMoney = res.myMoney + getMoney
    // 增加手续费
    res.rateMoney = res.rateMoney + tip
    // 增加获取金额
    res.getMoney = res.getMoney + getMoney
    // 恢复投注
    res.curMoney = 1
    // 统计
    result = `我赢了${getMoney} 当前金额：${res.myMoney} 赚到的钱：${res.getMoney} 失去的钱：${res.loseMoney} 手续费：${res.rateMoney} 游戏次数：${res.gameTimes}`
  } else {
    // 输了
    const loseMoney = res.curMoney
    // 减少我的钱
    res.myMoney = res.myMoney - loseMoney
    // 减少我赚的钱
    res.getMoney = res.getMoney - loseMoney
    // 增加失去的钱
    res.loseMoney = res.loseMoney + loseMoney
    // 加大投注
    res.curMoney = res.curMoney * 2
    // 统计
    result = `我输了 -${res.curMoney} 当前金额：${res.myMoney} 赚到的钱：${res.getMoney} 失去的钱：${res.loseMoney} 手续费：${res.rateMoney} 游戏次数：${res.gameTimes}`
  }
  res.gameTimes++
  console.log(new Date().getTime(), result)
}

console.table(res)
