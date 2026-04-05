/**
 *
 * @param {number} 
 * @param {number} 
 * @returns {object} 
 */
export function generateUser(vu, iter) {
  const uid = `${vu}_${iter}_${Date.now()}`;
  return {
    name: `usuario_${uid}`,
    email: `user_${uid}@test.com`,
    password: 'Test@12345',
    title: 'Mr',
    birth_date: '15',
    birth_month: '6',
    birth_year: '1995',
    firstname: 'Test',
    lastname: 'User',
    company: 'SofkaU',
    address1: 'Calle 123',
    address2: 'Apt 456',
    country: 'Canada',
    zipcode: '12345',
    state: 'Ontario',
    city: 'Toronto',
    mobile_number: '3001234567',
  };
}
