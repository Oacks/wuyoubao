<template>
    <div class="goods-form">
        <h2>收款管理</h2>
        <hr style="margin-bottom:10px;"/>
        <div class="table-area">
           <div style="margin: 10px;">
               <el-form  class="demo-form-inline" label-width="60px">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="月份">
                            <el-date-picker
                            style="width: 100%;"
                            v-model="sendCardTime"
                            type="month"
                            value-format="yyyy-MM">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <div>
                        <el-button style="margin-left:40px; margin-top:0;" type="primary" icon="el-icon-search" @click="search">搜索</el-button>
                    </div>
                </el-row>
            </el-form>
               <!-- <el-select v-model="showTableStatus" placeholder="请选择" @change="changeTable">
                    <el-option
                    label="查看待办"
                    :value="'undo'">
                    </el-option>
                    <el-option
                    label="查看已办"
                    :value="'done'">
                    </el-option>
                </el-select> -->
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
           
            <el-table-column prop="shop_name" label="店铺">
            </el-table-column>
           
            <el-table-column prop="iPrice" label="保险卡金额">
            </el-table-column>

            <el-table-column prop="aProce" label="邮品金额">
            </el-table-column>

            <el-table-column prop="totalPrice" label="总价">
            </el-table-column>

            <!-- <el-table-column prop="picList" label="图片">
            </el-table-column> -->
          
            <el-table-column prop="status" label="操作" width="auto">
                <template slot-scope="scope">
                    <el-button size="mini" type="primary" @click="exportZip(scope.row)">导出zip</el-button>
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
            :title="'合同列表'"
            :visible="contractDialogVisible"
            :before-close="closeContractDialog"
            width="900px">
                <send-card-contract-list @refresh="getData" ref="sendCardList"></send-card-contract-list>
            <span slot="footer" class="dialog-footer">
                <el-button @click="contractDialogVisible = false">完 成</el-button>
                <!-- <el-button type="primary" @click="save">确 定</el-button> -->
            </span>
        </el-dialog>
        
        <el-dialog
            class="user-dialog"
            :close-on-click-modal='false'
            :title="'卡号列表'"
            :visible="cardDialogVisible"
            :before-close="closeCardDialog"
            width="900px">
                    <div v-for="(list, i) in cardList" :key="i">{{list.insuranceId}}</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cardDialogVisible = false">完 成</el-button>
                <!-- <el-button type="primary" @click="save">确 定</el-button> -->
            </span>
        </el-dialog>
       
        </div>
    </div>
</template>

<script>
import { 
    guaranteeList,
    addGuaranteeLog,
    guaranteeDetail,
    delGuarantee,
    guaranteeStatus,
    guaranteeFishList,

    countLine,
    getLineContract,
    addLine,
    updateLine,
    delLine,
 } from '../../../api/index';
