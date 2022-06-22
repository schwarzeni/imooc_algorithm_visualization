// 生成的迷宫迷宫的边长为奇数
// 起点和终点固定

let delay = 0.00000001 // s

function Queue() {
  this.data = []
}

Queue.prototype.pop = function() {
  return this.data.shift()
}

Queue.prototype.push = function(val) {
  this.data.push(val)
}

Queue.prototype.length = function() {
  return this.data.length
}

function Stack() {
  this.data = []
}

Stack.prototype.pop = function() {
  return this.data.pop()
}

Stack.prototype.push = function(val) {
  this.data.push(val)
}

Stack.prototype.length = function() {
  return this.data.length
}

function RandomQueue() {
  this.data = []
}

RandomQueue.prototype.pop = function() {
  let idx = Math.floor(Math.random()*this.data.length)
  swap(this.data, idx, this.data.length-1)
  return this.data.pop()
}

RandomQueue.prototype.push = function(val) {
  this.data.push(val)
}

RandomQueue.prototype.length = function() {
  return this.data.length
}

function RandomStackQueue() {
  this.data = []
}

RandomStackQueue.prototype.pop = function() {
  if (Math.random() > 0.5) {
    return this.data.pop()
  } else {
    return this.data.shift()
  }
}

RandomStackQueue.prototype.push = function(val) {
  if (Math.random() > 0.5) {
    this.data.push(val)
  } else {
    this.data.unshift(val)
  }
}

RandomStackQueue.prototype.length = function() {
  return this.data.length
}

function preGen(rc, cc, ctx) {
  let maze = new Maze()
  maze.rc = rc
  maze.cc = cc
  for (let r = 0; r < rc; r++) {
    maze.dots.push([])
    for (let c = 0; c < cc; c++) {
      let dot = new Dot(r, c, t_dot_wall)
      dot.mist = true
      if ((r % 2 === 1 && c % 2 === 1)
        || (r === 1 && c === 0) || (r === rc - 2 && c === cc - 1)) {
        dot.type = t_dot_path
      }
      dot.width = maze.dotWidth
      maze.dots[r].push(dot)
    }
  }
  return maze
}

async function mazeGen(maze, ctx, data) {
  let directions = [[-1, 0], [1, 0], [0, 1], [0, -1]]
  let visited = initVisitedMap(maze.rc, maze.cc)
  visited[1][1] = true
  data.push(maze.dots[1][1])
  await maze.openMist(maze.dots[1][1], ctx, delay)
  while (data.length() > 0) {
    let currDot = data.pop()
    shuffleArray(directions)
    for (let i = 0; i < directions.length; i ++) {
      let nextR = currDot.r + directions[i][0]*2
      let nextC = currDot.c + directions[i][1]*2
      if (maze.canGo(nextR, nextC) && !visited[nextR][nextC]) {
        visited[nextR][nextC] = true
        let pathDot = maze.dots[currDot.r + directions[i][0]][currDot.c + directions[i][1]]
        pathDot.type = t_dot_path
        await pathDot.draw(ctx, delay)
        await maze.openMist(maze.dots[nextR][nextC], ctx, delay)
        data.push(maze.dots[nextR][nextC])
      }
    }
  }
  return maze
}

function initVisitedMap(r, c) {
  let visited = []
  for (let rr = 0; rr < r; rr ++) {
    visited.push([])
    for (let cc = 0; cc < c; cc ++) {
      visited[rr].push(false)
    }
  }
  return visited
}

function mazeSerialization(maze) {
  let result = ''
  result += `${maze.rc} ${maze.cc}\n`
  for (let r = 0; r < maze.rc; r++) {
    for (let c = 0; c < maze.cc; c++) {
      if (maze.dots[r][c].type === t_dot_path) {
        result += ' '
      } else {
        result += '#'
      }
    }
    result += '\n'
  }
  return result
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    let temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}

function swap(arr, i, j) {
  let tmp = arr[j]
  arr[j] = arr[i]
  arr[i] = tmp
}
