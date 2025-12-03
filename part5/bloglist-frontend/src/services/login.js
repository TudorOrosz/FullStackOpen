import axios from 'axios'
const baseUrl = '/api/login'

const login = async (credentials) => {
  try {
    const response = await axios.post(baseUrl, credentials)
    return response.data
  } catch (error) {
    console.error('Error in login service:', error)
    throw error  // Important: re-throw so component can catch it
  }
}

export default { login }