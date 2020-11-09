<template>
    <div class="goods-form">
        <div style="margin: 10px 0;">
            <el-form :model="searchForm" class="demo-form-inline" label-width="120px">
                <!-- <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="合同创建时间">
                            <el-date-picker
                            style="width: 100%;"
                            v-model="contractTime"
                            type="datetimerange"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item label="合同有效时间">
                            <el-date-picker
                            v-model="contractValid"
                            style="width: 100%;"
                            type="datetimerange"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row> -->
                <el-row>
                    <el-col :span="8">
                        <!-- <el-form-item label="合同状态">
                            <el-select v-model="status" placeholder="请选择">
                                <el-option
                                v-for="item in statusOpt"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item> -->
                    </el-col>
                    <el-col :span="8">
                        <!-- <el-form-item label="会员姓名">
                            <el-input v-model="name"></el-input>
                        </el-form-item> -->
                    </el-col>
                    <div>
                        <!-- <el-button type="primary" @click="">新建</el-button> -->
                        <!-- <el-button style="margin-left:40px;" type="primary" icon="el-icon-search" @click="search">搜索</el-button> -->
                        <el-button v-if="sendCardOperate == 'create'" style="margin-left:40px;" type="primary" @click="sendCard">申请发卡</el-button>
                        <!-- <el-button v-if="sendCardOperate == 'edit'" style="margin-left:40px;" type="success" @click="editSendCard">修改发卡</el-button> -->
                    </div>
                </el-row>
            </el-form>
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
            <!-- <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column> -->
            <!-- <el-table-column type="index" label="序号" width="55" align="center"></el-table-column> -->

            <el-table-column prop="id" label="合同号">
            </el-table-column>
          
            <el-table-column prop="memberName" label="客户名">
                <!-- <template slot-scope="scope">
                    {{scope.row.status == 1  ? '激活' : '注销'}}
                </template> -->
            </el-table-column>
            <!-- <el-table-column prop="status" label="合同状态">
                 <template slot-scope="scope">
                    {{getStatus(scope.row.status)}}
                </template>
            </el-table-column> -->
            <el-table-column prop="price" label="合同金额">
            </el-table-column>

            <el-table-column prop="status" label="操作">
                <template slot-scope="scope">
                    <div style="white-space: nowrap;">
                        <!-- <el-button type="primary" @click="edit(scope.row)">编辑</el-button> -->
                        <!-- <a style="margin-right:5px;" href="javascript:;" type="primary" @click="detail(scope.row)">查看</a> -->
                        <el-button size="mini" type="primary" @click="detail(scope.row)">查看详情</el-button>
                    </div>
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
            :title=" operate === 'detail' ? '查看合同' : ''"
            :visible="dialogVisible"
            :before-close="closeDialog"
            append-to-body
            width="900px">
                <el-form :model="detailInfo" class="demo-form-inline" label-width="140px">
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item label="合同号：">
                                {{detailInfo.contractNo}}
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item label="车主姓名：">
                                {{detailInfo.memberName}}
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="联系电话：">
                                {{detailInfo.mobile}}
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item label="联系地址：">
                                {{detailInfo.address}}
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item label="车辆品牌：">
                                {{detailInfo.brand}}
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="车辆型号：">
                                {{detailInfo.vehicle}}
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item label="车辆购买时间：">
                                {{detailInfo.carBuyTime}}
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="车辆类型：">
                                {{detailInfo.carType == '0' ? '新车' : detailInfo.carType == '1' ? '旧车' : ''}}
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item label="原厂保修起始日期：">
                                {{detailInfo.oldStartTime}}
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="原厂保修结束日期：">
                                {{detailInfo.oldEndTime}}
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item label="车架号（VIN）：">
                                {{(detailInfo.vin)}}
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="发动机号：">
                                {{(detailInfo.engineNum)}}
                            </el-form-item>
                        </el-col>
                    </el-row>
                    
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item label="车牌号码：">
                                {{(detailInfo.licensePlate)}}
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="车辆售出价格：">
                                {{(detailInfo.carPrice)}}
                            </el-form-item>
                        </el-col>
                    </el-row>
                    
                    
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item label="延保销售日期">
                                {{(detailInfo.createTime)}}
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="延保卡券：">
                                {{(detailInfo.projectId)}}
                            </el-form-item>
                        </el-col>
                    </el-row>

                  

                    <el-row :gutter="20">
                        <!-- <el-col :span="12">
                            <el-form-item label="延保起期：">
                                {{(detailInfo.startTime)}}
                            </el-form-item>
                        </el-col> -->
                        <el-col :span="12">
                            <el-form-item label="行驶里程：">
                                {{(detailInfo.mileage)}}
                            </el-form-item>
                        </el-col>
                    </el-row>

                      <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item :label="detailInfo.status != 4 ? '邮品：' : '邮品卡号：'">
                                <div v-if="detailInfo.status != 4">
                                    <div  v-for="(post,i) in detailInfo.accessoriesList" :key="i">{{post.title}}</div>
                                </div>
                                <div v-if="detailInfo.status == 4">
                                    <div v-for="(post,i) in detailInfo.saleList" v-if="post.saleType == 1" :key="i">{{post.title}}</div>
                                </div>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <!-- <el-row :gutter="20">
                        <el-col :span="24">
                            <el-form-item label="合同图片：">
                                <div class="pic-list">
                                    <el-image 
                                        class="pic-list-item-img"
                                        :src="detailInfo.pic" 
                                        :preview-src-list="[detailInfo.pic]">
                                    </el-image>
                                </div>
                            </el-form-item>
                        </el-col>
                    </el-row> -->
                </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
            </span>
        </el-dialog>
        <el-dialog
            class="user-dialog"
            :close-on-click-modal='false'
            :title="'审批资料'"
            :visible="approvalDialogVisible"
            :before-close="closeApprovalDialog"
            width="700px">
            <el-form :model="form" class="demo-form-inline" label-width="120px">
                <el-row :gutter="20">
                    <el-col :span="24">
                        <el-form-item label="合同图片上传">
                            <upload-pic ref="upload" @getUrl="getUrl"></upload-pic>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="approvalDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="approval">提交审批</el-button>
            </span>
        </el-dialog>
        <el-dialog
            class="user-dialog"
            :close-on-click-modal='false'
            :title="'合同图片'"
            :visible="contractDialogVisible"
            :before-close="closeContractDialog"
            append-to-body
            width="700px">
                <el-image class="stamp-pic" :src="contractPic"></el-image>
            <span slot="footer" class="dialog-footer">
                <el-button @click="contractDialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { 
    contractDetail,
    contractList,
    approval,
    exportContract,

    rzLine,
    getLineContract,
    addLine,
    updateLine,
    delLine,
 } from '../../../api/index';
