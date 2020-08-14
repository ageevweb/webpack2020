// console.log('babel')

async function start(){
  await Promise.resolve('async is working')
}
start().then(console.log)

class Util {
  static id = Date.now()
}

console.log('Util ID:', Util.id)

// check eslint
const unused = 55
console.log(unused)


// lodash
import('lodash').then(_ => {
  console.log('lodash', _.random(0, 42, true))
})