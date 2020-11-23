<template>
    <div class="goods-form">
        <h2>合同管理</h2>
        <hr style="margin-bottom:10px;"/>
        <div class="table-area">
      
        <div style="margin: 10px 0;">
            <el-form :model="searchForm" class="demo-form-inline" label-width="120px">
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="合同时间">
                            <el-date-picker
                            style="width: 100%;"
                            v-model="contractTime"
                            type="daterange"
                            value-format="yyyy-MM-dd"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <!-- <el-col :span="11">
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
                    </el-col> -->
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="合同状态">
                            <el-select v-model="status" placeholder="请选择">
                                <el-option
                                v-for="item in statusOpt"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="会员姓名">
                            <el-input v-model="name"></el-input>
                        </el-form-item>
                    </el-col>
                    <div>
                        <!-- <el-button type="primary" @click="">新建</el-button> -->
                        <el-button style="margin-left:40px; margin-top:0;" type="primary" icon="el-icon-search" @click="search">搜索</el-button>
                        <el-button style="margin-top:0;" type="success" @click="exportContract">导出</el-button>
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
<!-- 
            <el-table-column prop="contractNo" label="合同号">
            </el-table-column> -->
          
            <el-table-column prop="memberName" label="客户名">
            </el-table-column>
            <el-table-column prop="status" label="合同状态">
                 <template slot-scope="scope">
                    {{getStatus(scope.row.status)}}
                </template>
            </el-table-column>
            <el-table-column prop="shopName" label="4S店">
            </el-table-column>
            <el-table-column prop="createTime" label="下单时间">
            </el-table-column>
            <el-table-column prop="mobile" label="客户电话号码">
            </el-table-column>
            <el-table-column prop="insuranceId" label="延保卡号">
            </el-table-column>
            <el-table-column prop="engineNum" label="发动机号">
            </el-table-column>
            <el-table-column prop="memberName" label="车辆型号/品牌">
                <template slot-scope="scope">
                    {{scope.row.vehicle}}/{{scope.row.brand}}
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <div >
                        <!-- <el-button type="primary" @click="edit(scope.row)">编辑</el-button> -->
                        <!-- <a style="margin-right:5px;" href="javascript:;" type="primary" @click="detail(scope.row)">查看</a> -->
                        <el-button size="mini" type="primary" @click="detail(scope.row)">查看详情</el-button>
                        <el-button size="mini" type="primary" v-if="scope.row.status == '4'" @click="checkMaintain(scope.row)">查看维修记录</el-button>
                        <el-button size="mini" v-if="scope.row.status == '0'" type="success" @click="approval(scope.row)">审批</el-button>
                        <el-button size="mini" v-if="scope.row.status == '0'" type="danger" @click="reback(scope.row)">不同意</el-button>
                        <el-button size="mini" v-if="scope.row.status == '3' || scope.row.status == '4'" type="success" @click="showContract(scope.row)">查看合同</el-button>
                        <!-- <el-button size="mini" v-if="scope.row.status == '2'" type="success" @click="uploadContract(scope.row)">上传合同</el-button> -->
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
                                <span>{{(detailInfo.insuranceId)}}</span>
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
                            <el-form-item label="销售价格：">
                                <span>{{(detailInfo.price)}}</span>
                            </el-form-item>
                        </el-col>
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

                    <el-row :gutter="20">
                        <el-col :span="24">
                            <el-form-item label="图片信息">
                                <div class="pic-list" v-for="(pic, i) in detailInfo.picList" :key="i">
                                    <!-- <div v-if="i === 0">身份证正面：</div>
                                    <div v-if="i === 1">身份证反面：</div>
                                    <div v-if="i === 2">行驶证正页：</div>
                                    <div v-if="i === 3">车身（车头）照片：</div>
                                    <div v-if="i === 4">车身（车尾）照片：</div>
                                    <div v-if="i === 5">仪表盘照片：</div> -->
                                    <el-image 
                                        v-if="pic.pic"
                                        class="pic-list-item-img"
                                        :src="pic.pic" 
                                        :preview-src-list="[pic.pic]">
                                    </el-image>
                                </div>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <!-- <el-button type="primary" @click="save">确 定</el-button> -->
            </span>
        </el-dialog>
       
        <el-dialog
            class="user-dialog"
            :close-on-click-modal='false'
            :title="'合同图片'"
            :visible="contractDialogVisible"
            :before-close="closeContractDialog"
            append-to-body
            width="900px">
                <contract-pic ref="contract" :status="selectStatus" :selectContractData="selectContractData"></contract-pic>
                <!-- <el-image class="stamp-pic" :src="contractPic"></el-image> -->
            <span slot="footer" class="dialog-footer">
                <el-button type="success" @click="exportPDF">导 出</el-button>
                <el-button @click="contractDialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog
            class="user-dialog"
            :close-on-click-modal='false'
            :title="'维修记录'"
            :visible="maintainDialogVisible"
            :before-close="closeMaintainDialog"
            width="900px">
            
            <el-table
                :data="mainTainTableData"
                border
                class="table"
                ref="multipleTable"
                row-key="id"
                header-cell-class-name="table-header"
            >
            <!-- <el-table-column type="selection" width="55" align="center"></el-table-column> -->

            <el-table-column prop="contractNo" label="报修合同号" width="260">
            </el-table-column>

            <el-table-column prop="licensePlate" label="车牌">
            </el-table-column>

            <el-table-column prop="memberName" label="客户名">
            </el-table-column>

            <el-table-column prop="mobile" label="联系电话" width="130">
            </el-table-column>
          
            <el-table-column prop="reason" label="原因">
            </el-table-column>

            <el-table-column label="状态">
                <template slot-scope="scope">
                    {{getStatus(scope.row.status)}}
                </template>
            </el-table-column>

            <!-- <el-table-column prop="picList" label="图片">
            </el-table-column> -->
          
            <el-table-column prop="status" label="操作" width="auto">
                <template slot-scope="scope">
                        <el-button size="mini" type="primary" @click="mainTainDetail(scope.row, 'detail')">详情</el-button>
                        <!-- <el-button  v-if="scope.row.status != '0' && scope.row.status != '3' && scope.row.status != '4'" size="mini" type="primary" @click="detail(scope.row, 'logs')">查看记录</el-button> -->
                </template>
            </el-table-column>
        </el-table>

        <div class="pagination">
            <el-pagination
                background
                layout="total, prev, pager, next"
                :current-page="mainTainPage.no"
                :page-size="mainTainPage.size"
                :total="mainTainPage.total"
                @current-change="handleMaintainPageChange"
            ></el-pagination>
        </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="maintainDialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog
            class="user-dialog"
            :close-on-click-modal='false'
            :title="'报障单详情'"
            :visible="dialogMaintainDetailVisible"
            :before-close="closeMaintainDetailDialog"
            append-to-body
            width="700px">
                <el-form :model="detailMaintainInfo" class="demo-form-inline" label-width="140px">
                    <el-row :gutter="20">
                        <el-col :span="24">
                            <el-form-item label="合同号：">
                                {{detailMaintainInfo.detail.contractNo}}
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="24">
                            <el-form-item label="受理时间：">
                                {{detailMaintainInfo.detail.createTime}}
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="24">
                            <el-form-item label="车牌：">
                                {{detailMaintainInfo.detail.licensePlate}}
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="24">
                            <el-form-item label="用户名称：">
                                {{detailMaintainInfo.detail.memberName}}
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="24">
                            <el-form-item label="手机号：">
                                {{detailMaintainInfo.detail.mobile}}
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="24">
                            <el-form-item label="原因：">
                                {{detailMaintainInfo.detail.reason}}
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="24">
                            <el-form-item label="状态：">
                                {{getStatus(detailMaintainInfo.detail.status)}}
                            </el-form-item>
                        </el-col>
                    </el-row>
                    
                    <el-row :gutter="20">
                        <el-col :span="24">
                            <el-form-item label="用户上传报障图片：">
                                <div class="pic-list">
                                        <div class="pic-list-item" v-for="(pic, i) in detailMaintainInfo.file" :key="i">
                                            <!-- <span class="del-icon" @click.stop="delPic(pic, i)">X</span> -->
                                            <el-image 
                                                class="pic-list-item-img"
                                                :src="pic.picUrl" 
                                                :preview-src-list="[pic.picUrl]">
                                            </el-image>
                                        </div>
                                </div>
                            </el-form-item>
                        </el-col>
                    </el-row>

                </el-form>
        </el-dialog>
        </div>
    </div>
