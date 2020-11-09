<template>
    <div class="goods-form">
        <h2>报障管理</h2>
        <hr style="margin-bottom:10px;"/>
        <div class="table-area">
           <div style="margin: 10px;">
               <el-select v-model="showTableStatus" placeholder="请选择" @change="changeTable">
                    <el-option
                    label="查看待办"
                    :value="'undo'">
                    </el-option>
                    <el-option
                    label="查看已办"
                    :value="'done'">
                    </el-option>
                </el-select>
                <el-button @click="getData">刷新</el-button>
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
                        <el-button size="mini" type="primary" @click="detail(scope.row, 'detail')">详情</el-button>
                        <!-- <el-button v-if="scope.row.status !== '0' && scope.row.status != '3' && scope.row.status != '4'" size="mini" type="primary" @click="edit(scope.row)">添加记录</el-button> -->
                        <el-button  v-if="scope.row.status != '0' && scope.row.status != '3' && scope.row.status != '4'" size="mini" type="primary" @click="detail(scope.row, 'logs')">查看记录</el-button>
                        <!-- <el-button v-if="scope.row.status == '0'"  size="mini" type="primary" @click="changeStatus(scope.row, 1)">受理</el-button> -->
                        <!-- <el-button v-if="scope.row.status != '0' && scope.row.status != '3' && scope.row.status != '4'" size="mini" type="success" @click="changeStatus(scope.row, 3)">完成</el-button> -->
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
            :title="'新增记录'"
            :visible="dialogVisible"
            :before-close="closeDialog"
            width="700px">
                <el-form :model="form" class="demo-form-inline" label-width="80px">
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item label="时间记录">
                                <el-date-picker
                                    v-model="form.processingTime"
                                    value-format="yyyy-MM-dd HH:mm:ss"
                                    type="datetime"
                                    placeholder="选择日期时间">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item label="图片">
                                <upload-pic ref="upload" @getUrl="getUrl"></upload-pic>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <el-row :gutter="20">
                        <el-col :span="24">
                            <el-form-item label="记录">
                                <el-input type="textarea" v-model="form.remark"  class="handle-input mr10"></el-input>
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
            :title="'报障单详情'"
            :visible="dialogDetailVisible"
            :before-close="closeDetailDialog"
            width="700px">
                <el-form :model="detailInfo" class="demo-form-inline" label-width="140px">
                    <el-row :gutter="20">
                        <el-col :span="24">
                            <el-form-item label="合同号：">
                                {{detailInfo.detail.contractNo}}
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="24">
                            <el-form-item label="受理时间：">
                                {{detailInfo.detail.createTime}}
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="24">
                            <el-form-item label="车牌：">
                                {{detailInfo.detail.licensePlate}}
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="24">
                            <el-form-item label="用户名称：">
                                {{detailInfo.detail.memberName}}
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="24">
                            <el-form-item label="手机号：">
                                {{detailInfo.detail.mobile}}
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="24">
                            <el-form-item label="原因：">
                                {{detailInfo.detail.reason}}
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="24">
                            <el-form-item label="状态：">
                                {{getStatus(detailInfo.detail.status)}}
                            </el-form-item>
                        </el-col>
                    </el-row>
                    
                    <el-row :gutter="20">
                        <el-col :span="24">
                            <el-form-item label="用户上传报障图片：">
                                <div class="pic-list">
                                        <div class="pic-list-item" v-for="(pic, i) in detailInfo.file" :key="i">
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

                    <!-- <el-row :gutter="20">
                        <el-col :span="24">
                            <el-timeline :reverse="false">
                                <el-timeline-item
                                v-for="(activity, index) in detailInfo.logFile"
                                :key="index"
                                :timestamp="activity.timestamp">
                                {{activity.content}}
                                </el-timeline-item>
                            </el-timeline>
                        </el-col>
                    </el-row> -->
                </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogDetailVisible = false">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog
            class="user-dialog"
            :close-on-click-modal='false'
            :title="'报障详细记录'"
            :visible="dialogLogVisible"
            :before-close="closeLogDialog"
            width="700px">
                <el-table
                    :data="logList"
                    border
                    class="table"
                    ref="multipleTable"
                    row-key="id"
                    header-cell-class-name="table-header"
                    @selection-change="handleSelectionChange"
                >
                    <el-table-column type="selection" width="55" align="center"></el-table-column>

                    <el-table-column prop="remark" label="记录">
                    </el-table-column>

                    <el-table-column prop="processingTime" label="跟进时间">
                    </el-table-column>

                    <el-table-column prop="userName" label="操作人">
                    </el-table-column>

                    <el-table-column prop="picList" label="图片">
                        <template slot-scope="scope">
                            <div class="pic-list-item" v-for="(pic, i) in scope.row.files" :key="i">
                                <!-- <span class="del-icon" @click.stop="delPic(pic, i)">X</span> -->
                                <el-image 
                                    v-if="pic.picUrl"
                                    class="pic-list-item-img"
                                    :src="pic.picUrl" 
                                    :preview-src-list="[pic.picUrl]">
                                </el-image>
                            </div>
                        </template>
                    </el-table-column>

                    <el-table-column  label="操作" width="120">
                        <template slot-scope="scope">
                            <el-button size="mini" type="danger" @click="delLog(scope.row)">删除记录</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogLogVisible = false">确 定</el-button>
            </span>
        </el-dialog>
        </div>
    </div>
