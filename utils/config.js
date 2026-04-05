
export const BASE_URL = 'https://automationexercise.com/api';


export const REQUEST_TIMEOUT = '10s';


export const THRESHOLDS = {
  http_req_duration: ['p(95)<1000'],  
  checks: ['rate>0.95'],              
};


export const LOAD_STAGES = [
  { duration: '10s', target: 5 },   
  { duration: '20s', target: 10 },  
  { duration: '30s', target: 10 },  
  { duration: '10s', target: 0 },  
];


export const HTTP_PARAMS = {
  timeout: REQUEST_TIMEOUT,
};
