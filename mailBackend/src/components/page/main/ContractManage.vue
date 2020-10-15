<template>
    <div class="goods-form">
        <h2>合同管理</h2>
        <hr style="margin-bottom:10px;"/>
        <div class="table-area">
      
        <div style="margin: 10px 0;">
            <el-form :model="searchForm" class="demo-form-inline" label-width="80px">
                <!-- <el-col :span="12">
                    <el-form-item label="合同创建时间">
                        <el-date-picker
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
                        type="datetimerange"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                        </el-date-picker>
                    </el-form-item>
                </el-col> -->
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
                <el-button style="margin-left:20px;" type="primary" icon="el-icon-search" @click="search">搜索</el-button>

                    <!-- <el-col :span="12">
                        <el-form-item label="会员姓名">
                            <el-input :value="name"></el-input>
                        </el-form-item>
                    </el-col> -->
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

            <el-table-column prop="contractNo" label="合同号">
            </el-table-column>
          
            <el-table-column prop="memberName" label="客户名">
                <!-- <template slot-scope="scope">
                    {{scope.row.status == 1  ? '激活' : '注销'}}
                </template> -->
            </el-table-column>
            <el-table-column prop="status" label="合同状态">
                 <template slot-scope="scope">
                    {{getStatus(scope.row.status)}}
                </template>
            </el-table-column>
            <el-table-column prop="status" label="操作">
                <template slot-scope="scope">
                    <!-- <el-button type="primary" @click="edit(scope.row)">编辑</el-button> -->
                    <el-button type="primary" @click="detail(scope.row)">查看</el-button>
                    <el-button v-if="scope.row.status == '2'" type="success" @click="showStamp(scope.row)">生成盖章合同</el-button>
                    <el-button v-if="scope.row.status == '2'" type="success" @click="approvalReady(scope.row)">审批</el-button>
                    <el-button v-if="scope.row.status == '3'" type="success" @click="sendCard(scope.row)">发卡</el-button>
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
            width="700px">
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
                        <el-col :span="12">
                            <el-form-item label="延保起期：">
                                {{(detailInfo.startTime)}}
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
            :title="'审批资料'"
            :visible="approvalDialogVisible"
            :before-close="closeApprovalDialog"
            width="700px">
            <el-form :model="form" class="demo-form-inline" label-width="130px">
                <el-row :gutter="20">
                    <el-col :span="24">
                        <el-form-item label="审批意见">
                            <el-input v-model="approvalRemark"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="24">
                        <el-form-item label="盖章合同图片上传">
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
            :title="'盖章图片'"
            :visible="stampDialogVisible"
            :before-close="closeStampDialog"
            append-to-body
            width="700px">
                <el-image class="stamp-pic" :src="b64"></el-image>
            <span slot="footer" class="dialog-footer">
                <el-button @click="stampDialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>
        </div>
    </div>
</template>

<script>
import { 
    contractList,
    approval,
    sendCard,
    contractDetail
 } from '../../../api/index';
import {uniqBy, cloneDeep} from 'lodash';
import UploadPic from './UploadPic';
import { MCanvas } from 'mcanvas'
export default {
    name: 'Contract',
    components: {
        UploadPic
    },
    data() {
        return {
            b64: '',
            operate: 'detail',
            detailInfo: {},
            tableData: [],
            approvalRemark: '',
            approvalId: '',
            approvalPic: '',
            page: {
                no: 1,
                total: 0,
                size: 20
            },
            searchForm: {
                // contractEndTime: '',
                // contractStartTime: '',
                // endTime: '',
                // memberName: '',
                // startTime: '',
                status: '2',
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
            approvalDialogVisible: false,
            stampDialogVisible: false,
            selectRow: [],
            contractValid: [], // 合同有效期
            contractTime: [], // 合同时间
            status: '2', // 状态
            name: '', // 会员名字
            statusOpt: [
                // {
                //     value: '0',
                //     label: '草稿'
                // },
                // {
                //     value: '1',
                //     label: '申请'
                // },
                {
                    value: '2',
                    label: '审批盖章'
                },
                {
                    value: '3',
                    label: '合同审核'
                },
                {
                    value: '4',
                    label: '发卡'
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
        // 展示合同
        showStamp(row) {
            this.stampDialogVisible = true
            this.stamp(row.pic)
        },
        // 发卡
        sendCard(row) {
            let param = {
                contractId: row.id,
                insuranceId: row.insuranceId,
                // pic: '',
                status: '4'
            }
            sendCard(param).then(res => {
                this.$message.success('发卡成功')
                this.getData()
                console.log(res);
            })
        },
        getUrl(url) {
            this.approvalPic = url
        },
        // 审批dialog
        approvalReady(row) {
            this.approvalId = row.id
            this.approvalRemark = '',
            this.approvalPic = '',
            this.approvalDialogVisible = true
            this.$nextTick(() => {
                this.$refs.upload.clearPic()
            })
        },
        closeApprovalDialog() {
            this.approvalDialogVisible = false
        },
        closeStampDialog() {
            this.stampDialogVisible = false
        },
        getStatus(status) {
            for (let i = 0; i < this.statusOpt.length; i++) {
                const element = this.statusOpt[i];
                if (status == element.value) {
                    return element.label
                }
            }
        },
        approval(row) {
            if (this.approvalPic == '') {
                this.$message.warning({message: '请先上传合同图片',});
                return
            }
            let param = {
                id: this.approvalId,
                remark: this.approvalRemark,
                status: '3',
                pic: this.approvalPic

            }
            approval(param).then(res => {
                this.$message.success({message: '审批成功'});
                this.closeApprovalDialog()
                this.getData()
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
                pageSize:  this.page.size,
                page:  this.page.no,
                contractEndTime: this.contractValid[1] || '',
                contractStartTime: this.contractValid[0] || '',
                memberName: this.name,
                startTime: this.contractTime[0] || '',
                endTime: this.contractTime[1] || '',
                status: this.status,
            }
            contractList(obj).then(res => {
                let arr = res.records.filter(element => {
                    return (element.status != '0' && element.status != '1')
                });
                this.tableData = arr
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
            this.form = row
            this.openDialog()
        },
        // 详情
        detail(row) {
            contractDetail({id: row.id}).then(res => {
                console.log(res);
                this.detailInfo = res.contract
                this.detailInfo.accessoriesList = res.accessories
                this.operate = 'detail'
                this.form = res
                this.openDialog()
            })
        },
        del(row) {
            this.operate = 'edit'
            row.status = Number(row.status)
            this.form = row
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
        openDialog() {
            this.dialogVisible = true
        },
        closeDialog() {
            this.dialogVisible = false
        },
        async stamp(url) {
            const mc = new MCanvas({
                width: 500,
                height: 1000,
                backgroundColor: 'white',
            });

            // background : 准备底图；提供多种模式
            mc.background(url,{
                left: 0,
                top: 0,
                color: '#fff',
                type: 'crop',
            })
          
            // add 添加图片素材基础函数；
            mc.add('http://storage.sankinetwork.com/wuyoubao-mail-post.png',{
                width: 200,
                height: 30,
                pos: {
                    x: 20,
                    y: 900,
                    scale: 1,
                    rotate: 1,
                },
            })
            const b64 = await mc.draw({});
            this.b64 = b64
        }
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
    .stamp-pic {
        width: 500px;
        height: 1000px;
    }
    .el-button {
        margin-bottom: 10px;
        margin-right: 10px;
    }
    .el-button + .el-button {
        margin-left: 0;
    }
</style>
