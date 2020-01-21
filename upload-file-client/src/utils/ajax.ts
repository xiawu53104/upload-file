interface UploadRequestOptions {
  url: string;
  method: string;
  data?: any;
  headers?: {
    [propName: string]: string
  };
}

export default function ({url, method, data, headers = {}}: UploadRequestOptions) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    if (method.toLowerCase() === 'get' && data) {
      url += '?';
      Object.keys(data).forEach(key => {
        url += key + '=' + data[key];
      })
    };
    xhr.open(method, url, true);
    Object.keys(headers).forEach(key => {
      xhr.setRequestHeader(key, headers[key]);
    });
    if (method.toLowerCase() === 'post') {
      xhr.send(data);
    }
    xhr.onreadystatechange = function () {
      if (xhr.status === 200 && xhr.readyState === 4) {
        resolve(JSON.parse(xhr.responseText));
      } else {
        // reject(xhr.response);
      }
    }
  });
}
