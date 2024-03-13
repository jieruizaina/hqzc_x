import request from '@/utils/request'
// 获取字典
export const getDictionary = (code) => {
  return request({
    url: `dictionaries/${code}`,
    method: 'get'
  })
}
// 查询字典值
export const getDictionaryName = (code, codes) => {
  return request({
    url: `dictionaries/${code}/${codes}`,
    method: 'get'
  })
}

