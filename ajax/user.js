/*
 * @Author: iuukai
 * @Date: 2023-01-09 01:12:25
 * @LastEditors: iuukai
 * @LastEditTime: 2023-01-09 18:29:45
 * @FilePath: \api-test\ajax\user.js
 * @Description:
 * @QQ/微信: 790331286
 */
const fs = require('fs')
const path = require('path')
const uuid = require('uuid')

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

function writeData(list = []) {
	fs.writeFileSync(users_db, JSON.stringify(list), 'utf8')
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
	},
	post: {
		// 新增用户
		async addUser(query) {
			const { name, age, hobby } = query
			if (!name) throw { code: 403, msg: '缺少必要参数' }
			const list = await readData()
			const item = {
				id: uuid.v4().replaceAll('-', ''),
				name,
				age: age ?? 0,
				hobby: hobby ?? '',
				createdTime: Date.now(),
				updatedTime: Date.now()
			}
			const isFind = list.findIndex(user => user.name === item.name) > -1
			if (isFind) throw { code: 403, msg: '该用户已存在' }
			list.push(item)
			writeData(list)
			return {
				code: 200,
				data: item
			}
		}
	},
	delete: {
		// 删除用户
		async deleteUser({ id }) {
			if (!id) throw { code: 403, msg: '缺少id' }
			const list = await readData()
			const index = list.findIndex(item => item.id === id)
			if (index === -1) throw { code: 404, msg: '数据丢失，删除失败' }
			list.splice(index, 1)
			writeData(list)
			return {
				code: 200,
				data: null
			}
		}
	},
	put: {
		// 更新用户
		async updateUser(query) {
			console.log(query)
			const { id, name, age, hobby } = query
			if (!id) throw { code: 403, msg: '缺少id' }
			const list = await readData()
			const item = list.find(item => item.id === id)
			if (!item) throw { code: 404, msg: '数据丢失，更新失败' }
			if (name && item.name !== name) throw { code: 403, msg: '该字段不可修改' }
			console.log(!age && !hobby)
			console.log(item.age === (age ?? 0) && item.hobby === (hobby ?? ''))
			console.log(!age && item.hobby === (hobby ?? ''))
			console.log(!hobby && item.age === (age ?? 0))
			if (
				(!age && !hobby) ||
				(item.age === (age ?? 0) && item.hobby === (hobby ?? '')) ||
				(!age && item.hobby === (hobby ?? '')) ||
				(!hobby && item.age === (age ?? 0))
			)
				throw { code: 403, msg: '修改失败，没有需要更新的数据' }

			item.age = age ?? item.age
			item.hobby = hobby ?? item.hobby
			item.updatedTime = Date.now()
			writeData(list)
			return {
				code: 200,
				data: item
			}
		}
	}
}

module.exports = async (method, apiFunction, query) => {
	try {
		method = method.toLowerCase()
		if (!api?.[method]?.[apiFunction]) throw { code: 404, msg: '404 NOTFOND' }
		return api[method][apiFunction](query)
	} catch (err) {
		return err
	}
}
