import axios from 'axios';
import { http } from '../axios/url';
// axios.defaults.baseURL = 'http://bozai.tech/api/'
axios.defaults.baseURL = `${http}/api/`

axios.defaults.withCredentials = true;  // 跨域

// axios 拦截器
axios.interceptors.response.use(response => {
	if (response.status === 200) {
		return response.data;
	}
})

export default axios;