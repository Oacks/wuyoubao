import service from '../utils/request';
import qs from 'qs'

let post = service.post
let axiosGet = service.get


// 封装get方法
function get(path, query) {
    let param = ''
    try {
        param = qs.stringify(query)
    }
    catch(err) {
        param = ''
    }
    finally {
        return axiosGet(path +'?'+ param)
    }
}

// request中配置了全是post请求
export const fetchData = query => {
    return request({
        url: './table.json',
        method: 'get',
        params: query
    });
};



// 登陆
export const login = query => {
    return post('user/login', query)
}

// 会员
export const userList = query => {
    return post('user/ht/userList', query)
}

// 会员修改 
export const userUpdate = query => {
    return post('user/ht/update', query)
}

// 会员注册
export const userRegister = query => {
    return post('user/ht/register', query)
}

export const test = query => {
    return post('user/test', query)
}

/******************邮政后台 ****************/
// 获取所有邮品
export const accessoriesList = query => {
    return get('yzht/accessoriesList', query)
}

// 邮品销售记录
export const accessoriesSales = query => {
    return get('yzht/accessoriesSales', query)
}

// 创建邮品
export const addAccessories = query => {
    return post('yzht/addAccessories', query)
}

// 更新邮品
export const updateAccessories = query => {
    return post('yzht/updateAccessories', query)
}

// 删除邮品
export const delAccessories = query => {
    return get('yzht/delAccessories', query)
}

// 创建无忧宝卡
export const addInsurance = query => {
    return post('yzht/addInsurance', query)
}

// 邮政合同审批
export const approval = query => {
    return get('yzht/approval', query)
}

// 获取合同列表
export const contractList = query => {
    return get('yzht/contractList', query)
}

// 邮政发卡
export const sendCard = query => {
    return post('yzht/hairpin', query)
}

// 删除无忧宝卡
export const insuranceDelete = query => {
    return get('yzht/insuranceDelete', query)
}

// 无忧宝卡列表
export const insuranceList = query => {
    return get('yzht/insuranceList', query)
}

// 无忧宝卡详细列表
export const cardList = query => {
    return get('yzht/cardList', query)
}

// 无忧宝卡详细列表
export const addCard = query => {
    return post('yzht/addCard', query)
}
// 无忧宝卡详细列表
export const delCard = query => {
    return get('yzht/delCard', query)
}

// 七牛云上传
export const uploadToken = query => {
    return get('file/uploadQniuToken', query)
}