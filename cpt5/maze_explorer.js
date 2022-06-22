const exploring_color = '#1439d0'
const result_color = '#3eb261'

async function commonDfs(ctx, maze, startDot, targetDot) {
  let exploredDots = []
  let delay = 0.001 // s
  for (let r = 0; r < maze.dots.length; r++) {
    exploredDots.push([])
    for (let c = 0; c < maze.dots[r].length; c++) {
      exploredDots[r].push(false)
    }
  }
  let directions = [[-1, 0], [1, 0], [0, -1], [0, 1]]
  let path = []
  const dfs = async (currDot) => {
    if (currDot.compare(targetDot)) {
      return true
    }
    for (let di = 0; di < directions.length; di++) {
      let nextR = currDot.r + directions[di][0]
      let nextC = currDot.c + directions[di][1]
      if (maze.canGo(nextR, nextC) && !exploredDots[nextR][nextC]) {
        exploredDots[nextR][nextC] = true
        let nextDot = maze.dots[nextR][nextC]
        await nextDot.draw(ctx, delay, t_dot_exploring)
        if (await dfs(nextDot)) {
          path.push(nextDot)
          return true
        }
        // await nextDot.draw(ctx, delay, t_dot_path)
      }
    }
  }
  exploredDots[startDot.r][startDot.c] = true
  await startDot.draw(ctx, delay, t_dot_exploring)
  if (!await dfs(startDot)) {
    console.log('无可用路径')
    return
  }
  path.push(startDot)
  ctx.fillStyle = result_color
  for (let i = path.length - 1; i >= 0; i--) {
    await path[i].draw(ctx, 0.01, t_dot_result)
  }
}

async function commonBfs(ctx, maze, startDot, targetDot) {
  let prevDots = []
  for (let r = 0; r < maze.dots.length; r++) {
    prevDots.push([])
    for (let c = 0; c < maze.dots[r].length; c++) {
      prevDots[r].push(undefined)
    }
  }
  let exploredDots = []
  let delay = 0.000001 // s
  for (let r = 0; r < maze.dots.length; r++) {
    exploredDots.push([])
    for (let c = 0; c < maze.dots[r].length; c++) {
      exploredDots[r].push(false)
    }
  }
  let directions = [[-1, 0], [1, 0], [0, -1], [0, 1]]
  let nextDots = [startDot]
  let headDot = new Dot()
  exploredDots[startDot.r][startDot.c] = true
  prevDots[startDot.r][startDot.c] = headDot
  await startDot.draw(ctx, delay, t_dot_exploring)
  let flag = false;
  while (nextDots.length > 0) {
    let currDot = nextDots.shift()
    if (currDot.compare(targetDot)) {
      flag = true
      break
    }
    for (let di = 0; di < directions.length; di++) {
      let nextR = currDot.r + directions[di][0]
      let nextC = currDot.c + directions[di][1]
      if (maze.canGo(nextR, nextC) && !exploredDots[nextR][nextC]) {
        exploredDots[nextR][nextC] = true
        prevDots[nextR][nextC] = currDot
        let nextDot = maze.dots[nextR][nextC]
        nextDots.push(nextDot)
        await nextDot.draw(ctx, delay, t_dot_exploring)
      }
    }
  }
  if (!flag) {
    console.log('无可用路径')
    return
  }
  let pn = targetDot
  let path = [targetDot]
  for (; ;) {
    pn = prevDots[pn.r][pn.c]
    if (pn === headDot) {
      break
    }
    path.push(pn)
  }

  for (let i = path.length - 1; i >= 0; i--) {
    await path[i].draw(ctx, 0.01, t_dot_result)
  }
}
