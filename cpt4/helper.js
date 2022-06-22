function swap(arr, i, j) {
  let tmp = arr[j]
  arr[j] = arr[i]
  arr[i] = tmp
}

function formatArr(arr, maxVal, height) {
  arr.forEach((v, idx) => {
    arr[idx] = v * height / maxVal
  })
}

function randomArr(size, maxVal) {
  let arr = []
  for (let i = 0; i < size; i++) {
    arr.push(Math.floor(Math.random() * maxVal) + 1)
  }
  return arr
}

const sorted_color = '#d4d377'
const index_color = '#0d36b7'
const target_color = '#d42626'
const sorting_color = '#358c54'
const default_color = '#777'

function Drawer(config, ctx, arr) {
  this.config = config
  this.ctx = ctx
  this.arr = arr
  this.drawPlan = {}
}

function Plan(color) {
  this.color = color
}

Drawer.prototype.resetPlan = function() {
  this.drawPlan = {}
  this.arr.forEach((v, idx) => { this.drawPlan[idx] = new Plan(this.config.defaultColor) })
  return this
}

Drawer.prototype.withColor = function(color, ...idxs) {
  idxs.forEach((v) => { this.drawPlan[v].color = color })
  return this
}

Drawer.prototype.withColorRange = function (color, lidx, ridx) {
  for (let i = lidx; i <= ridx; i ++) {
    this.drawPlan[i].color = color
  }
  return this
}

Drawer.prototype.draw = function () {
  const drawFn = () => {
    const rect_width = this.config.width / this.arr.length
    this.ctx.clearRect(0, 0, this.config.width, this.config.height)
    this.arr.forEach((val, idx) => {
      this.ctx.fillStyle = this.drawPlan[idx].color
      this.ctx.fillRect(idx * rect_width + 1, this.config.height - val, rect_width - 1, val)
    })
  }
  return new Promise((resolve) => {
    setTimeout(() => {
      drawFn()
      resolve()
    }, this.config.sleepTime * 1000)
  })
}

// function initDrawer(config, ctx, arr) {
//   const draw = function (highlightIdxs, arr) {
//     const rect_width = config.width / arr.length
//     ctx.clearRect(0, 0, config.width, config.height)
//     arr.forEach((val, idx) => {
//       if (highlightIdxs[idx]) {
//         ctx.fillStyle = config.unhighlightColor
//       } else {
//         ctx.fillStyle = config.highlightColor
//       }
//       ctx.fillRect(idx * rect_width + 1, config.height - val, rect_width - 1, val)
//     })
//   }
//   return function (...idxs) {
//     const highlightIdxs = {}
//     idxs.forEach((val) => {
//       highlightIdxs[val] = 1
//     })
//     return new Promise(resolve => {
//       setTimeout(() => {
//         // TODO:  window.requestAnimationFrame 中的匿名函数无法跟外部同步
//         const arraySnapshot = Array.from(arr)
//         window.requestAnimationFrame(() => draw(highlightIdxs, arraySnapshot))
//         resolve()
//       }, config.sleepTime * 1000)
//     })
//   }
// }
