const axios = require('axios');

async function debugAPI() {
  console.log('=== Testing Netflix Clone API ===');
  
  try {
    // Test 1: Basic API health check
    console.log('\n1. Testing API health...');
    const healthResponse = await axios.get('https://netflix-project-two-pi.vercel.app/api/');
    console.log('✅ Health check:', healthResponse.data);
    
    // Test 2: Test registration
    console.log('\n2. Testing registration...');
    const registerResponse = await axios.post('https://netflix-project-two-pi.vercel.app/api/auth/register', {
      email: 'test@example.com',
      password: 'Password123'
    });
    console.log('✅ Registration:', registerResponse.data);
    
    // Test 3: Test login
    console.log('\n3. Testing login...');
    const loginResponse = await axios.post('https://netflix-project-two-pi.vercel.app/api/auth/login', {
      email: 'test@example.com',
      password: 'Password123'
    });
    console.log('✅ Login:', loginResponse.data);
    
    // Test 4: Test movie search
    if (loginResponse.data.token) {
      console.log('\n4. Testing movie search...');
      const searchResponse = await axios.get('https://netflix-project-two-pi.vercel.app/api/movies/search?search=avengers', {
        headers: {
          'Authorization': `Bearer ${loginResponse.data.token}`
        }
      });
      console.log('✅ Movie search:', searchResponse.data);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.response) {
      console.error('❌ Response:', error.response.data);
      console.error('❌ Status:', error.response.status);
    }
  }
}

debugAPI();
