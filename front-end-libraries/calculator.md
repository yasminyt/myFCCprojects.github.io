### 通过JavaScript实现一个简易计算器的总结

#### 特性概述
> - 支持四则运算
> - 支持混合运算
> - 支持浮点数运算
> - 在完成一次运算后，支持直接使用该次运算的结果来开始新一轮的运算
> - 在完成一次运算后，支持点击数字重新开始新的运算

#### 页面实现

1. 计算器在页面上的居中显示
```css
body {
  height: 100vh;
  margin: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
```
 - 实现居中显示的效果有很多，这里通过设置 `display: flex;` 来实现
 - 该效果需要设置 `flex container` 的 `height` 属性，若是不设置该属性，则 `align-items` 属性不会起作用，也就是说只是实现了水平居中，而垂直方向上并不居中
 -  `height: 100vh;` 这里使用了 `vh` 单位，则保证了父窗与视窗的高度相同，这里需要通过 `margin: 0;` 去掉 `body` 自带的 `margin` 属性，否则会出现滚动条


#### 逻辑实现
- 计算器的计算逻辑有立即计算和公式计算两种，本页面实现的计算器采用的是**公式计算逻辑**
- 针对用户可能有的各种异常输入的情况均进行了相应的处理
##### 运算逻辑实现
- 在实现混合运算的过程中，主要参考了**双栈求值**算法
- 但在真正实现的过程中，则是略做了改动：先做乘除法，将乘除运算的结果推入到 `data` 栈中，`operation` 栈中实际只存放了加减操作，最后将 `data` 栈中的数据与 `operation` 栈中的操作符按照顺序进行计算，得到结果

##### 异常输入处理
目前所处理的所有异常输入包括了以下几种情况：
- **重复点击 ' 0 '开头**  
> *Handle：*  忽略掉紧接着点击的若干个 ' 0 '  
```javascript
if (!((prevData === '0') && (clickValue === '0'))) { }
/** prevData 用于暂存用户输入的数字 **/
```

- **点击 ' 0 ' 之后点击的是非0的数**
> *Handle：用非0的数来替换掉先前输入的0*  
```javascript
if ((prevData === '0') && /[1-9]/.test(clickValue))  /** 判断数据暂存区中是否只有0，并且用户再次点击的是非0的数字 **/   
  values.pop()  /** 这里只需要对显示进行处理，因为数字前即便有无效的0也不影响计算 **/
```

- **连续点击运算符**
> *Handle：*  以最后点击的运算符来进行运算
```javascript
const handleAbnormal = (cases, clickValue) => {
  ...
    case abnormal.ContinuousOperation:
      const stringTmp = values.join('')
      /** 判断当前已输入的表达式中是否最后的是运算符，以及再次点击的是否为运算符 **/
      if ((/[\+\-×÷]$/.test(stringTmp)) && (/[\+\-×÷]/.test(clickValue))) {
        values.pop()
        if (tmp.length) {   /** 处理上一个输入的运算符为乘除的情况 **/
          prevData = tmp[0]
          tmp = []
        } else {            /** 处理上一个输入的运算符为加减的情况 **/
          operation.pop()
          prevData = data.pop()
        }
      }
      break
  ...
}
```

- **点击运算符后，直接点击 =**
> *Handle：忽略最后一个运算符*  
```javascript
const handleAbnormal = (cases, clickValue) => {
  ...
    case abnormal.IgnoreOperation:
      const ingore = values.splice(values.length - 2, 1)
      if (/×|÷/.test(ingore)) {   /** 同样需要对最后输入的运算符是乘除还是加减分别进行处理 **/
        data.push(tmp[0])
        tmp = []
      } else
        operation.pop()
      break
  ...
}
```

- **输入了一个数之后直接点击 =**
> *Handle：无须进行计算，直接将输入的数作为结果输出*  

- **用上一次运算的结果来直接进行新一轮的运算**
> *Handle：对上一次运算的结果进行保存，判断用户点击的是否是运算符，若是则将该结果作为新一轮运算的操作数*  
- **完成一次运算后，点击数字可以开始新一轮的运算**
> *Handle：当完成一次运算后，判断用户点击的是否是数字*  
```javascript
  ...
  if (result) {        
    if (/\D/.test(clickValue)) {  /** 判断点击的是否是运算符 **/
      prevData = result
      values.push(prevData)
    } 
    result = false  /** 清空result的值，开始新一轮的运算 **/
  }
  ...
```

- **没有输入数字，直接点击运算符**
> *Handle：将默认值0补上，作为一侧的操作数*  
- **没有输入数字，直接点击点号.**
> *Handle：将默认值0补上，作为小数的整数部分*
```javascript
/** 使用正则表达式判断用户是否一开始输入的是 +/-/×/÷**/
if (/[+×÷]|\-(?!\d)/.test(values[0]))
  handleAbnormal(abnormal.AddZero)

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
    ...
  }
}
```  

- **点号. 或等号= 的连续点击**
> *Handle：判断暂存数中是否已有小数点，若有则拒绝再次输入，否则接受一次输入；判断 `result` 值是否为真，若为真，则对连续点击的等号不作处理*  
```javascript
/** 若点击的是小数点，则判断暂存数中是否已经有小数点 **/
if (!((/\./.test(prevData)) && (clickValue === '.'))) { }
```

- **被除数不能为0**
> *Handle：判断运算结果是否为 `NaN` 或 `Infinity`*  

#### 总体收获
- 加深了对居中布局的理解
- 在该 application 中，使用了大量的正则表达式，不管是对于判断还是对于字符串的处理上都有极高的编程效率，尤其是对多种情况的判断，使用正则表达式使得代码非常的clean
- 第一次将“双栈算法”用到实际中，通过自身的理解去对算法的实际应用进行了一点改进，虽然不能说这个改进是好的，但是确实能够使整个程序逻辑易懂且紧凑
