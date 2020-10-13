<template>
    <div>
        <div class="crop-demo">
            <div class="crop-demo-btn">选择图片
                <input class="crop-input" type="file" name="image" accept="image/*" @change="setImage"/>
            </div>
            <img v-show="imgSrc" :src="imgSrc" class="pre-img">
        </div>
    </div>
</template>

<script>
    import * as qiniu from 'qiniu-js';
    import {
        uploadToken
    } from '../../../api/index';

    export default {
        name: 'upload',
        data: function(){
            return {
                fileList: [],
                imgSrc: '',
            }
        },
        components: {
        },
        methods:{
            clearPic() {
                this.fileList = []
                this.imgSrc = ''
            },
            setImage(e){
                uploadToken().then(token => {
                    let that = this
                    const file = e.target.files[0];
                    const observable = qiniu.upload(file, file.name, token, {}, {
                        region: qiniu.region.z2
                    })
                    const observer = {
                        next(res){
                        },
                        error(err){
                            console.log(res);
                            // ...
                        },
                        complete(res){
                            that.$message.success({message: '上传成功',});
                            let url = 'http://storage.sankinetwork.com/' + res.key
                            that.$emit('getUrl', url)
                        }
                    }
                    const subscription = observable.subscribe(observer) // 上传开始

                })
                const file = e.target.files[0];
                if (!file.type.includes('image/')) {
                    return;
                }
                const reader = new FileReader();
                reader.onload = (event) => {
                    this.imgSrc = event.target.result;
                };
                reader.readAsDataURL(file);
            },
         
            imageuploaded(res) {
                console.log(res)
            },
            handleError(){
                this.$notify.error({
                    title: '上传失败',
                    message: '图片上传接口上传失败，可更改为自己的服务器接口'
                });
            }
        },
        created(){
            this.clearPic()
        }
    }
</script>

<style scoped>
    .pre-img{   
        width: 100px;
        height: 100px;
        background: #f8f8f8;
        border: 1px solid #eee;
        border-radius: 5px;
    }
    .crop-demo-btn{
        position: relative;
        width: 100px;
        height: 40px;
        line-height: 40px;
        padding: 0 20px;
        background-color: #409eff;
        color: #fff;
        font-size: 14px;
        border-radius: 4px;
        box-sizing: border-box;
    }
    .crop-input{
        position: absolute;
        width: 100px;
        height: 40px;
        left: 0;
        top: 0;
        opacity: 0;
        cursor: pointer;
    }
</style>