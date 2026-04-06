import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { Counter } from 'k6/metrics';
import { BASE_URL, THRESHOLDS, LOAD_STAGES, HTTP_PARAMS } from '../utils/config.js';
import { generateUser } from '../data/userData.js';


const createErrors = new Counter('crud_create_errors');
const getErrors    = new Counter('crud_get_errors');
const updateErrors = new Counter('crud_update_errors');
const deleteErrors = new Counter('crud_delete_errors');


export const options = {
  stages: LOAD_STAGES,
  thresholds: THRESHOLDS,
};


/**
 * @returns {object|null} 
 */
function safeParseJSON(response) {
  try {
    return JSON.parse(response.body);
  } catch (_) {
    return null;
  }
}


function logError(step, response, email) {
  console.error(
    `[${step}] FAIL | email=${email} | status=${response.status} | body=${response.body}`
  );
}


function createUser(user) {
  const res = http.post(`${BASE_URL}/createAccount`, user, Object.assign(
    { tags: { operation: 'create' } }, HTTP_PARAMS
  ));

  const ok = check(res, {
    'CREATE - status 200': (r) => r.status === 200,
    'CREATE - responseCode 201 o 200': (r) => {
      const body = safeParseJSON(r);
      return body !== null && (body.responseCode === 201 || body.responseCode === 200);
    },
  });

  if (!ok) {
    createErrors.add(1);
    logError('CREATE', res, user.email);
  }

  return ok;
}

function getUser(email) {
  const res = http.get(
    `${BASE_URL}/getUserDetailByEmail?email=${encodeURIComponent(email)}`,
    Object.assign({ tags: { operation: 'get' } }, HTTP_PARAMS)
  );

  const ok = check(res, {
    'GET - status 200': (r) => r.status === 200,
    'GET - responseCode 200': (r) => {
      const body = safeParseJSON(r);
      return body !== null && body.responseCode === 200;
    },
    'GET - contiene datos de usuario': (r) => {
      const body = safeParseJSON(r);
      return body !== null && body.user !== undefined;
    },
  });

  if (!ok) {
    getErrors.add(1);
    logError('GET', res, email);
  }

  return ok;
}

function updateUser(user) {
  const payload = Object.assign({}, user, {
    firstname: 'Updated',
    lastname: 'UserMod',
    company: 'SofkaU Updated',
  });

  const res = http.put(`${BASE_URL}/updateAccount`, payload, Object.assign(
    { tags: { operation: 'update' } }, HTTP_PARAMS
  ));

  const ok = check(res, {
    'UPDATE - status 200': (r) => r.status === 200,
    'UPDATE - responseCode 200': (r) => {
      const body = safeParseJSON(r);
      return body !== null && body.responseCode === 200;
    },
  });

  if (!ok) {
    updateErrors.add(1);
    logError('UPDATE', res, user.email);
  }

  return ok;
}

function deleteUser(email, password) {
  const res = http.del(`${BASE_URL}/deleteAccount`, { email, password }, Object.assign(
    { tags: { operation: 'delete' } }, HTTP_PARAMS
  ));

  const ok = check(res, {
    'DELETE - status 200': (r) => r.status === 200,
    'DELETE - responseCode 200': (r) => {
      const body = safeParseJSON(r);
      return body !== null && body.responseCode === 200;
    },
  });

  if (!ok) {
    deleteErrors.add(1);
    logError('DELETE', res, email);
  }

  return ok;
}


export default function () {
  const user = generateUser(__VU, __ITER);
  console.log(`[VU ${__VU} | iter ${__ITER}] email=${user.email}`);

  let created = false;

  group('Create', function () {
    created = createUser(user);
    sleep(1);
  });

  if (!created) {
    console.warn(`[VU ${__VU}] CREATE falló, saltando GET/UPDATE/DELETE`);
    return;
  }

  group('Read', function () {
    getUser(user.email);
    sleep(1);
  });

  group('Update', function () {
    updateUser(user);
    sleep(1);
  });

  group('Delete', function () {
    deleteUser(user.email, user.password);
    sleep(1);
  });
}
