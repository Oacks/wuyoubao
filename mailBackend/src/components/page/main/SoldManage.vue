<template>
    <div class="goods-form">
        <h2>销售记录</h2>
        <hr style="margin-bottom:10px;"/>
        <div class="table-area">
            <h4>无忧宝卡销售记录</h4>
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

                <el-table-column prop="title" label="卡号">
                </el-table-column>
                
                <el-table-column prop="contractId" label="合同号">
                </el-table-column>

                <el-table-column prop="createTime" label="时间">
                    <template slot-scope="scope">
                        {{transFormTime(scope.row.createTime)}}
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
            </div>

        <div class="table-area">
            <h4>邮品销售记录</h4>
            <el-table
                :data="postTableData"
                border
                class="table"
                ref="multipleTable"
                row-key="id"
                header-cell-class-name="table-header"
                @selection-change="handleSelectionChange"
                >
                <!-- <el-table-column type="selection" width="55" align="center"></el-table-column> -->

                <el-table-column prop="title" label="名称">
                </el-table-column>
                
                <el-table-column prop="contractId" label="合同号">
                </el-table-column>
            </el-table>

            <div class="pagination">
                <el-pagination
                    background
                    layout="total, prev, pager, next"
                    :current-page="postpage.no"
                    :page-size="postpage.size"
                    :total="postpage.total"
                    @current-change="handlePostPageChange"
                ></el-pagination>
            </div>
            </div>
    </div>
</template>

<script>
import { 
    accessoriesSales,
 } from '../../../api/index';
import {uniqBy, cloneDeep} from 'lodash';

export default {
    name: 'CardDetailManage',
    components: {
    },
    data() {
        return {
            operate: 'detail',
            tableData: [],
            postTableData: [],
            page: {
                no: 1,
                total: 0,
                size: 20
            },
            postpage: {
                no: 1,
                total: 0,
                size: 20
            },
            form: {
            },
            dialogVisible: false,
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
            ],
        };
    },
    mounted() {
        this.getData(1) // 卡
        this.getData(2) // 邮品
    },
    methods: {
        transFormTime(time) {
            if (!time) {return ''}
            var date = new Date(time);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
            var Y = date.getFullYear() + '-';
            var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
            var D = date.getDate() + ' ';
            var h = (date.getHours() < 10 ? '0' + (date.getHours()) : date.getHours()) + ':';
            var m = date.getMinutes() + ':';
            var s = date.getSeconds();
            return Y + M + D + h + m + s;
        },
        handlePageChange(page) {
            this.page.no = page
            this.getData(1)
        },
        handlePostPageChange(page) {
            this.postpage.no = page
            this.getData(2)
        },
        getData(type) {
            let obj = {
                saleType:  type, // 1卡，2邮品
                page:  this.page.no,
                pageSize: this.page.size
            }
            accessoriesSales(obj).then(res => {
                if (type == 1) {
                    this.tableData = res.records
                    this.page.total = res.total
                    this.page.no = res.current
                }
                else if (type ==2) {
                    this.postTableData = res.records
                    this.postpage.total = res.total
                    this.postpage.no = res.current
                }
            })
        },

        handleSelectionChange(row){
            this.selectRow = row
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
