<template>
    <div class="goods-form">
        <div class="table-area">
        <div style="margin-bottom: 10px;">
            <el-button type="primary" @click="create">新建</el-button>
        </div>
        <!-- <div style="margin: 10px 0;">
            用户搜索：
            <el-input v-model="userName" style="width: 150px;margin:0 10px;"></el-input>
            <el-button icon="el-icon-search" @click="search"></el-button>
        </div> -->
        <el-table
            :data="tableData"
            border
            class="table"
            ref="multipleTable"
            row-key="id"
            header-cell-class-name="table-header"
            @selection-change="handleSelectionChange"
            >
            <el-table-column type="selection" width="55" align="center"></el-table-column>
            <!-- <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column> -->
            <!-- <el-table-column type="index" label="序号" width="55" align="center"></el-table-column> -->

            <el-table-column prop="userName" label="会员呢称">
            </el-table-column>
          
            <el-table-column prop="mobile" label="手机号">
            </el-table-column>

            <!-- <el-table-column prop="password" label="密码">
            </el-table-column> -->
          
            <!-- <el-table-column prop="status" label="会员状态">
                <template slot-scope="scope">
                    {{scope.row.status == 1  ? '激活' : '注销'}}
                </template>
            </el-table-column> -->
            <el-table-column prop="status" label="操作" width="180">
                <template slot-scope="scope">
                    <el-button type="primary" @click="edit(scope.row)">编辑</el-button>
                    <el-button type="danger" @click="del(scope.row)">注销</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination">
            <el-pagination
                background
                layout="total, prev, pager, next"
                :current-page="page.no"
                :page-size="page.size"
                :total="page.total"
                @current-change="handlePageChange"
            ></el-pagination>
        </div>
        <el-dialog
            class="user-dialog"
            :close-on-click-modal='false'
            :title="operate === 'create' ? '创建用户' : '编辑用户'"
            :visible.sync="dialogVisible"
            width="700px">
                <el-form :model="form" class="demo-form-inline" label-width="80px">
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item label="用户名">
                                <el-input v-model="form.userName"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="用户密码" v-if="operate == 'create'">
                                <el-input type="password" v-model="form.password" :placeholder="operate == 'create' ? '' : '需要修改请输入原密码'"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item label="手机号">
                                <el-input v-model="form.mobile"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item label="新密码"  v-if="operate !== 'create'">
                                <el-input type="password" v-model="form.newPwd" placeholder="需要修改请输入新密码"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="确认密码"  v-if="operate !== 'create'">
                                <el-input type="password" v-model="form.confirmPwd" placeholder="需要修改请确认新密码"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="24">
                            <el-form-item label="分配菜单" v-if="operate == 'edit'">
                                  <el-checkbox-group v-model="selectedMenu">
                                    <el-checkbox :label="menu.id" v-for="(menu,i) in menuList" :key="i">{{menu.name}}</el-checkbox>
                                </el-checkbox-group>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="save">确 定</el-button>
            </span>
        </el-dialog>
        </div>
    </div>
</template>

<script>
import { 
    addMenu,
    createUser,
    updateUser,
    menuList,
    userDetail,
    userList,
    delUser
 } from '../../../api/index';
import {uniqBy, cloneDeep} from 'lodash'
// import RSA from '../../../utils/rsa'

