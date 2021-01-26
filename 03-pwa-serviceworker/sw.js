self.addEventListener('install',event => {
  console.log('install',event)
  //会让service worker跳过等待，直接进入到activate状态
  //不写的话，修改代码后会install但是不会activate
  //等到skipWaiting这个异步函数结束才结束目前生命周期install,进入active
  event.waitUntil( self.skipWaiting())
})

self.addEventListener('activate',event => {
  console.log('activate',event)
  //表示service worker激活后立即获取控制权
  event.waitUntil(self.clients.claim())
})

//请求发送的时候触发
self.addEventListener('fetch',event => {
  console.log('fetch',event)
})