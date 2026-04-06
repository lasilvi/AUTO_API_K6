
export const BASE_URL = 'https://automationexercise.com/api';


export const REQUEST_TIMEOUT = '10s';


export const THRESHOLDS = {
  http_req_duration: ['p(95)<1000'],
  http_req_failed: ['rate<0.01'],
  checks: ['rate>0.95'],
  crud_create_errors: ['count<5'],
  crud_get_errors: ['count<5'],
  crud_update_errors: ['count<5'],
  crud_delete_errors: ['count<5'],
  'http_req_duration{operation:create}': ['p(95)<1200'],
  'http_req_duration{operation:get}':    ['p(95)<800'],
  'http_req_duration{operation:update}': ['p(95)<1000'],
  'http_req_duration{operation:delete}': ['p(95)<1000'],
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
