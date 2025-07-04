export class ApiError extends Error {
  constructor(message, url) {
      super(message)
      this.message = message || ''
      this.name = 'ApiError'
      this.url = url || ''
  }
}
export class ApiTimeoutError extends ApiError {
  constructor(url) {
      super('请求超时', url)
      this.name = 'ApiTimeoutError'
  }
}
export class ApiServerError extends ApiError {
  constructor(statusCode, url) {
      super(`请求服务器出错：${statusCode}`, url)
      this.name = 'ApiServerError'
      this.code = statusCode
  }
}
export class ApiAuthError extends ApiError {
  constructor(url) {
      super('登录已过期', url)
      this.name = 'ApiAuthError'
  }
}
export class ApiRoleError extends ApiError {
  constructor(url) {
      super('当前用户无权访问', url)
      this.name = 'ApiRoleError'
  }
}
export class ApiBusinessError extends ApiError {
  constructor(message, code, url, data) {
      super(message, url)
      this.name = 'ApiBusinessError'
      this.code = code
      this.data = data
  }
}