</template>

<script>
import { 
    contractDetail,
    contractList,
    approval,
    eportData,
    guaranteeList,
    guaranteeDetail
 } from '../../../api/index';
import {uniqBy, cloneDeep} from 'lodash';
import UploadPic from './UploadPic';
import qs from 'qs'
// import RSA from '../../../utils/rsa'
import ContractPic from '../main/ContractPic';

export default {
    name: 'Contract',
    components: {
        UploadPic,
        ContractPic
    },
    data() {
        return {
            contractDialogVisible: false,
            contractPic:'',
            selectStatus: '', // 选中的合同的状态
            selectId: '',
            selectContractData: {},
            operate: 'detail',
            tableData: [],
            name: '',
            detailInfo: {},
            detailMaintainInfo: {
                detail: {},
                file: []
            },
            logList: [],
            mainTainTableData: [],
            mainTainPage: {
                no: 1,
                total: 0,
                size: 20
            },
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
            dialogVisible: false,
            maintainDialogVisible: false,
            dialogMaintainDetailVisible: false,
            mainTainContractNo: '',
            selectRow: [],
            contractValid: [], // 合同有效期
            contractTime: [], // 合同时间
            status: '0,1,2,3,4,7', // 状态
            name: '', // 会员名字
            approvalPic: '',
            approvalId: '',
            statusOpt: [
                // 0受理中,4起保
                // 12保单确认
                // 3未启保
                {
                    value: '0,1,2,3,4,7',
                    label: '全部'
                },
                {
                    value: '0',
                    label: '申请'
                },
                {
                    value: '1',
                    label: '不同意'
                },
                {
                    value: '2',
                    label: '受理审核中'
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
                    value: '7',
                    label: '锁定'
                },
                // {
                //     value: '5',
                //     label: '生效'
                // },
            ]
        };
    },
    created() {
        this.getData();
    },
    methods: {
        // 关闭维修详情
        closeMaintainDetailDialog() {
            this.dialogMaintainDetailVisible = false
        },
        // 详情
        mainTainDetail(row, tar) {
            this.dialogMaintainDetailVisible = true
            guaranteeDetail({id: row.id}).then(res => {
                this.detailMaintainInfo = res
                this.logList = res.logFile || []
                if (tar == 'detail') {
                    this.dialogDetailVisible = true
                }
                if (tar == 'logs') {
                    // this.dialogLogVisible = true
                }
            })
        },
        handleMaintainPageChange(page) {
            this.mainTainPage.no = page
            this.getMainTainData(this.mainTainContractNo)
        },
        getMainTainData(no) {
            let obj = {
                page: this.mainTainPage.no,
                pageSize: this.mainTainPage.size,
                contractNo: no
            }
            this.mainTainContractNo = no
            guaranteeList(obj).then(res => {
                this.mainTainTableData = res.records
                this.mainTainPage.total = res.total
                this.mainTainPage.no = res.current
            })
        },
        // 查看维修列表
        checkMaintain(row) {
            this.getMainTainData(row.contractNo)
            this.maintainDialogVisible = true
        },
        closeMaintainDialog() {
            this.maintainDialogVisible = false
        },
        // 图片展示
        getUrl(url) {
            this.approvalPic = url
        },
        reback(row) {
            this.$confirm('确认不同意当前合同？').then(_ => {
                let id =  row.id
                let param = {
                    id: row.id,
                    status: '1',
                    pic: ''
                }
                approval(param).then(res => {
                    this.$message.success({message: '操作成功',});
                    this.getData()
                })
            })
            .catch(_ => {});
        },
        // 下载合同pdf
        exportPDF () {
            const link = document.createElement('a');  
                let obj = {
                    id: this.selectId,
                }
            let str = qs.stringify(obj)
            link.href = 'https://wuyoubao.sankinetwork.com/api/wyht/eportPdf?' + str
            // link.href = 'http://2o6465101l.wicp.vip/wyht/eportPdf?' + str
            // link.setAttribute('download', name);  
            link.setAttribute('target', '_blank');  
            link.click();
        },
        // 下载合同
        exportContract() {
            const link = document.createElement('a');  
                let obj = {
                    startTime: this.contractTime ? this.contractTime[0] : '',
                    endTime: this.contractTime ? this.contractTime[1] : '',
                    page: this.page.no,
                    pageSize: this.page.size,
                    status: this.status,
                    memberName: this.name || ''
                }
            let str = qs.stringify(obj)
            link.href = 'https://wuyoubao.sankinetwork.com/api/wyht/eportContract?' + str
            // link.href = 'http://2o6465101l.wicp.vip/wyht/eportContract?' + str
            // link.setAttribute('download', name);  
            link.setAttribute('target', '_blank');  
            link.click();
        },
        getStatus(status) {
            if (status === '') {return ''} 
            for (let i = 0; i < this.statusOpt.length; i++) {
                const element = this.statusOpt[i];
                if (status == element.value) {
                    return element.label
                }
            }
        },
      
        approval(row) {
            let param = {
                id: row.id,
                status: '2',
                pic: ''
            }
            approval(param).then(res => {
                this.$message.success({message: '提交审批成功'});
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
                pageSize:  this.page.size,
                page:  this.page.no,
                contractEndTime: this.contractValid ? this.contractValid[1] : '',
                contractStartTime: this.contractValid ? this.contractValid[0] : '',
                memberName: this.name,
                startTime: this.contractTime ? this.contractTime[0] : '',
                endTime: this.contractTime ? this.contractTime[1] : '',
                status: this.status,
            }
            contractList(obj).then(res => {
                this.tableData = res.records
                this.page.total = res.total
                this.page.no = res.current
            })
        },

        handleSelectionChange(row){
            this.selectRow = cloneDeep(row)
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
                this.detailInfo = res
                this.operate = 'detail'
                this.form = res
                this.openDialog()
            })
        },
        del(row) {
            this.operate = 'edit'
            row.status = Number(row.status)
            this.form = cloneDeep(row)
            this.form.status = 0
            this.save()
        },
        // 保存
        save() {
            let params = cloneDeep(this.form)
        
            if (this.operate == 'edit') {
                delete params.password
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
            this.selectId = row.id
            eportData({id:row.id}).then(res => {
                this.selectContractData = res
                this.selectStatus = row.status
                this.contractDialogVisible = true
                this.$nextTick(() => {
                    this.$refs.contract.createPic()
                })
            })
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
    .el-button {
        margin-left: 0;
        margin-top: 10px;
        margin-right: 10px;
    }
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
    .pic-list-item-img {
        width: 200px;
        height: 200px;
    }
</style>
