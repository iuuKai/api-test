# API-TEST

## AJAX

### getList

```js,ajax,demo,getList
axios({
	method: 'get',
	url: '%{origin}%/api/ajax/user/getList',
	params: {
		name: '',
		age: '',
		hobby: ''
	}
})
```

```js,ajax,response,getList
{
  "code": 200,
  "data": [
    {
      "id": "4ef33d1747a74678967b12537e5900bd",
      "name": "蔡徐坤",
      "age": 24,
      "hobby": "唱、跳、Rap、篮球",
      "createdTime": 1673214081611,
      "updatedTime": 1673214081611
    },
    {
      "id": "0cd22700f63a42e18d5829766d60bcb2",
      "name": "张三",
      "age": 23,
      "hobby": "太极",
      "createdTime": 1673214096222,
      "updatedTime": 1673220593209
    },
    {
      "id": "08c3e4e7ef6f4845aefac8dba71ed5f8",
      "name": "李四",
      "age": 24,
      "hobby": "足球",
      "createdTime": 1673214116240,
      "updatedTime": 1673214116240
    }
  ]
}
```

### getUser

```js,ajax,demo,getUser
axios({
	method: 'get',
	url: '%{origin}%/api/ajax/user/getUser',
	params: {
		id: '0cd22700f63a42e18d5829766d60bcb2'
	}
})
```

```js,ajax,response,getUser
{
  "code": 200,
  "data": {
    "id": "0cd22700f63a42e18d5829766d60bcb2",
    "name": "张三",
    "age": 23,
    "hobby": "太极",
    "createdTime": 1673214096222,
    "updatedTime": 1673220593209
  }
}
```

### searchList

```js,ajax,demo,searchList
axios({
	method: 'get',
	url: '%{origin}%/api/ajax/user/searchList',
	params: {
		value: '球'
	}
})
```

```js,ajax,response,searchList
{
  "code": 200,
  "data": [
    {
      "id": "4ef33d1747a74678967b12537e5900bd",
      "name": "蔡徐坤",
      "age": 24,
      "hobby": "唱、跳、Rap、篮球",
      "createdTime": 1673214081611,
      "updatedTime": 1673214081611
    },
    {
      "id": "08c3e4e7ef6f4845aefac8dba71ed5f8",
      "name": "李四",
      "age": 24,
      "hobby": "足球",
      "createdTime": 1673214116240,
      "updatedTime": 1673214116240
    }
  ]
}
```

### addUser

```js,ajax,demo,addUser
axios({
	method: 'post',
	url: '%{origin}%/api/ajax/user/addUser',
	params: {
		name: '赵四',
		age: 51,
		hobboy: '跳舞'
	}
})
```

```js,ajax,response,addUser
{
  "code": 200,
  "data": {
    "id": "355b003b71c84fe7b6fde7435b2f9b3b",
    "name": "赵四",
    "age": 51,
    "hobby": "跳舞",
    "createdTime": 1673224873181,
    "updatedTime": 1673224873181
  }
}
```

### updateUser

```js,ajax,demo,updateUser
axios({
	method: 'put',
	url: '%{origin}%/api/ajax/user/addUser',
	params: {
		id: '0cd22700f63a42e18d5829766d60bcb2',
		hobboy: '唱歌'
	}
})
```

```js,ajax,response,updateUser
{
  "code": 200,
  "data": {
    "id": "0cd22700f63a42e18d5829766d60bcb2",
    "name": "张三",
    "age": 23,
    "hobby": "唱歌",
    "createdTime": 1673214096222,
    "updatedTime": 1673220593209
  }
}
```

### deleteUser

```js,ajax,demo,deleteUser
axios({
	method: 'delete',
	url: '%{origin}%/api/ajax/user/deleteUser',
	params: {
		id: '0cd22700f63a42e18d5829766d60bcb2'
	}
})
```

```js,ajax,response,deleteUser
{
  "code": 200,
  "data": null
}
```

## JSONP

### getList

```html,jsonp,demo,getList
<script>
  function fn(data) {
    console.log(data)
  }
</script>
<script src="%{origin}%/api/ajax/user/getList?name=张三&callback=fn"></script>
```

### getUser

```html,jsonp,demo,getUser
<script>
  function fn(data) {
    console.log(data)
  }
</script>
<script src="%{origin}%/api/ajax/user/getUser?id=0cd22700f63a42e18d5829766d60bcb2&callback=fn"></script>
```

### searchList

```html,jsonp,demo,searchList
<script>
  function fn(data) {
    console.log(data)
  }
</script>
<script src="%{origin}%/api/ajax/user/searchList?value=test&callback=fn"></script>
```

## PROXY

### 跨域代理

```js,proxy,demo,跨域代理
axios({
  url: '/proxy/%{origin}%/api/ajax/user/getList',
  method: 'get',
  params: {
		name: '坤',
		hobby: '球'
	}
})
```

```js,proxy,response,跨域代理
{
  "code": 200,
  "data": [
    {
      "id": "4ef33d1747a74678967b12537e5900bd",
      "name": "蔡徐坤",
      "age": 24,
      "hobby": "唱、跳、Rap、篮球",
      "createdTime": 1673214081611,
      "updatedTime": 1673214081611
    }
  ]
}
```
