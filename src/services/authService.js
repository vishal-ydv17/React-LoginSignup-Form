import axios from 'axios';

const api = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
});

const authService = {
  signup: async (userData) => {
    try {
      console.log('Sending signup request with data:', userData);
      const response = await api.post('/api/auth/signup', userData);
      console.log('Signup response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Full error object:', error);
      
      if (error.response) {
        const responseData = error.response.data;
        
        if (responseData.password) {
          throw {
            code: 'PASSWORD_VALIDATION_ERROR',
            message: responseData.password
          };
        }

        if (responseData.errorCode) {
          switch(responseData.errorCode) {
            case 'USERNAME_EXISTS':
              throw { code: responseData.errorCode, message: 'Username is already taken' };
            case 'EMAIL_EXISTS':
              throw { code: responseData.errorCode, message: 'Email is already registered' };
            default:
              throw { 
                code: responseData.errorCode, 
                message: responseData.errorMessage || 'An error occurred during signup' 
              };
          }
        }

        throw { 
          code: 'SERVER_ERROR', 
          message: responseData.message || 'An error occurred during signup' 
        };
      }
      
      throw { 
        code: 'NETWORK_ERROR', 
        message: 'Unable to connect to the server. Please try again.' 
      };
    }
  },
};

export default authService;