import axios from 'axios'

const instance = axios.create({
    baseURL: 'https://burger-builder-react-8933b.firebaseio.com/'
})

export default instance;