/*
 * @Author: iuukai
 * @Date: 2023-01-09 00:51:47
 * @LastEditors: iuukai
 * @LastEditTime: 2023-03-08 07:23:01
 * @FilePath: \api-test\index.js
 * @Description:
 * @QQ/微信: 790331286
 */
const fs = require('fs')
const path = require('path')
const axios = require('axios')
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

app.get('/readme', async (req, res) => {
	try {
		console.log(123)
		const content = await fs.readFileSync(path.join(__dirname, './README.md'), 'utf8')
		res.status(200).send({ code: 200, data: content })
	} catch (err) {
		res.status(404).send({
			code: 404,
			data: null,
			msg: 'Not Found'
		})
	}
})

app.use('/proxy/:url(*)', async (req, res) => {
	try {
		const { url } = req.params
		res.set({
			'Access-Control-Allow-Credentials': true,
			'Access-Control-Allow-Origin': req.headers.origin || '*',
			'Access-Control-Allow-Headers': 'X-Requested-With,Content-Type,Authorization',
			'Access-Control-Allow-Methods': 'PUT,POST,GET,HEAD,PATCH,DELETE,OPTIONS',
			'Content-Type': 'application/json; charset=utf-8'
			// 'content-security-policy': 'default-src none'
		})
		const moduleResponse = await axios({
			url,
			method: req.method,
			data: req.body,
			params: req.query
		})
		res.status(moduleResponse.status).send(moduleResponse.data)
	} catch (moduleResponse) {
		if (!moduleResponse) {
			res.status(404).send({
				code: 404,
				data: null,
				msg: 'Not Found'
			})
			return
		}
		res.status(moduleResponse.status ?? 502).send(moduleResponse.body)
	}
})

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