</template>

<script>
import { 
    shopGuarantee,
    addGuaranteeLog,
    guaranteeDetail,
    delGuarantee,
    guaranteeStatus,
    shopGuaranteeFishList
 } from '../../../api/index';
import {uniqBy, cloneDeep} from 'lodash';
// import RSA from '../../../utils/rsa'
import UploadPic from './UploadPic';

export default {
    name: 'ErrorManage',
    components: {
        UploadPic
    },
    data() {
        return {
            showTableStatus: 'undo',
            operate: 'detail',
            tableData: [],
            logList: [],
            approvalPic: '',
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
            detailInfo: {
                detail: {},
            },
            dialogVisible: false,
            dialogDetailVisible: false,
            dialogLogVisible: false,
            selectRow: [],
            status: '', // 0下架,1上架
           
            postProd: [],
            cardList: [],
            selectRowId: '',
        };
    },
    created() {
        this.getData();
    },
    methods: {
        getUrl(url) {
            this.approvalPic = url
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
                // 1已受理，2处理中，0申请，3完成,4取消
                // 取消系客户系小程序点噶,我比左修改接口你修改下status比我就行
                // 1,3就你控制比我
                case 0:
                    return '申请'
                case 1:
                    return '已受理'
                case 2:
                    return '处理中'
                case 3:
                    return '完成'
                case 4:
                    return '取消'
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
                page: this.page.no,
                pageSize: this.page.size,
                contractNo: ''
            }
            if (this.showTableStatus == 'undo') {
                shopGuarantee(obj).then(res => {
                    console.log(res.records);
                    this.tableData = res.records
                    this.page.total = res.total
                    this.page.no = res.current
                })
            }
            else if (this.showTableStatus == 'done') {
                shopGuaranteeFishList(obj).then(res => {
                    console.log(res.records);
                    this.tableData = res.records
                    this.page.total = res.total
                    this.page.no = res.current
                })
            }
        },

        handleSelectionChange(row){
            this.selectRow = cloneDeep(row)
        },
       
        edit(row) {
            this.operate = 'edit'
            row.status = Number(row.status)
            this.approvalPic = ''
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
            this.selectRowId = row.id
            guaranteeDetail({id: row.id}).then(res => {
                this.detailInfo = res
                this.logList = res.logFile || []
                if (tar == 'detail') {
                    this.dialogDetailVisible = true
                }
                if (tar == 'logs') {
                    this.dialogLogVisible = true
                }
            })
        },
        // 删除记录
        delLog(row) {
            this.$confirm('确认删除当前报障单？').then(_ => {
                let id =  row.id
                let obj = {id: id}
                delGuarantee(obj).then(res => {
                    this.$message.success({message: '删除成功',});
                    this.detail({id: this.selectRowId}, 'logs')
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
            params.picList = [this.approvalPic]
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
        openDialog() {
            this.dialogVisible = true
        },
        closeDialog() {
            this.dialogVisible = false
        },
        closeLogDialog() {
            this.dialogLogVisible = false
        },
        closeDetailDialog() {
            this.dialogDetailVisible = false
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
    .pic-list-item-img {
        display: inline-block;
        width: 100px;
        height: 100px;  
    }

  
</style>
