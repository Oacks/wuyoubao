<template>
    <div class="goods-form">
        <h2>定价管理</h2>
        <hr style="margin-bottom:10px;"/>
        <div class="table-area">
            <div style="height: 50px;">
                <div style="float:left;">
                    <el-button type="primary" @click="create">新建</el-button>
                </div>
                <div style="float:right;">
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

            <el-table-column label="车价">
                <template slot-scope="scope">
                    {{scope.row.priceCarStart}} - {{scope.row.priceCarEnd}}
                </template>
            </el-table-column>
          
            <el-table-column label="邮品">
                <template slot-scope="scope">
                    <span v-for="(list, i) in scope.row.accessoriesList" :key="i">{{list.title}} {{i !== scope.row.accessoriesList.length - 1 ? ',' : ''}}</span>
                </template>
            </el-table-column>

            <el-table-column label="卡券">
                <template slot-scope="scope">
                    <span>{{getCarInsuranceTitle(scope.row.carInsuranceId)}}</span>
                </template>
            </el-table-column>
            
            <el-table-column prop="priceContract" label="合同定价">
            </el-table-column>
          
            <el-table-column prop="status" label="操作" width="180">
                <template slot-scope="scope">
                    <el-button type="primary" @click="edit(scope.row)">修改定价</el-button>
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
            :title="operate === 'create' ? '新建定价' : operate === 'detail' ? '修改定价' : ''"
            :visible="dialogVisible"
            :before-close="closeDialog"
            width="700px">
                <el-form :model="form" class="demo-form-inline" label-width="80px">
                    <el-row :gutter="20">
                        <el-col :span="24">
                            <el-form-item label="车价区间">
                                <el-col :span="12">
                                    <el-input v-model.number="form.priceCarStart"></el-input>
                                </el-col>
                                <el-col :span="1">
                                    -
                                </el-col>
                                <el-col :span="11">
                                    <el-input v-model.number="form.priceCarEnd"></el-input>
                                </el-col>
                            </el-form-item>
                        </el-col>
                       
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item label="定价">
                                <el-input v-model.number="form.priceContract"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="状态">
                                <el-select v-model="form.status" placeholder="请选择">
                                    <el-option
                                    clearable
                                    v-for="item in selectStatusOpt"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item label="卡券">
                                <el-select v-model="form.carInsuranceId" placeholder="请选择">
                                    <el-option v-for="(card, i) in cardList" :key="i" :label="card.title" :value="card.id"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <el-row :gutter="20">
                        <el-col :span="24">
                            <el-form-item label="邮品">
                                <el-checkbox-group v-model="form.accessoriesList">
                                    <el-checkbox v-for="(post, i) in postProd" :key="i" :label="post.id" >{{post.title}}</el-checkbox>
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
    contractPriceList,
    fixedPrice,
    priceDetele,
    priceUpdate,
    accessoriesList,
    insuranceList
 } from '../../../api/index';
import {uniqBy, cloneDeep} from 'lodash';
// import RSA from '../../../utils/rsa'

export default {
    name: 'PriceManage',
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
            dialogVisible: false,
            selectRow: [],
            status: '', // 0下架,1上架
            selectStatusOpt: [
                {
                    value: '0',
                    label: '下架'
                },
                {
                    value: '1',
                    label: '上架'
                },
            ],
            statusOpt: [
                {
                    value: '0',
                    label: '下架'
                },
                {
                    value: '1',
                    label: '上架'
                },
                {
                    value: '',
                    label: '全部'
                },
            ],
            postProd: [],
            cardList: []
        };
    },
    created() {
        this.getData();
        this.getPostProduct()
        this.getCard()
    },
    methods: {
        // 匹配title
        getCarInsuranceTitle(id) {
            if (this.cardList.length == 0) {
                return ''
            }
            for (let i = 0; i < this.cardList.length; i++) {
                const element = this.cardList[i];
                if (element.id == id) {
                    return element.title
                }
            }
        },
        // 获取邮品列表
        getPostProduct() {
            let param = {
            }
            accessoriesList(param).then(res => {
                this.postProd = res
            })
        },
        // 获取卡券
        getCard() {
            let param = {}
            insuranceList(param).then(res => {
                this.cardList = res
            })
        },
        search() {
            this.getData()
        },
        handlePageChange() {
            this.getData()
        },
        getData() {
            let obj = {
                status: this.status,
            }
            contractPriceList(obj).then(res => {
                this.tableData = res
                this.page.total = res.total
                this.page.no = res.current
            })
        },

        handleSelectionChange(row){
            this.selectRow = cloneDeep(row)
        },
        create() {
            this.operate = 'create'
            this.form =  {
                priceCarStart: '',
                priceCarEnd: '',
                priceContract: '',
                status: '1',
                accessoriesList: []
            }
            this.openDialog()
        },
        edit(row) {
            this.operate = 'edit'
            let accessoriesList = []
            for (let index = 0; index < row.accessoriesList.length; index++) {
                const element = row.accessoriesList[index];
                accessoriesList.push(element.id)
            }
            this.form = cloneDeep(row)
            this.form.accessoriesList = cloneDeep(accessoriesList)
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
            this.$confirm('确认删除当前定价？').then(_ => {
                    let id =  row.id
                    let obj = {id: id}
                    priceDetele(obj).then(res => {
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
                fixedPrice(params).then(res => {
                    this.$message.success({message: '创建成功',});
                    this.dialogVisible = false
                    this.getData()
                })
            }
            if (this.operate == 'edit') {
                priceUpdate(params).then(res => {
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
