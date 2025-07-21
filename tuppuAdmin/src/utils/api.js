import axios from 'axios'
import { ElMessage } from 'element-plus'

// 创建axios实例
const api = axios.create({
  baseURL: import.meta.env.DEV ? '/api/v1' : 'https://a2.payezgo.com/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'accept': '*/*'
  }
})

// 请求拦截器 - 自动添加token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器 - 处理通用错误
api.interceptors.response.use(
  (response) => {
    // HTTP状态码为200时，检查业务状态码
    if (response.status === 200) {
      const { code, message } = response.data
      
      if (code === 200) {
        // 业务成功，直接返回
        return response.data.data || {}
      } else if (code === 401) {
        // 需要重新登录
        ElMessage.error(message || '登录已过期，请重新登录')
        localStorage.removeItem('isLoggedIn')
        localStorage.removeItem('currentUser')
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('expiresIn')
        window.location.href = '/login'
        return Promise.reject(new Error(message || '登录已过期'))
      } else {
        // 其他业务错误，弹出提示
        ElMessage.error(message || '操作失败')
        return Promise.reject(new Error(message || '操作失败'))
      }
    }
    
    return response.data.data || {}
  },
  (error) => {
    // HTTP状态码不是200，表示服务宕机
    if (error.response) {
      switch (error.response.status) {
        case 500:
          ElMessage.error('服务器内部错误，请稍后重试')
          break
        case 502:
        case 503:
        case 504:
          ElMessage.error('服务暂时不可用，请稍后重试')
          break
        default:
          ElMessage.error('服务连接失败，请检查网络或稍后重试')
      }
    } else if (error.request) {
      ElMessage.error('网络连接失败，请检查网络设置')
    } else {
      ElMessage.error('请求处理失败')
    }
    return Promise.reject(error)
  }
)

// API方法
export const authAPI = {
  // 登录
  login: (username, password) => {
    return api.post('/auth/login', {
      username,
      password
    })
  },
  
  // 刷新token（如果需要的话）
  refreshToken: (refreshToken) => {
    return api.post('/auth/refresh', {
      refreshToken
    })
  },
}

// 提现管理API
export const withdrawAPI = {
  // 获取提现申请列表
  getWithdrawList: (params) => {
    return api.get('/withdraw/list', { params })
  },

  // 获取签名消息
  getRawSignMessage: (params) => {
    return api.get('/withdraw/sign-message', { params })
  },

  // 审核提现申请
  approveWithdraw: (params) => {
    return api.put(`/withdraw/approve`, params)
  },
  
  // 拒绝提现申请
  rejectWithdraw: (id, data) => {
    return api.put(`/withdraw/reject`, data)
  },
  
  // 获取提现详情
  getWithdrawDetail: (id) => {
    return api.get(`/withdraw/${id}`)
  }
}

export const userAPI = {
  // 获取用户列表
  getUserList: (params) => {
    return api.get('/member/list', { params })
  },
  fetchUserLower: (id) => {
    return api.get(`/member/child/${id}`)
  },
  setUserTag: (data) => {
    return api.post('/member/tags', data)
  },
  deleteUserTag: (params) => {
    return api.delete(`/member/tags/${params.memberId}`, { params })
  },
  fetchUserTag: (memberId) => {
    return api.get(`/member/tags/${memberId}`)
  },
  getRawSignMessage: (params) => {
    return api.get(`/wallet/adjust-sign-message`,{ params })
  },
  sureTransfer: (data) => {
    return api.put(`/wallet/adjust-confirm`, data)
  },
}

export const tagAPI = {
  // 获取流水列表
  getTagList: (params) => {
    return api.get('/tag/list', { params })
  },
  createTag: (params) => {
    return api.post('/tag/create', params)
  },
  modifyTag: (params) => {
    return api.put('/tag/update', params)
  },
}
export const walletAPI = {
  // 获取流水列表
  getRecordList: (params) => {
    return api.get('/wallet/transactions', { params })
  },
}

export const nodeAPI = {
  // 获取节点列表
  getNodeList: (params) => {
    return api.get('/node/nodes', { params })
  },
  // 更新节点
  modifyNode: (data) => {
    return api.put('/node/nodes', data)
  },
}

export default api 