export default {
    name: 'userForm',
    props: {
    },
    components: {
    },
    computed: {
    },
    data() {
        return {
            operate: 'create',
            tableData: [],
            selectedMenu: [],
            page: {
                no: 1,
                total: 0,
                size: 20
            },
            form: {
                mobile: '',
                orgin: 'wy',
                password: '',
                state: 1,
                userName: '',
                newPwd: '',
                confirmPwd: '',
            },
            dialogVisible: false,
            selectRow: [],

            level: '',
            userName: '',
            menuList: []
        };
    },
    created() {
        this.getData();
        this.getMenuList()
    },
    methods: {
        search() {
            // let pas = RSA.RSAencrypt('caibihoutai')
            // console.log(pas);
            this.getData()
        },
        handlePageChange(page) {
            this.page.no = page
            this.getData()
        },
        getMenuList() {
            menuList().then(res => {
                this.menuList = res || []
            })
        },
        getData() {
            let obj = {
                pageSize:  this.page.size,
                page:  this.page.no,
                orgin: 'wy'
            }
            userList(obj).then(res => {
                console.log(res.records);
                this.tableData = res.records
                this.page.total = res.total
                this.page.no = res.current
            })
        },
        changeLevel(v) {
            this.level = v
            this.getData()
        },
        handleSelectionChange(row){
            this.selectRow = row
        },
        create() {
            this.operate = 'create'
            this.form =  {
                mobile: '',
                orgin: 'wy',
                password: '',
                state: 1,
                userName: '',
                newPwd: '',
                confirmPwd: '',
            }
            this.openDialog()
        },
        edit(row) {
            // if (this.selectRow.length == 0) {
            //     this.$message.warning({message: '请选择需要编辑的内容',});
            //     return
            // }
            // else if (this.selectRow.length > 1) {
            //     this.$message.warning({message: '只能同时编辑一条',});
            //     return
            // }
            userDetail({id: row.id}).then(res => {
                let list = []
                for (let i = 0; i < res.menuList.length; i++) {
                    const element = res.menuList[i];
                    list.push(res.menuList[i].id)
                }
                this.selectedMenu = list
                this.operate = 'edit'
                row.status = Number(row.status)
                this.form = cloneDeep(row)
                this.openDialog()
            })
        },
        del(row) {
            this.$confirm('确认删除当前用户？').then(_ => {
                let id =  row.id
                let obj = {id: id}
                delUser(obj).then(res => {
                    this.$message.success({message: '删除成功',});
                    this.getData()
                })
            })
            .catch(_ => {});
        },
        // 保存
        save() {
            let params = cloneDeep(this.form)
            if (params.password) {
                params.password = window.btoa(params.password)
            }
            if (this.operate == 'create') {
                delete params.newPwd;
                delete params.confirmPwd;
                createUser(params).then(res => {
                    if (res) {
                        this.$message.success({message: '创建成功',});
                        this.dialogVisible = false
                        this.getData()
                    }
                })
            }
            if (this.operate == 'edit') {
                console.log(this.selectedMenu);
                if (params.newPwd != '' || params.confirmPwd != '') {
                    if (params.newPwd !== params.confirmPwd) {
                        this.$message.warning({message: '两次新密码输入不一样',});
                        return
                    }
                    else {
                        params.password = window.btoa(params.newPwd)
                    }
                }
                addMenu({
                    userId: params.id,
                    menuList: this.selectedMenu
                })
                // delete params.password
                updateUser(params).then(res => {
                    if (res) {
                        this.$message.success({message: '修改成功',});
                        this.dialogVisible = false
                        this.getData()
                    }
                })
            }
        },
        openDialog() {
            this.dialogVisible = true
        },
        closeDialog() {
            this.dialogVisible = false
        },
    }
};
</script>

<style  scoped>
    .el-select {
        width: 100%;
    }
    .type-select {
        display: inline-block;
        width: 300px;
        border-right: 1px solid #ddd;
        height: 100%;
        text-align: center;
    }

    .w200 {
        width: 200px;
        margin-bottom: 20px;
        display: inline-block;
    }
    .upload-demo {
        text-align: center;
    }
    .upload-demo /deep/ .el-upload.el-upload--text {
        width: 200px;
        border: none;
        height: 30px;
    }
    .pic-list {
        text-align: center;
    }
    .pic-list-item {
        display: inline-block;
        width: 100px;
        height: 100px;  
    }
    .tac .el-form-item__content{
        text-align: center;
    }
    .user-dialog .el-select {
        width: 100% !important;
    }
</style>
