// 对uni.request二次封装
const baseUrl = "http://119.23.127.239:3333";
export const request = {
	post: function({api, methods, params, header = {'content-type':'application/json',
	"X-Access-Token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2MzI0MDA1NDUsInVzZXJuYW1lIjoiYWRtaW4ifQ._Znvj1AK52Fv0AWU7-IRSIUY-ArGv4IGZ5K3Ez-Jx5w"}}) {
		return new Promise((resolve, reject) => {
			let defaultParams = {
				// qq: 由于是使用的别人的接口 此处不公开展示
			}
			let data = Object.assign(defaultParams,params)
			let url = baseUrl + api;
			let method = methods||'GET'
			uni.request({
				url,
				data,
				method,
				header,
				success: (res) => {
					if(res.statusCode === 200) {
						resolve(res.data)
					} else {
						reject(res.errMsg)
					}
				}
			})
		})
	}
}
