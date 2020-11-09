<template>
    <div class="goods-form">
        <h2>无忧宝卡管理</h2>
        <hr style="margin-bottom:10px;"/>
        <div class="table-area">
            <div style="height: 50px;">
                <div style="float:left;">
                    <el-button type="primary" @click="create">新建</el-button>
                </div>
                <!-- <div style="float:right;">
                    <el-select v-model="status" placeholder="请选择">
                        <el-option
                        clearable
                        v-for="item in statusOpt"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                    <el-button icon="el-icon-search" @click="search"></el-button>
                </div> -->
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
            <!-- <el-table-column type="selection" width="55" align="center"></el-table-column> -->

            <!-- <el-table-column prop="id" label="卡号" width="260">
            </el-table-column> -->

            <el-table-column prop="title" label="保险名称">
            </el-table-column>

            <el-table-column prop="price" label="价钱">
            </el-table-column>
<!--           
            <el-table-column prop="status" label="卡状态">
                <template slot-scope="scope">
                    {{scope.row.status == 1  ? '已售' : '未售'}}
                </template>
            </el-table-column> -->
            <el-table-column prop="description" label="描述">
            </el-table-column>
            <el-table-column prop="stock" label="库存">
            </el-table-column>
            <el-table-column label="操作" width="180">
                <template slot-scope="scope">
                    <!-- <el-button type="primary" @click="edit(scope.row)">编辑</el-button> -->
                    <el-button type="primary" @click="checkCard(scope.row)">查看卡券</el-button>
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
            :title="operate === 'create' ? '新建无忧宝卡' : operate === 'detail' ? '查看无忧宝卡' : ''"
            :visible="dialogVisible"
            :before-close="closeDialog"
            width="700px">
                <el-form :model="form" class="demo-form-inline" label-width="80px">
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item label="保险名称">
                                <el-input v-model="form.title"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="价格">
                                <el-input v-model.number="form.price"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <!-- <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item label="状态" v-if="operate=='edit'">
                                <el-select v-model="form.status" placeholder="请选择">
                                    <el-option
                                    clearable
                                    v-for="item in statusOpt"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row> -->

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
        <el-dialog
            class="user-dialog"
            :close-on-click-modal='false'
            :title="'查看卡券'"
            :visible="detailDialogVisible"
            :before-close="closeDetailDialog"
            width="900px">
            <card-detail-manage ref="cardDetail"></card-detail-manage>
        </el-dialog>

        </div>
    </div>
</template>

<script>
import { 
    insuranceList,
    insuranceDelete,
    addInsurance,
 } from '../../../api/index';
import CardDetailManage from './CardDetailManage'
import {uniqBy, cloneDeep} from 'lodash';

export default {
    name: 'CardManage',
    components: {
        CardDetailManage
    },
    data() {
        return {
            disabled: false,
            operate: 'detail',
            tableData: [],
            page: {
                no: 1,
                total: 0,
                size: 20
            },
           
            form: {
            },
            dialogVisible: false,
            detailDialogVisible: false,
            selectRow: [],
            statusOpt: [
                {
                    value: 0,
                    label: '未售'
                },
                {
                    value: 1,
                    label: '已售'
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
                description: '',
                // insuranceNo: '',
                price: '',
                // status: 0, // 0未售，1已售
                title: '', // 保险名称
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
                status: 0
            }
            insuranceList(obj).then(res => {
                this.tableData = res.records
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
        // 查看卡券
        checkCard(row) {
            this.detailDialogVisible = true
            this.$nextTick(() => {
                this.$refs.cardDetail.getData(row.id)
            })
        },
        del(row) {
            this.$confirm('确认删除当前卡？').then(_ => {
                    let id =  row.id
                    let obj = {id: id}
                    insuranceDelete(obj).then(res => {
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
                addInsurance(params).then(res => {
                    this.$message.success({message: '创建成功',});
                    this.dialogVisible = false
                this.disabled = false
                    this.getData()
                })
            }
            if (this.operate == 'edit') {
                userUpdate(params).then(res => {
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
        closeDetailDialog() {
            this.detailDialogVisible = false
        }
    }
};
</script>

<style lang="scss" scoped>
    .el-select {
        width: 200px;
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
