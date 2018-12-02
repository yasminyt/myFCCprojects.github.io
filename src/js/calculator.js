let values = [], data = [], operation = [], tmp = []
let prevData = '', clickEqual = false 

$(function () {
  $('input[type=button]').click((e) => {
    const clickValue = e.target.value
    if (clickValue === 'AC') {
      clear()
      display('', 0)
    } else {
      if (clickEqual) {    // 已经点击过'='
        prevData = clickEqual
        values.push(prevData)
        clickEqual = false
      }
      if (!((prevData === '0') && (clickValue === '0'))) {
        // todo 不应该在这里处理显示
        values.push(clickValue)
        // let stringValue = values.join('')
        // stringValue = stringValue.replace(/^0+(\d)/, '$1')
        // display(stringValue, clickValue)
        display(values.join(''), clickValue)
        handleInput(clickValue)
      }
      
      console.log('values')
      console.log(values)
    }
  })
})

const handleInput = value => {
  if (/[\d.]/.test(value)) {
    if (prevData === '')
      prevData = value
    else
      prevData += value
  } else {
    prevData = Number(prevData)
    if (value === '=') {
      prevCalculate()
      let result = calculate()
      result = result.toFixed(12).replace(/\.0+|0+$/, '')
      display(`${values.join('')}${result}`, result)
      clear()
      clickEqual = result
    } else {
      if ((value === '÷') || (value === '×'))
        tmp.push(prevData, value)
      else {
        operation.push(value)
        prevCalculate()
      }
    }
    prevData = 0
  }

  console.log('data')
  console.log(data)
  console.log('operation')
  console.log(operation)
}

const calculate = () => {
  if (!operation.length)
    return data[data.length - 1]
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

const clear = () => {
  values = []
  data = []
  operation = []
  tmp = []
  prevData = ''
  clickEqual = false
}

const display = (displayValue, inputValue) => {
  $('.display').text(displayValue)
  $('.input').text(inputValue)
}
