import request from '@/utils/request'
// 获取表单
export const getQuery = (params) => {
  return request({
    url: '/reports/query',
    method: 'get',
		params
  })
}

// 获取表单详情
export const getDetail = (id) => {
  return request({
    url: `reports/${id}/detail`,
    method: 'get',
  })
}

// 更新某个字段
export const patchDetail = (id,data) => {
  return request({
    url: `reports/${id}`,
    method: 'patch',
		data
  })
}
// 更新某个字段（无token）
export const patchNoDetail = (id,data) => {
  return request({
    url: `unauth/reports/${id}`,
    method: 'patch',
		data
  })
}
// 取消收藏
export const deleteFavorites = (id) => {
  return request({
    url: `favorites/report/${id}`,
    method: 'delete'
  })
}

// 添加收藏
export const putFavorites = (id) => {
  return request({
    url: `favorites/report/${id}`,
    method: 'put'
  })
}

// 获取收藏
export const getFavorites = () => {
  return request({
    url: `favorites/report`,
    method: 'get'
  })
}

  // 保存项目
	export const saveReport = (formId, data) => {
		return request({
			url: `forms/${formId}/reports3`,
			method: 'post',
			data: data
		})
	}
  // 提交项目
	export const submitReport = (id) => {
		return request({
			url: `reports/${id}/submit`,
			method: 'put'
		})
	}
	
  // 更新项目
	export const uploadReport = (id, data) => {
		return request({
			url: `/reports/${id}/update3`,
			method: 'put',
			data:data
		})
	}
	// 撤回项目
	export const recall = (id, data) => {
		return request({
			url: `/reports/${id}/recall`,
			method: 'put'
		})
	}