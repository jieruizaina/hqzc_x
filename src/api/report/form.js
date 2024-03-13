import request from '@/utils/request'
// 获取字段
export const getFields = (formId) => {
  return request({
    url: `/forms/${formId}/fields`,
    method: 'get'
  })
}
//传图片
export const getFiless = (params) => {
  return request({
    url: `/files/query`,
    method: 'get',
		params:params
  })
}