import {uniqBy, cloneDeep} from 'lodash';
import UploadPic from './UploadPic';
// import RSA from '../../../utils/rsa'

export default {
    name: 'SendCardContractList',
    components: {
        UploadPic
    },
    data() {
        return {
            sendCardOperate: 'create',
            contractDialogVisible: false,
            contractPic:'',
            operate: 'detail',
            tableData: [],
            name: '',
            detailInfo: {},
            page: {
                no: 1,
                total: 0,
                size: 20
            },
            searchForm: {
                contractEndTime: '',
                contractStartTime: '',
                endTime: '',
                memberName: '',
                startTime: '',
                status: '',
            },
            form: {
                address: '',
                brand: '',
                brandPic: '',
                lat: '',
                lng: '',
                status: '',
                // userIds: '',
            },
            selectContractId: '',
            dialogVisible: false,
            approvalDialogVisible: false,
            selectRow: [],
            contractValid: [], // 合同有效期
            contractTime: [], // 合同时间
            status: '3', // 状态
            name: '', // 会员名字
            approvalPic: '',
            approvalId: '',
            statusOpt: [
                // {
                //     value: '0',
                //     label: '草稿'
                // },
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
                // {
                //     value: '5',
                //     label: '生效'
                // },
            ]
        };
    },
    created() {
        // this.getData();
    },
    methods: {
        getUrl(url) {
            this.approvalPic = url
        },
        // 审批dialog
        approvalReady(row) {
            this.approvalId = row.id
            this.approvalDialogVisible = true
            this.$nextTick(() => {
                this.$refs.upload.clearPic()
            })
        },
        closeApprovalDialog() {
            this.approvalDialogVisible = false
        },
        // 下载合同
        exportContract(row) {
            // exportContract({id: row.id}).then(res=> {})
            const link = document.createElement('a');  
            link.href = 'https://wuyoubao.sankinetwork.com/api/wyht/eportContract?id=' + row.id 
            // link.href = 'http://2o6465101l.wicp.vip/wyht/eportContract?id=' + row.id 
            link.setAttribute('download', name);  
            document.body.appendChild(link);  
            link.click();
        },
        getStatus(status) {
            for (let i = 0; i < this.statusOpt.length; i++) {
                const element = this.statusOpt[i];
                if (status == element.value) {
                    return element.label
                }
            }
        },
        approval() {
            if (this.approvalPic == '') {
                this.$message.warning({message: '请先上传合同图片',});
                return
            }
            let param = {
                id: this.approvalId,
                status: '2',
                pic: this.approvalPic
            }
            approval(param).then(res => {
                this.$message.success({message: '提交审批成功'});
                this.closeApprovalDialog()
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
        // 获取发卡申请合同详情
        getContractData(id) {
            getLineContract({id: id, page:1, pageSize: 99999}).then(res => {
                console.log(res);
                this.tableData = res.records
                this.page.total = res.total
                this.page.no = res.current
            })
        },
        getData() {
            let obj = {
                pageSize:  100000,
                page:  this.page.no,
                contractEndTime: this.contractValid[1] || '',
                contractStartTime: this.contractValid[0] || '',
                memberName: this.name,
                startTime: this.contractTime[0] || '',
                endTime: this.contractTime[1] || '',
                status: this.status,
            }
            contractList(obj).then(res => {
                this.tableData = res.records
                this.page.total = res.total
                this.page.no = res.current
            })
        },

        handleSelectionChange(row){
            this.selectRow = row
        },

        // 发卡
        sendCard() {
            if (!this.selectRow) {
                this.$message.warning('请先选择要申请发卡的合同')
            }
            let list = []
            for (let i = 0; i < this.selectRow.length; i++) {
                const element = this.selectRow[i];
                console.log(element);
                list.push(element.id)
            }
            try {
                let strList = JSON.stringify(list)
                addLine(strList).then(res => {
                    this.$emit('refresh')
                    this.$message.success('申请成功')
                    this.getData()
                })
            }
            catch(err) {
                console.log(err);
            }
        },

        editSendCard() {
            if (!this.selectRow) {
                this.$message.warning('请先选择本次要发卡的合同')
            }
            let list = []
            for (let i = 0; i < this.selectRow.length; i++) {
                const element = this.selectRow[i];
                console.log(element);
                list.push(element.id)
            }
            try {
                let strList = JSON.stringify(list)
                let param = {
                    id: this.selectContractId,
                    ids: list
                }
                updateLine(param).then(res => {
                    this.$emit('refresh')
                    this.$message.success('修改成功')
                    this.getContractData(this.selectContractId)
                })
            }
            catch(err) {
                console.log(err);
            }
        },
     
        edit(row) {
            this.operate = 'edit'
            row.status = Number(row.status)
            this.form = cloneDeep(row)
            this.openDialog()
        },
        // 详情
        detail(row) {
            contractDetail({id:row.id}).then(res => {
                this.detailInfo = res.contract
                this.operate = 'detail'
                this.form = res
                this.openDialog()
            })
        },
        // 保存
        save() {
            let params = cloneDeep(this.form)
        
            if (this.operate == 'edit') {
                userUpdate(params).then(res => {
                    if (res) {
                        this.$message.success({message: '修改成功',});
                        this.dialogVisible = false
                        this.getData()
                    }
                })
            }
        },
        showContract(row) {
            this.contractDialogVisible = true
            this.contractPic = row.pic
        },
        closeContractDialog() {
            this.contractDialogVisible = false
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
