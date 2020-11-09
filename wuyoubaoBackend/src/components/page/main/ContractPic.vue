<template>
<div class="contract-box">
    <div id="contract-info" 
    v-loading="loading"
    element-loading-text="图片生成中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.3)">
        <div class="title">
            无忧保汽车延长保修服务礼包
        </div>
        <div class="sub-title">
            无忧保汽车延长保修服务礼包包含以下三项内容：延长保修服务、无忧保个性化纪念品、汽车养护服务：
        </div>
        <div class="sub-title">
            一、延长保修服务
        </div>
        <div class="contract-content">
            延长保修服务合同号：{{selectContractData.contractNo}}
        </div>
        <div class="sub-title">
            1、客户信息
        </div>
        <div class="contract-content">
            <span class="left">
                车主姓名：{{selectContractData.userName}}
            </span>
            <span class="right">
                联系电话：{{selectContractData.mobile}}
            </span>
        </div>
        <div class="contract-content">
            <span class="left">
                地址：{{selectContractData.address}}
            </span>
        </div>

        <div class="sub-title">
            2、车辆信息
        </div>
        <div class="contract-content">
            <span class="left">
                车辆型号：{{selectContractData.vehicle}}
            </span>
            <span class="right">
                车辆类型：新车
            </span>
        </div>
        <div class="contract-content">
            <span class="left">
                购买日期：{{selectContractData.carBuyTime}}
            </span>
            <span class="right">
                原厂保修起始日期：{{selectContractData.carTime}} - {{selectContractData.oldEndTime}}
            </span>
        </div>
        <div class="contract-content">
            <span class="left">
                原厂保修长度：3年/10公里
            </span>
        </div>
        <div class="contract-content">
            <span class="left">
                车架号(VIN):  {{selectContractData.vin}}
            </span>
            <span class="right">
                发动机号：{{selectContractData.engineNum}}
            </span>
        </div>
        <div class="contract-content">
            <span class="left">
                车牌号码：{{selectContractData.licensePlate}}
            </span>
            <span class="right">
                车辆售出价格：{{(selectContractData.carPrice)}} 元
            </span>
        </div>

        <div class="sub-title">
            3、服务合同信息
        </div>
        <div class="contract-content">
            <span class="left">
                延保销售日期： {{(selectContractData.createTime)}}
            </span>
            <span class="right">
                延保方案：{{selectContractData.insuranceTItle}}
            </span>
        </div>
        <div class="contract-content">
            <span class="left">
                保障范围：{{selectContractData.insuranceDescription}}
            </span>
        </div>
        <div>
            延保止期：延长原厂保修期至 6 年/ 15万公里（以先到者为准）
            <div class="sub-title">（延保起期以原厂保修到期后开始，延保止期以您购买的方案中列明的延长年限及公里先到者为准）</div>
        </div>
        <div class="contract-content">
            延保销售时行驶里程： {{selectContractData.mileage}}  公里   
        </div>

        <div class="sub-title">
            二、无忧保个性化纪念品
        </div>

        <div class="sub-title">
            三、汽车养护服务
        </div>
        <div class="contract-content">
            保养内容：4S店24小时免费救援;延保期间车辆维修过程同品牌代步车服务;4S店一年一次4轮定位服务;4S店一年一次车辆全面检测服务。
        </div>
        <div class="contract-content">
备注：以上第一、第二项服务内容无忧保公司已与中国邮政集团有限公司佛山市高明区分公司签订独家代理合同，第三项服务内容由无忧保公司提供。
        </div>

        <div class="sub-title">
四、礼包合计金额：  {{selectContractData.price}}    元
        </div>

        <div class="sub-title">
五、经销商信息
        </div>

        <div class="contract-content">
经销商名称：广州无忧保汽车服务有限公司
        </div>
        <div class="contract-content">
经销商联系电话：
        </div>
        <div class="contract-content">
经销商地址：广州市天河区棕林街78号商铺
        </div>

        <div class="sub-title">
客户需遵守本手册的约定条款方能享受延长保修权益。
        </div>

        <div class="sub-title">