import {uniqBy, cloneDeep} from 'lodash';
import qs from 'qs';
// import RSA from '../../../utils/rsa'
import SendCardContractList from './SendCardContractList';
export default {
    name: 'ErrorManage',
    components: {
        SendCardContractList,
    },
    data() {
        return {
            showTableStatus: 'undo',
            operate: 'detail',
            tableData: [],
            logList: [],
            page: {
                no: 1,
                total: 0,
                size: 20
            },
          
            form: {
                remark:'',
                processingTime: '',
                picList: []
            },
            detailForm: {},
            sendCardTime: '',
            selectRow: [],
            status: '', // 0下架,1上架
           
            postProd: [],
            cardList: [],
            selectRowId: '',

            contractDialogVisible: false,
            cardDialogVisible: false,
        };
    },
    created() {
        let time = new Date()
        let month = String(time.getMonth() + 1).padLeft(2, '0')
        this.sendCardTime = time.getFullYear() + '-' + month
        this.getData();
    },
    methods: {
        transFormTime(time) {
            if (!time) {return ''}
            var date = new Date(time);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
            var Y = date.getFullYear() + '-';
            var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
            var D = date.getDate() + ' ';
            var h = String(date.getHours()).padLeft(2, '0') +  ':';
            var m = String(date.getMinutes()).padLeft(2, '0') +  ':';
            var s = String(date.getSeconds()).padLeft(2, '0') +  ':';
            return Y + M + D + h + m + s;
        },
    
        checkCardList(row) {
            getLineContract({id: row.id, page: 1, pageSize: 9999}).then(res => {
                this.cardList = res.records
                this.cardDialogVisible = true
            })
        },

        exportZip(row) {
            const link = document.createElement('a');  
                let obj = {
                    createTime: this.sendCardTime,
                    shopId: row.shop_id,
                }
                console.log(obj);
            let str = qs.stringify(obj)
            link.href = 'https://wuyoubao.sankinetwork.com/api/wyht/eportZip?' + str
            // link.href = 'http://2o6465101l.wicp.vip/wyht/eportZip?' + str
            // link.setAttribute('download', name);  
            link.setAttribute('target', '_blank');  
            link.click();
        },
      
        // 修改table
        changeTable(status) {
            this.showTableStatus = status
            this.getData()
        },
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
     
        getStatus(num) {
            let val = Number(num)
            switch(val) {
                case 1:
                    return '申请'
                case 2:
                    return '回退'
                case 3:
                    return '审核'
            }
        },

        // 修改状态
        changeStatus(row, status) {
            guaranteeStatus({id: row.id, status: status}).then(res => {
                this.$message.success('操作成功')
                this.getData()
            })
        },

        search() {
            this.getData()
        },
        handlePageChange(page) {
            this.page.no = page
            this.getData()
        },
        getData() {
            let obj = {
                createTime: this.sendCardTime,
            }
            countLine(obj).then(res => {
                console.log(res.records);
                this.tableData = res
            })
        },

        handleSelectionChange(row){
            this.selectRow = row
        },
       
        edit(row) {
            this.operate = 'edit'
            row.status = Number(row.status)
            this.form = {
                picList: [],
                remark: '',
                processingTime: ''
            }
            this.$nextTick(() => {
                this.$refs.upload.clearPic()
            })
            this.detailForm = cloneDeep(row)
            this.openDialog()
        },
        // 详情
        detail(row, tar) {
            this.contractDialogVisible = true
            this.$nextTick(() => {
                this.$refs.sendCardList.sendCardOperate = 'edit'
                this.$refs.sendCardList.selectContractId = row.id
                this.$refs.sendCardList.getContractData(row.id)  // 获取指定id下合同    
            })
        },
        // 删除记录
        del(row) {
            this.$confirm('确认删除当前发卡申请？').then(_ => {
                let id =  row.id
                let obj = {id: id}
                delLine(obj).then(res => {
                    this.$message.success({message: '删除成功',});
                    this.getData()
                })
            })
            .catch(_ => {});
        },
        // 保存
        save() {
            let params = cloneDeep(this.form)
            if (this.detailForm.id) {
                params.guaranteeId = this.detailForm.id
            }
            if (this.operate == 'edit') {
                addGuaranteeLog(params).then(res => {
                    if (res) {
                        this.$message.success({message: '添加记录成功',});
                        this.dialogVisible = false
                        this.getData()
                    }
                })
            }
        },
        openContractDialog() {
            this.contractDialogVisible = true
        },
        closeContractDialog() {
            this.contractDialogVisible = false
        },
        closeCardDialog() {
            this.cardDialogVisible = false
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
    .el-button + .el-button {
        margin-left: 0;
        margin-right: 10px;
    }

    .el-button {
        margin-right: 10px;
        margin-top: 10px;
    }
    .pic-list {
        width: 330px;
        margin: 0 auto;
    }
    .pic-list .wrapper {
        overflow: visible;
    }
    .pic-list-item {
        position: relative;
        display: inline-block;
        width: 100px;
        height: 100px;  
        margin-right: 10px;
        overflow: visible;
    }

  
</style>
