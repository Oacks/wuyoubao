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


export const test = query => {
    return post('user/test', query)
}

/******************邮政后台 ****************/
// 获取所有邮品
export const accessoriesList = query => {
    return get('yzht/accessoriesList', query)
}

// 发卡申请表
export const rzLine = query => {
    return get('yzht/rzLine', query)
} 
// 发卡申请
export const addLine = query => {
    return post('wyht/addLine', query)
} 

// 发卡
export const hairpin = query => {
    return get('yzht/hairpin', query)
} 

// 发卡申请
export const updateLine = query => {
    return post('wyht/updateLine', query)
} 

// 发卡申请
export const delLine = query => {
    return get('wyht/delLine', query)
} 

// 获取发卡申请合同详情
export const getLineContract = query => {
    return get('wyht/getLineContract', query)
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

// 获取合同详情
export const contractDetail = query => {
    return get('yzht/contractDetail', query)
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

// 无忧宝卡列表
export const insuranceStart = query => {
    return get('yzht/insuranceStart', query)
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

// ***********用户管理 **********/
// 分配用户菜单
export const addMenu = query => {
    return post('user/addMenu', query)
}

// 创建后台用户
export const createUser = query => {
    return post('user/createUser', query)
}

// 修改后台用户
export const updateUser = query => {
    return post('user/updateUser', query)
}


// 菜单列表
export const menuList = query => {
    return get('user/menuList', query)
}

// 后台用户详情
export const userDetail = query => {
    return get('user/userDetail', query)
}

// 删除用户详情
export const delUser = query => {
    return get('user/delUser', query)
}

// 后台用户列表
export const userList = query => {
    return get('user/userList', query)
}
