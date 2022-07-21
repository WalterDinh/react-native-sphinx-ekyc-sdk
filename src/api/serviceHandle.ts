import { create } from 'apisauce';
import serviceUrls from './serviceUrl';

const BASE_URL='http://api.sphinxjsc.com:3000/api/v1/';
const api = create({
  baseURL: BASE_URL,
  timeout: 120000,
  withCredentials: false,
  headers: {
    'Content-type': 'application/json',
  },
});

/**
 * process return data
 * @param {*} response
 */
const returnData = (response: any) => {
  console.log('returnData', response);
  let errorMessage = '';
  if (serviceUrls.statusCode.success.includes(response.status)) {
    return {
      response: response.data,
      error: false,
    };
  }
  if (serviceUrls.statusCode.auth.includes(response.status)) {
    errorMessage = 'Invalid token';
  } else if (response.data===null) {
    errorMessage = response.problem;
  } else if (serviceUrls.statusCode.notFound.includes(response.status)) {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    errorMessage = `${response.data.message ? response.data.message : response.data}`;
  } else if (serviceUrls.statusCode.error.includes(response.status)) {
    errorMessage = response.problem;
  } else {
    errorMessage = response.data.problem;
  }

  return {
    errorMessage,
    detail: response.data?.error?.details,
    error: true,
    code: response?.status,
    errorCode: response.data?.error && response.data?.error?.code ? response.data?.error?.code : null,
  };
};

/**
 * set token for authentication
 * @param {*} token
 */
const setToken = (token: string) => {
  api.setHeader('ekyc_token', token);
};

/**
 *
 * @param {*url without host} url
 * @param {*param} params
 */
const apiGet = async (url: string, params: any) => {
  const dataResponse = await api.get(url, params);
  return returnData(dataResponse);
};

/**
 *
 * @param {*url without host} url
 * @param {*} body
 */
const apiPost = async (url: string, body: any) => {
  const dataResponse = await api.post(url, JSON.stringify(body));
  return returnData(dataResponse);
};

/**
 *
 * @param {*url without host} url
 * @param {*} body
 */
const apiPut = async (url: string, body: any) => {
  const dataResponse = await api.put(url, body);
  // logic handle dataResponse here
  return returnData(dataResponse);
};

/**
 *
 * @param {*url without host} url
 * @param {*} body
 */
const apiPatch = async (url: string, body: any) => {
  const response = await api.patch(url, body);
  return returnData(response);
};

/**
 *
 * @param {*url without host} url
 * @param {*} body
 */
const apiDelete = async (url: string, body: any) => {
  const response = await api.delete(url, body);
  return returnData(response);
};

const apiPostFormData = async (url: string, body: any) => {
  const response = await api.post(url, body, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return returnData(response);
};

const apiPutFormData = async (url: string, body: any) => {
  const response = await api.put(url, body, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return returnData(response);
};

const apiShowDownload = async (url: string, body: any) => {
  const response = await api.get(url, body, {
    responseType: 'blob',
  });
  return returnData(response);
};

export {
  apiGet,
  apiPost,
  setToken,
  apiPut,
  apiPatch,
  apiDelete,
  apiPostFormData,
  apiPutFormData,
  apiShowDownload,
};
