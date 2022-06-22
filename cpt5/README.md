广度优先遍历和深度优先遍历的通用逻辑

```js
q.add(入口)
while(!q.empty()) {
  curPos = q.remove()
  if (currPos === 出口) break
  全部方向.forEach((方向) => {
    if (方向可达) {
      q.add(newPos)
    }
  })
}
```