我已阅读并理解汽车延长保修服务礼包及内容条款，我理解手册相关约定及解释，
        </div>
        <div class="sub-title">
我理解保修内容以及不予保修内容，完全同意并接受所有保修条款及相差记录。
        </div>

    <div class="contract-content" style="margin-top:20px;">
        <div class="left">
经销商盖章： 
        </div>
        <div class="right">
客户签字：
        </div>
    </div>
    <div class="contract-content" style="margin-top:20px;">
        <div class="left">
            日期：
        </div>
        <div class="right">
            日期：
        </div>
    </div>
    </div>
    <el-image class="stamp-pic" v-if="b64" :src="b64"></el-image>
</div>
</template>

<script>
import { 
    uploadToken
 } from '../../../api/index';
import * as qiniu from 'qiniu-js';
import {uniqBy, cloneDeep} from 'lodash';
import html2canvas from 'html2canvas';
import { MCanvas } from 'mcanvas'

export default {
    name: 'ContractPic',
    props: {
        status: {
            type: String|Number,
            default: ''
        },
        selectContractData: {
            type: Object,
            default: () => {return {}}
        },
    },
    components: {
    },
    data() {
        return {
           b64: '',
           loading: false,
        };
    },
    mounted() {
        let that = this
    },
    methods: {
        createPic(target) {
            this.target = target
            this.loading = true
            this.b64 = '' // 先置空
            let that = this
            html2canvas(document.querySelector('#contract-info'), {
                width: '700',
                height: '1000',
                scale: 1
            }).then(function(canvas) {
                let oImg = new Image();
                oImg.src = canvas.toDataURL();  // 导出图片
                that.stamp(oImg.src, target)
            })
        },
        async stamp (url, target) {
            const mc = new MCanvas({
                width: '700px',
                height: '100px',
                backgroundColor: 'white',
            });

            // background : 准备底图；提供多种模式
            mc.background(url,{
                left: '0px',
                top: '0px',
                color: '#fff',
                type: 'origin',
            })
            // add 添加图片素材基础函数；
            await mc.add('http://storage.sankinetwork.com/wuyoubao-mail-post.png?imageView2/0/w/300/h/200',{
                width: '200px',
                height: '100px',
                pos: {
                    x: '300px',
                    y: '490px',
                },
            })
            const b64 = await mc.draw({});
            this.b64 = b64
            this.loading = false
        },
        setImage(e){
            uploadToken().then(token => {
                let that = this
                function putb64(b64, token){
                    let firstIndex = b64.indexOf(',')
                    let str = b64.substr(firstIndex+1)
                    var url = "https://upload-z2.qiniup.com/putb64/-1/"; //非华东空间需要根据注意事项 1 修改上传域名
                    var xhr = new XMLHttpRequest();
                    xhr.onreadystatechange=function(){
                        if (xhr.readyState==4){
                            let key = JSON.parse(xhr.responseText).key
                            that.$emit('getApprovalUrl', key)
                        }
                    }
                    xhr.open("POST", url, true);
                    xhr.setRequestHeader("Content-Type", "application/octet-stream");
                    xhr.setRequestHeader("Authorization", "UpToken " + token);
                    xhr.send(str);
                }
                putb64(this.b64, token)
            })
        },
    }
};
</script>

<style lang="scss" scoped>
    .contract-box {
        position: relative;
        width: 700px;
        .stamp-pic {
            width: 700px;
            height: 1000px;
            position: absolute;
            top: 0;
        }
    }

    #contract-info {
        background-color: #fff;
        color: black;
        text-align: left;
        width: 700px;
        height: 1000px;
        font-size: 14px;
        padding: 10px;

        .title {
            font-weight: bold;
            font-size: 17px;
            text-align: center;
        }

        .sub-title {
            font-weight: bold;
            font-size: 14px;
            margin-top: 10px;
        }

        .contract-content {
            width: 100%;
            margin-top: 4px;
            .left,.right {
                display: inline-block;
                width: 50%;
            }
        }
    }
</style>
