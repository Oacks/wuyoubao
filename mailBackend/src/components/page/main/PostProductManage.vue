<template>
    <div class="goods-form">
        <h2>邮品管理</h2>
        <hr style="margin-bottom:10px;"/>
        <div class="table-area">
                <div style="height: 50px;">
                    <div style="float:left;">
                        <el-button type="primary" @click="create">新建</el-button>
                    </div>
                </div>
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
            <el-table-column prop="title" label="邮品名称">
            </el-table-column>

            <el-table-column prop="price" label="邮品价钱">
            </el-table-column>
            <el-table-column prop="description" label="描述">
            </el-table-column>
            <el-table-column prop="stock" label="库存">
            </el-table-column>
            <el-table-column prop="total" label="总量">
            </el-table-column>
          
            <el-table-column prop="status" label="操作" width="180">
                <template slot-scope="scope">
                    <el-button type="primary" @click="edit(scope.row)">编辑</el-button>
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
            :title="operate === 'create' ? '新建邮品' : operate === 'edit' ? '修改邮品' : ''"
            :visible="dialogVisible"
            :before-close="closeDialog"
            width="700px">
                <el-form :model="form" class="demo-form-inline" label-width="80px">
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item label="邮品名称">
                                <el-input v-model="form.title"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="价格">
                                <el-input v-model.number="form.price"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="12">
                             <el-form-item label="库存">
                                <el-input v-model.number="form.stock"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                             <el-form-item label="总量">
                                <el-input v-model.number="form.total"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <el-row :gutter="20">
                        <el-col :span="24">
                            <el-form-item label="描述">
                                <el-input type="textarea" v-model="form.description"></el-input>
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
    accessoriesList,
    addAccessories,
    updateAccessories,
    delAccessories
 } from '../../../api/index';
import {uniqBy, cloneDeep} from 'lodash';
// import RSA from '../../../utils/rsa'

export default {
    name: 'Contract',
    components: {
    },
    data() {
        return {
            operate: 'detail',
            tableData: [],
            page: {
                no: 1,
                total: 0,
                size: 20
            },
       
            form: {
            },
            disabled: false,
            dialogVisible: false,
            selectRow: [],
            contractValid: [], // 合同有效期
            contractTime: [], // 合同时间
            status: '', // 状态
            name: '', // 会员名字
            statusOpt: [
                {
                    value: '0',
                    label: '草稿'
                },
                {
                    value: '1',
                    label: '受理中'
                },
                {
                    value: '2',
                    label: '受理中'
                },
                {
                    value: '3',
                    label: '保单确认，未启保'
                },
                {
                    value: '4',
                    label: '保单启保中'
                },
                {
                    value: '5',
                    label: '生效'
                },
            ]
        };
    },
    created() {
        this.getData();
    },
    methods: {
        create() {
            this.operate = 'create'
            this.form =  {
                price: '',
                title: '', // 邮品名称
                stock: '',
                total: '',
                description: '',
            }
            this.openDialog()
        },
        
        handlePageChange(page) {
            this.page.no = page
            this.getData()
        },
        getData() {
            let obj = {
                pageSize:  this.page.size,
                page:  this.page.no,
            }
            accessoriesList(obj).then(res => {
                console.log(res);
                this.tableData = res
                this.page.total = res.total
                this.page.no = res.current
            })
        },

        handleSelectionChange(row){
            this.selectRow = row
        },
     
        edit(row) {
            this.operate = 'edit'
            row.status = Number(row.status)
            this.form = cloneDeep(row)
            this.openDialog()
        },
        // 详情
        detail(row) {
            contractDetail(row.id).then(res => {
                console.log(res);
                this.operate = 'detail'
                this.form = res
                this.openDialog()
            })
        },
        del(row) {
            this.$confirm('确认删除当前邮品？').then(_ => {
                let id =  row.id
                let obj = {id: id}
                delAccessories(obj).then(res => {
                    this.$message.success({message: '删除成功',});
                    this.getData()
                })
            })
            .catch(_ => {});
           
        },
        // 保存
        save() {
            if (this.disabled) {return}
            this.disabled = true
            setTimeout(() => {
                this.disabled = false
            }, 6000)
            let params = cloneDeep(this.form)
            if (this.operate == 'create') {
                addAccessories(params).then(res => {
                    this.$message.success({message: '创建成功',});
                    this.dialogVisible = false
                    this.disabled = false
                    this.getData()
                })
            }
            if (this.operate == 'edit') {
                updateAccessories(params).then(res => {
                    if (res) {
                        this.$message.success({message: '修改成功',});
                        this.dialogVisible = false
                        this.disabled = false
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
