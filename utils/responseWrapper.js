class ResponseWrapper {
  static success(response, message = "success", data = []) {
    return response.status(200).json({
      message: message,
      exception: null,
      detail: null,
      status: "200",
      datas: Array.isArray(data) ? data : [data],
    });
  }

  static created(response, data) {
    if (!response || typeof response.status !== "function") {
      throw new Error("Invalid response object");
    }

    return response.status(201).json({
      message: "success",
      exception: null,
      detail: null,
      status: "201",
      datas: Array.isArray(data) ? data : [data],
    });
  }

  static badRequest(response, message, detail = null) {
    if (!response || typeof response.status !== "function") {
      throw new Error("Invalid response object");
    }

    return response.status(400).json({
      message: message,
      exception: null,
      detail: detail,
      status: "400",
      datas: [],
    });
  }

  static unauthorized(response, message = "Unauthorized access") {
    if (!response || typeof response.status !== "function") {
      throw new Error("Invalid response object");
    }

    return response.status(401).json({
      message: message,
      exception: null,
      detail: null,
      status: "401",
      datas: [],
    });
  }

  static forbidden(response, message = "Forbidden access") {
    if (!response || typeof response.status !== "function") {
      throw new Error("Invalid response object");
    }

    return response.status(403).json({
      message: message,
      exception: null,
      detail: null,
      status: "403",
      datas: [],
    });
  }

  static notFound(response, message = "Not Found") {
    if (!response || typeof response.status !== "function") {
      throw new Error("Invalid response object");
    }

    return response.status(404).json({
      message: message,
      exception: null,
      detail: null,
      status: "404",
      datas: [],
    });
  }

  static internalServerError(response, message) {
    if (!response || typeof response.status !== "function") {
      throw new Error("Invalid response object");
    }

    return response.status(500).json({
      message: message,
      exception: null,
      detail: null,
      status: "500",
      datas: [],
    });
  }
}

module.exports = ResponseWrapper;
