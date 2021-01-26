//主要是缓存内容
const CACHE_NAME = 'cache_v2'

self.addEventListener('install',async event => {
  console.log('install',event)

  //开启一个cache
  const cache = await caches.open(CACHE_NAME)
  //cache对象就可以存储的资源
  //等待cache把所有资源存储起来
  //缓存应该存'./'因为这个会默认寻找index.html,不然的话一直请求的./ 而缓存名字里是./index.html会找不到
  //除非url也输入xxx/index.html这样的话也能找到
  await cache.addAll([
    './',
    './imgs/logo.jpg',
    './manifest.json',
    './index.css'
  ])
  console.log('install');
  await self.skipWaiting()
})

//主要是清除旧的缓存
self.addEventListener('activate',async event => {
  console.log('activate');
  //会清除掉旧的资源，获取到所有资源的key
  const keys = await caches.keys()

  keys.forEach(key => {
    if(key !== CACHE_NAME){
      caches.delete(key)
    }
  })
  await self.clients.claim()
})

//请求发送的时候触发
//判断资源是否能够请求成功，如果能够请求成功，就响应成功的结果，如果断网，请求失败了，读取caches缓存

self.addEventListener('fetch',event => {
  // console.log('fetch',event)
  const req = event.request  
  console.log(req);
  //给浏览器响应,接受一个Promise
  event.respondWith(networkFirst(req))

})

//网络优先
async function networkFirst(req){
  try{
    const fresh = await fetch(req)
    return fresh
  }catch(e){
    //去缓存中读取
    const cache = await caches.open(CACHE_NAME)
    const cached = await cache.match(req)
    return cached
  }
}