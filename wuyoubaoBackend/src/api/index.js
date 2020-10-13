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

/********************** 用户管理 *********************/
// 分配用户菜单
export const addMenu = query => {
    return post('user/addMenu', query)
}

// 创建后台用户
export const createUser = query => {
    return post('user/createUser', query)
}

// 登录
export const login = query => {
    return post('user/login', query)
}

// 菜单列表
export const menuList = query => {
    return get('user/menuList', query)
}

// 后台用户详情
export const userDetail = query => {
    return get('user/userDetail', query)
}

// 后台用户列表
export const userList = query => {
    return get('user/userList', query)
}

/********************** 无忧保后台********************/
// 获取合同详情
export const contractDetail = query => {
    return get('wyht/contractDetail', query)
} 

// 获取合同列表
export const contractList = query => {
    return get('wyht/contractList', query)
}

// 后台获取合同状态修改
export const contractUpdate = query => {
    return get('wyht/contractUpdate', query)
}

// 审批合同
export const approval = query => {
    return post('wyht/approval', query)
}

// 创建4s店
export const createShop = query => {
    return post('wyht/createShop', query)
}


// 4s店详情
export const shopDetail = query => {
    return get('wyht/shopDetail', query)
}

// 4s店列表
export const shopList = query => {
    return get('wyht/shopList', query)
}

// 编辑4s店
export const updateShop = query => {
    return post('wyht/updateShop', query)
}

// 获取定价列
export const contractPriceList = query => {
    return get('wyht/contractPriceList', query)
}
// 无忧保定价
export const fixedPrice = query => {
    return post('wyht/fixedPrice', query)
}
// 无忧保定价删除
export const priceDetele = query => {
    return get('wyht/priceDetele', query)
}
// 无忧保定价修改
export const priceUpdate = query => {
    return post('wyht/priceUpdate', query)
}

// 导出合同
export const exportContract = query => {
    return get('wyht/eportContract', query)
}

/******************邮政后台 ****************/
export const accessoriesList = query => {
    return get('wyht/accessoriesList', query)
}

// 七牛云上传
export const uploadToken = query => {
    return get('file/uploadQniuToken', query)
}

// 无忧保卡列表
export const insuranceList = query => {
    return get('wyht/carInsuranceList', query)
}

// 创建销售
export const addSaler = query => {
    return post('wyht/addSaler', query)
}

export const delSaler = query => {
    return post('wyht/delSaler', query)
}

export const salerList = query => {
    return get('wyht/salerList', query)
}

export const updateSaler = query => {
    return post('wyht/updateSaler', query)
}

