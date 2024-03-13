let timer = null
export default function debounce(fn, time, arg) {
  let first = !timer

  if (timer){
    clearTimeout(timer)
  }

  timer = setTimeout(() => {
    timer = null
  }, time);

  if (first) {
    fn(arg)
  } 

}