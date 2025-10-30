function success(data, message = "success", code = "SUCCESS", params = {}) {
  return {
    success: true,
    message,
    code,
    data,
    ...params,
  };
}

function error(message = "error", code = "ERROR", statusCode = 500, params = {}) {
  return {
    success: false,
    message,
    code,
    statusCode,
    ...params,
  };
}

module.exports = { success, error };
