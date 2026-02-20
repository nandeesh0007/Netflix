const axios = require('axios');

async function testDeployment() {
  try {
    console.log('Testing API endpoint...');
    const response = await axios.get('https://netflix-project-two-pi.vercel.app/api/');
    console.log('API Response:', response.data);
    
    console.log('\nTesting registration...');
    const registerResponse = await axios.post('https://netflix-project-two-pi.vercel.app/api/auth/register', {
      email: 'test@example.com',
      password: 'Password123'
    });
    console.log('Registration Response:', registerResponse.data);
    
  } catch (error) {
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
  }
}

testDeployment();
