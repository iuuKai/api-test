/*
 * @Author: iuukai
 * @Date: 2023-01-09 00:51:47
 * @LastEditors: iuukai
 * @LastEditTime: 2023-01-09 05:43:20
 * @FilePath: \api-test\index.js
 * @Description:
 * @QQ/微信: 790331286
 */
const path = require('path')
const express = require('express')

const app = express()
const port = Number(process.env.PORT || '3333')
const host = process.env.HOST || ''
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static('./'))
app.listen(port, host, () =>
	console.log(`server running @ http://${host ? host : 'localhost'}:${port}`)
)

app.use('/api/:type(ajax|jsonp)/:apiModule/:apiFunction?', async (req, res) => {
	try {
		const { type, apiModule, apiFunction } = req.params

		const method = req.method
		const query = Object.assign({}, req.query, req.body, req.files)
		const moduleDef = await require(path.join(__dirname, `${type}/${apiModule}`))
		const moduleResponse = await moduleDef(method, apiFunction, query)

		if (type === 'ajax') {
			res.set({
				'Access-Control-Allow-Credentials': true,
				'Access-Control-Allow-Origin': req.headers.origin || '*',
				'Access-Control-Allow-Headers': 'X-Requested-With,Content-Type,Authorization',
				'Access-Control-Allow-Methods': 'PUT,POST,GET,HEAD,PATCH,DELETE,OPTIONS',
				'Content-Type': 'application/json; charset=utf-8'
				// 'content-security-policy': 'default-src none'
			})
			res.status(moduleResponse.code).send(moduleResponse)
		} else {
			res.end(moduleResponse)
		}
	} catch (err) {
		res.send(err)
	}
})
