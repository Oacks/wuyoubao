<template>
    <div class="goods-form">
        <h2>4S店铺管理</h2>
        <hr style="margin-bottom:10px;"/>
        <div class="table-area">
        <div style="margin-bottom:10px;">
            <el-button type="primary" @click="create">新建</el-button>
            <!-- <el-button type="primary" @click="edit">编辑</el-button> -->
    
        </div>
        <div style="margin: 10px 0;">
            <span>
                店铺搜索：
                <el-input v-model="shopName" style="width: 150px;margin:0 10px;"></el-input>
            </span>
            <span>
                品牌搜索：
                <el-input v-model="brand" style="width: 150px;margin:0 10px;"></el-input>
                <el-button icon="el-icon-search" @click="search"></el-button>
            </span>
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

            <el-table-column prop="shopName" label="店铺名称">
            </el-table-column>
            <el-table-column prop="brand" label="品牌">
            </el-table-column>
            <el-table-column label="品牌图片">
                <template slot-scope="scope">
                    <el-image
                        v-show="scope.row.brandPic"
                        style="width: 100px; height: 100px"
                        :src="scope.row.brandPic" 
                        :preview-src-list="[scope.row.brandPic]">
                    </el-image>
                </template>
            </el-table-column>
          
            <!-- <el-table-column prop="status" label="会员状态">
                <template slot-scope="scope">
                    {{scope.row.status == 1  ? '激活' : '注销'}}
                </template>
            </el-table-column> -->
            <el-table-column prop="address" label="地址">
            </el-table-column>
            <el-table-column prop="status" label="操作"
            >
                <template slot-scope="scope">
                    <!-- <el-button type="primary" @click="edit(scope.row)">编辑</el-button> -->
                    <el-button type="primary" @click="detail(scope.row)">编辑查看</el-button>
                    <el-button type="primary" @click="saleDetail(scope.row)">查看销售列表</el-button>
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
            :title="operate === 'create' ? '创建店铺' : operate === 'detail' ? '查看店铺' : '编辑店铺'"
            :visible="dialogVisible"
            :before-close="closeDialog"
            width="800px">
                <el-form :model="form" class="demo-form-inline" label-width="80px">
                    <el-row :gutter="20">
                     
                        <el-col :span="12">
                            <el-form-item label="店铺名称">
                                <el-input v-model="form.shopName"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="品牌" v-if="operate === 'create'">
                                <el-input v-model="form.brand"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item label="地址">
                                <el-input v-model="form.address"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="24">
                            <el-form-item label="品牌图片">
                                <el-image 
                                    v-if="!brandPic && form.brandPic"
                                    class="pic-list-item-img"
                                    :src="form.brandPic"    
                                    :preview-src-list="[form.brandPic]">
                                </el-image>
                                <upload-pic ref="upload" @getUrl="getUrl"></upload-pic>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <el-row>
                        <el-col style="text-align:center; position:relative;" :span="24">
                            <el-form-item label="地图位置" style="text-align: left;">
                                <el-amap-search-box style="position: absolute;top: 25px;left: 40px;" class="search-box" :search-option="searchOption" :on-search-result="onSearchResult"></el-amap-search-box>
                                <el-amap style="display: inline-block; width:600px; height: 318px;" vid="amapDemo" :zoom="12" :center="mapCenter" :events="mapEvents">
                                    <el-amap-marker v-for="(marker,index) in markers" :key="index" :position="marker" ></el-amap-marker>
                                </el-amap>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button v-if="operate == 'create'" type="primary" @click="save">新 建</el-button>
                <el-button v-if="operate == 'edit'" type="primary" @click="save">编 辑</el-button>
            </span>
        </el-dialog>
        <el-dialog
            class="user-dialog"
            :close-on-click-modal='false'
            :title="'销售人员详情'"
            :visible="salerDialogVisible"
            :before-close="closeSalerDialog"
            width="800px">
            <saler-list ref="salerList"></saler-list>
            <span slot="footer" class="dialog-footer">
                <el-button @click="salerDialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>
        </div>
    </div>
</template>

<script>
import { 
    createShop,
    delShop,
    salerList,
    addSaler,
    delSaler,
    updateSaler,
    shopDetail,
    shopList,
    updateShop
 } from '../../../api/index';
