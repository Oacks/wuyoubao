<template>
    <div class="goods-form">
        <div class="table-area">
        <div style="margin-bottom:10px;">
            <el-button type="primary" @click="create">新建</el-button>
        </div>
        <el-table
            :data="salerTableData"
            border
            class="table"
            ref="multipleTable"
            header-cell-class-name="table-header"
            @selection-change="handleSelectionChange"
            >
            <el-table-column type="selection" width="55" align="center"></el-table-column>
            <!-- <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column> -->
            <!-- <el-table-column type="index" label="序号" width="55" align="center"></el-table-column> -->

            <el-table-column prop="memberName" label="销售名称">
            </el-table-column>

            <el-table-column prop="memberNammobilee" label="电话">
            </el-table-column>
          
            <!-- <el-table-column prop="status" label="会员状态">
                <template slot-scope="scope">
                    {{scope.row.status == 1  ? '激活' : '注销'}}
                </template>
            </el-table-column> -->
            <el-table-column prop="status" label="操作" width="100">
                <template slot-scope="scope">
                    <el-button type="primary" @click="detail(scope.row)">查看</el-button>
                    <el-button type="danger" @click="del(scope.row)">删除</el-button>
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
            :title="'添加销售人员'"
            :visible="dialogVisible"
            :before-close="closeDialog"
            append-to-body
            width="800px">
                <el-form :model="form" class="demo-form-inline" label-width="80px">
                    <el-row :gutter="20">
                     
                        <el-col :span="12">
                            <el-form-item label="销售名称">
                                <el-input v-model="form.memberName"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="电话">
                                <el-input v-model="form.mobile"></el-input>
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
    salerList,
    addSaler,
    delSaler,
    updateSaler,
 } from '../../../api/index';
import {uniqBy, cloneDeep} from 'lodash';
// import RSA from '../../../utils/rsa'

export default {
    name: 'SalerList',
    components: {
    },
    data() {
        return {
            operate: 'create',
            dialogVisible: false,
            salerTableData: [],
            form: {
                memberName: '',
                mobile: '',
                shopId: '',
                status: 1 // 1有效
            },
            page: {
                no: 1,
                total: 0,
                size: 20
            },
            selectRow: [],
            shopId: ''
        };
    },
    created() {
    },
    mounted() {
   
    },
    methods: {
        handlePageChange(page) {
            this.page.no = page
            this.getData()
        },
        getData(row) {
            this.shopId = row.id
            salerList({id: row.id, page: this.page.no, pageSize: this.page.size}).then(res => {
                this.salerTableData = res.records
                this.salerDialogVisible = true
            })
        },
        handleSelectionChange(row){
            this.selectRow = row
        },
        create() {
            this.operate = 'create'
            this.form = {
                memberName: '',
                mobile: '',
                shopId: this.shopId,
                status: 1 // 1有效
            },
            this.openDialog()
        },
        edit(row) {
            this.operate = 'edit'
            row.status = Number(row.status)
            this.form = row
            this.form.shopId = this.shopId
            this.openDialog()
        },
        // 详情
        detail(row) {
            shopDetail({id: row.id}).then(res => {
                this.operate = 'detail'
                this.form = res
                this.openDialog()
            })
        },
       
        del(row) {
            this.$confirm('确认删除当前销售人员？').then(_ => {
                let id =  row.id
                let obj = {id: id}
                delSaler(obj).then(res => {
                    this.$message.success({message: '删除成功',});
                    this.getData()
                })
            })
            .catch(_ => {});
        },
        // 保存
        save() {
            let params = cloneDeep(this.form)
            if (this.operate == 'create') {
                let obj = params
                addSaler(obj).then(res => {
                    if (res) {
                        this.$message.success({message: '创建成功',});
                        this.dialogVisible = false
                        this.getData()
                    }
                })
            }
            if (this.operate == 'edit') {
                updateSaler(params).then(res => {
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

<style lang="scss" scoped>
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
    .upload-demo {
        ::v-deep .el-upload.el-upload--text {
        width: 200px;
        border: none;
        height: 30px;
        }
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
