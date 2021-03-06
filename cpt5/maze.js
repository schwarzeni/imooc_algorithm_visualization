function Maze() {
  this.width = 0
  this.height = 0
  this.dotWidth = 5
  this.dots = []
  this.rc = -1
  this.cc = -1
}

function newMaze(rawMazeData) {
  let mazeData = rawMazeData.split('\n')
  let maze = new Maze()
  maze.rc = parseInt(mazeData[0].split(' ')[0])
  maze.cc = parseInt(mazeData[0].split(' ')[1])
  for (let r = 0; r < maze.rc; r++) {
    maze.dots.push([])
    for (let c = 0; c < maze.cc; c++) {
      let dot = new Dot(r, c, t_dot_path)
      dot.width = maze.dotWidth
      if (mazeData[r + 1][c] === '#') {
        dot.type = t_dot_wall
      }
      maze.dots[r].push(dot)
    }
  }
  return maze
}

Maze.prototype.draw = function (ctx) {
  ctx.clearRect(0, 0, this.width, this.height)
  for (let r = 0; r < this.rc; r++) {
    for (let c = 0; c < this.cc; c++) {
      let dot = this.dots[r][c]
      dot.width = this.dotWidth
      ctx.fillStyle = dot.type.color
      if (dot.mist) {
        ctx.fillStyle = '#000'
      }
      ctx.fillRect(c * this.dotWidth, r * this.dotWidth, this.dotWidth, this.dotWidth)
    }
  }
}

Maze.prototype.openMist = async function(dot, ctx, delay) {
  dot.mist = false
  for (let rr = dot.r-1; rr <= dot.r+1; rr ++) {
    for (let cc = dot.c-1; cc <= dot.c+1; cc ++) {
      if (rr >= 0 && rr < this.dots.length && cc >= 0 && cc < this.dots[rr].length) {
        if ( this.dots[rr][cc].mist) {
          this.dots[rr][cc].mist = false
        }
        if (ctx) {
          await this.dots[rr][cc].draw(ctx, delay)
        }
      }
    }
  }
}

Maze.prototype.canGo = function (r, c) {
  return r >= 0 && r < this.dots.length && c >= 0 && c < this.dots[r].length && this.dots[r][c].canGo()
}

const t_dot_wall = {color: '#777'}
const t_dot_path = {color: '#fff'}
const t_dot_exploring = {color: '#1439d0'}
const t_dot_result = {color: '#3eb261'}

function Dot(r, c, type, width) {
  this.r = r
  this.c = c
  this.type = type
  this.width = 5
  if (width > 0) {
    this.width = width
  }
  this.mist = false
}

Dot.prototype.canGo = function () {
  return this.type === t_dot_path
}

Dot.prototype.compare = function (dot) {
  return this.r === dot.r && this.c === dot.c
}

Dot.prototype.draw = function (ctx, delay, type) {
  ctx.fillStyle = this.type.color
  if (type) {
    ctx.fillStyle = type.color
  }
  return new Promise((resolve) => {
    setTimeout(() => {
      ctx.fillRect(this.c*this.width, this.r*this.width, this.width, this.width)
      resolve()
    }, delay * 1000)
  })
}