import {uniqBy, cloneDeep} from 'lodash';
import UploadPic from './UploadPic';
import SalerList from './SalerList';
// import RSA from '../../../utils/rsa'

export default {
    name: 'userForm',
    components: {
        UploadPic,
        SalerList
    },
    data() {
        return {
            // 地图
            markers: [],
            mapCenter: [113.122717,23.028762],
            searchOption: {
                city: '全国',
                citylimit: false
            },
            mapEvents: {
                init: (o) => {
                    console.log(o.getCenter())
                    // console.log(this.$refs.map.$$getInstance())
                    o.getCity(result => {
                        console.log(result)
                    })
                },
            },
            operate: 'create',
            tableData: [],
            salerTableData: [],
            page: {
                no: 1,
                total: 0,
                size: 20
            },
            form: {
                address: '',
                brand: '',
                brandPic: '',
                lat: '',
                lng: '',
                shopName: '',
                status: '',
                // userIds: '',
            },
            dialogVisible: false,
            salerDialogVisible: false,
            selectRow: [],
            brand: '',
            shopName: '',
            brandPic: '',
        };
    },
    created() {
        this.getData();
    },
    mounted() {
   
    },
    methods: {
        // 地图搜索
        onSearchResult(pois) {
          let latSum = 0;
          let lngSum = 0;
          if (pois.length > 0) {
            pois.forEach(poi => {
              let {lng, lat} = poi;
              lngSum += lng;
              latSum += lat;
              this.markers = [[poi.lng, poi.lat]];
            });
            let center = {
              lng: lngSum / pois.length,
              lat: latSum / pois.length
            };
            this.mapCenter = [center.lng, center.lat];
          }
        },
        
        search() {
            this.getData()
        },
        getUrl(url) {
            this.brandPic = url
            this.form.brandPic = url
        },
        handlePageChange(page) {
            this.page.no = page
            this.getData()
        },
        getData() {
            let obj = {
                pageSize:  this.page.size,
                page:  this.page.no,
                shopName: this.shopName,
                brand: this.brand,
            }
            shopList(obj).then(res => {
                this.tableData = res.records
                this.page.total = res.total
                this.page.no = res.current
            })
        },

        changeLevel(v) {
            this.level = v
            this.getData()
        },

        handleSelectionChange(row){
            this.selectRow = row
        },
        create() {
            this.operate = 'create'
            this.form = {
                address: '',
                brand: '',
                brandPic: '',
                lat: '',
                lng: '',
                shopName: '',
                status: '',
            },
            this.openDialog()
            this.$nextTick(() => {
                this.$refs.upload.clearPic()
            })
        },
        edit(row) {
            this.operate = 'edit'
            row.status = Number(row.status)
            this.form = cloneDeep(row)
            this.openDialog()
        },
        // 查看
        detail(row) {
            shopDetail({id: row.id}).then(res => {
                console.log(res);
                this.operate = 'detail'
                this.mapCenter = [res.lng, res.lat]
                this.form = res
                this.openDialog()
                this.$nextTick(() => {
                    this.$refs.upload.clearPic()
                })
            })
        },
        saleDetail(row) {
            this.salerDialogVisible = true
            this.$nextTick(() => {
                this.$refs.salerList.getData(row)
            })
        },
        del(row) {
            this.$confirm('确认删除当前店铺？').then(_ => {
                let id =  row.id
                let obj = {id: id}
                delShop(obj).then(res => {
                    this.$message.success({message: '删除成功',});
                    this.getData()
                })
            })
            .catch(_ => {});
        },
        // 保存
        save() {
            let params = cloneDeep(this.form)
            params.lng = this.mapCenter[0]
            params.lat = this.mapCenter[1]
            params.brandPic = this.brandPic
            if (this.operate == 'create') {
                let obj = params
                createShop(obj).then(res => {
                    if (res) {
                        this.$message.success({message: '创建成功',});
                        this.dialogVisible = false
                        this.getData()
                    }
                })
            }
            if (this.operate == 'detail') {
                delete params.password
                updateShop(params).then(res => {
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
        closeSalerDialog() {
            this.salerDialogVisible = false
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
    .pic-list-item-img {
        display: inline-block;
        width: 150px;
        height: 150px;
    }

    .el-button:first-child,.el-button + .el-button {
        margin-bottom: 10px;
        margin-left: 0;
        margin-right: 10px;
    }
</style>
