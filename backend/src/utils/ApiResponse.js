class ApiResponse {
  static success(data, message = 'success', code = 'SUCCESS', params = {}) {
    return {
      success: true,
      code,
      message,
      params,
      data,
      timestamp: new Date().toISOString(),
    };
  }

  static error(code, message, params = {}, path = '') {
    return {
      success: false,
      code,
      message,
      params,
      timestamp: new Date().toISOString(),
      path,
    };
  }
}

module.exports = ApiResponse;
