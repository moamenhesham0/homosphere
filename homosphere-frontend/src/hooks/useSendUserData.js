import axios from 'axios';

const useSendUserData = () => {

  const sendUserData = async (email, firstName, lastName, role) => {

    try {
      const response = await axios.post('http://localhost:8080/api/users/create', {
        email,
        firstName,
        lastName,
        role
      });

      return response.data;
    } catch (err) {
      console.error('Error sending user data:', err);
      throw err;
    } 
  };

  return  sendUserData ;
};

export default useSendUserData;
