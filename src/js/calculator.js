let values = [], data = [], operation = [], tmp = []
let prevData = false, result = false, err = false

const abnormal = {
  AddZero: 'No Number but Operation',   //一开始没有按数字而直接点了操作符的情况
  IgnoreOperation: 'Operation and Equal', //按了操作符后直接按等号
  ContinuousOperation: 'Continuous Input Operation', //连续输入了操作符
  DivisorIs0: 'Divisor is 0', //除数为0
}

$(function () {
  $('input[type=button]').click((e) => {
    const clickValue = e.target.value
    if (clickValue === 'AC') {
      result = false
      clear()
      display('', 0)
    }
    else if (err && /\D/.test(clickValue)) 
      return
    else {
      err = false
      if (result) {        // 处理是否使用上一次的结果来继续进行运算的情况
        if (/\D/.test(clickValue)) {
          prevData = result
          values.push(prevData)
        } 
        result = false
      }
      if (!((prevData === '0') && (clickValue === '0'))) {          // 处理连续输入多个0开头的数的情况
        if (!((/\./.test(prevData)) && (clickValue === '.'))) {    // 处理连续输入多个'.'的情况
          if ((prevData === '0') && /[1-9]/.test(clickValue))      // 处理输入了0开头之后输入的是非0的数字的情况
            values.pop()
          handleAbnormal(abnormal.ContinuousOperation, clickValue)
          values.push(clickValue)
          handleInput(clickValue)
        }
      }
    }
  })
})

const handleInput = value => {
  if (/[\d.]/.test(value)) {
    if (!prevData) {
      if (value ==='.')
        handleAbnormal(abnormal.AddZero, '.')
      else
        prevData = value
    }
    else
      prevData += value
  } else {
    prevData = Number(prevData)
    if (value === '=') {
      if (/[\+\-×÷]=/.test(values.join('')))
        handleAbnormal(abnormal.IgnoreOperation)
      if (!result)        // 处理连续点击'='的情况
        calculateAndFormat()
    } else {
      if (/[+×÷]|\-(?!\d)/.test(values[0]))
        handleAbnormal(abnormal.AddZero)
      if ((value === '÷') || (value === '×')) {
        if (tmp.length) {     // 处理连续乘除的情况
          prevCalculate()
          tmp.push(data.pop(), value)
        } else
          tmp.push(prevData, value)
      } else {
        operation.push(value)
        prevCalculate()
      }
    }
    prevData = false
  }

  if (!err)
    display()
}

const calculateAndFormat = () => {
  prevCalculate()
  result = calculate()
  if (Number.isNaN(result) || !Number.isFinite(result))
    handleAbnormal(abnormal.DivisorIs0)
  else {
    if (!Number.isInteger(result)) 
      result = result.toFixed(12).replace(/\.0+$|0+$/, '')
    result = result.toString()
  }
}

const calculate = () => {
  if (!operation.length)
    return data[0]
  let result
  for (let i = 1; i < data.length; i++) {
    switch (operation[i - 1]) {
      case '+':
        if (i === 1) result = data[i - 1] + data[i]
        else result += data[i]
        break
      case '-':
        if (i === 1) result = data[i - 1] - data[i]
        else result -= data[i]
    }
  }
  return result
}

const prevCalculate = () => {
  if (tmp.length === 2) {
    if (tmp[1] === '÷')
      data.push((tmp[0] / prevData))
    else
      data.push((tmp[0] * prevData))
    tmp = []
  } else
    data.push(prevData)
}

const handleAbnormal = (cases, clickValue) => {
  switch(cases) {
    case abnormal.AddZero: 
      if (clickValue === '.') {
        prevData = '0.'
        values.pop()
        values.push(prevData)
      } else {
        prevData = 0
        values = [prevData, ...values]
      }
      break
    case abnormal.IgnoreOperation:
      const ingore = values.splice(values.length - 2, 1)
      if (/×|÷/.test(ingore)) {
        data.push(tmp[0])
        tmp = []
      } else
        operation.pop()
      break
    case abnormal.ContinuousOperation:
      const stringTmp = values.join('')
      if ((/[\+\-×÷]$/.test(stringTmp)) && (/[\+\-×÷]/.test(clickValue))) {
        values.pop()
        if (tmp.length) {
          prevData = tmp[0]
          tmp = []
        } else {
          operation.pop()
          prevData = data.pop()
        }
      }
      break
    case abnormal.DivisorIs0:
      err = true
      values.pop()
      display(values.join(''), 'Divisor Cannot Be 0')
      clear()
  }
}

const clear = () => {
  values = []
  data = []
  operation = []
  tmp = []
  prevData = ''
}

const display = (...args) => {
  let stringValue, inputValue
  if (args.length) {
    stringValue = args[0]
    inputValue = args[1]
  } else {
    stringValue = values.join('')
    inputValue = stringValue.match(/\D$|\d+\.*\d*$/)[0]
    if (result) {
      stringValue += result
      inputValue = result
      clear()
    }
  }
  $('.display').text(stringValue)
  $('.input').text(inputValue)
}
