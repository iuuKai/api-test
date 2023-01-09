/*
 * @Author: iuukai
 * @Date: 2023-01-09 01:12:36
 * @LastEditors: iuukai
 * @LastEditTime: 2023-01-09 07:54:01
 * @FilePath: \api-test\jsonp\user.js
 * @Description:
 * @QQ/微信: 790331286
 */
const fs = require('fs')
const path = require('path')

const users_db = path.join(__dirname, '../db/users.json')

async function readData(query = '') {
	const list = JSON.parse((await fs.readFileSync(users_db, 'utf8')) || '[]')
	return list.filter(item => {
		if (typeof query === 'string') {
			const { name, age, hobby } = item
			const reg = new RegExp(query, 'gi')
			return reg.test(name) || reg.test(age) || reg.test(hobby)
		} else if (typeof query === 'object') {
			const hasValKeys = Object.keys(query).filter(
				k => query[k] && ['name', 'age', 'hobby'].includes(k)
			)
			const hasFilterList = hasValKeys.reduce((res, cur, i) => {
				const reg = new RegExp(query[cur], 'gi')
				if (reg.test(item[cur])) res.push(item)
				return res
			}, [])
			return hasValKeys.length === hasFilterList.length
		}
	})
}

const api = {
	get: {
		// 获取用户列表
		async getList(query) {
			const list = await readData(query)
			return {
				code: 200,
				data: list
			}
		},
		// 获取某个用户
		async getUser({ id }) {
			if (!id) throw { code: 403, msg: '缺少id' }
			const list = await readData()
			const item = list.find(item => item.id === id)
			if (!item) throw { code: 404, msg: '数据丢失' }
			return {
				code: 200,
				data: item
			}
		},
		// 搜索匹配用户列表
		async searchList({ value }) {
			const list = await readData(value)
			return { code: 200, data: list }
		}
	}
}

module.exports = async (method, apiFunction, query) => {
	try {
		method = method.toLowerCase()
		if (!api?.[method]?.[apiFunction]) throw { code: 404, msg: '404 NOTFOND' }
		return `${query.callback}(${JSON.stringify(await api[method][apiFunction](query))})`
	} catch (err) {
		return `${query.callback}(${JSON.stringify(err)})`
	}
}
