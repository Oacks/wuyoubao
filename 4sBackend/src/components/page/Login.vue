<template>
    <div class="login-wrap">
        <div class="ms-login">
            <div class="ms-title">4s店后台管理系统</div>
            <el-form :model="param" :rules="rules" ref="login" label-width="0px" class="ms-content">
                <el-form-item prop="username">
                    <el-input v-model="param.username" placeholder="手机号">
                        <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input
                        placeholder="验证码"
                        v-model="param.password"
                        @keyup.enter.native="submitForm()"
                    >
                        <el-button slot="prepend" icon="el-icon-lx-lock"></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                        <el-button type="success" @click="getCode">获取验证码</el-button>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="submitForm()">登录</el-button>
                </div>
            </el-form>
        </div>

    </div>
</template>

<script>
import { loginByMobile, getSms } from '../../api/index';
export default {
    components: {
    },
    data: function() {
        return {
            param: {
                username: '',
                password: '',
            },
            rules: {
                username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
                password: [{ required: true, message: '请输入验证码', trigger: 'blur' }],
            },
        };
    },
    methods: {
        // 获取验证码
        getCode() {
            let params = {
                mobile: this.param.username
            }
            console.log(params);
            getSms(params).then(res => {
                if (res) {
                    this.$message.success('短信发送成功')
                }
            })
        },
        submitForm() {
            this.$refs.login.validate(valid => {
                if (valid) {
                    let param = {
                        mobile: this.param.username,
                        // pwd: window.btoa(this.param.password),
                        code: this.param.password,
                        type: '0'
                    }
                    loginByMobile(param).then(res => {
                        if (res !== undefined) {
                            localStorage.setItem('4s_username', this.param.username);
                            localStorage.setItem('wy_menu', JSON.stringify(res.menuList));
                            this.$router.push('/');
                        }
                    })
                } else {
                    this.$message.error('请输入账号和密码');
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        loginRequest() {
            
        }
    },
};
</script>

<style lang="scss" scoped>
.login-wrap {
    position: relative;
    width: 100%;
    height: 100%;
    background-image: url(../../assets/img/login-bg.jpg);
    background-size: 100%;
}
.ms-title {
    width: 100%;
    line-height: 50px;
    text-align: center;
    font-size: 20px;
    color: #666;
    border-bottom: 1px solid #ddd;
}
.ms-login {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 350px;
    margin: -190px 0 0 -175px;
    border-radius: 5px;
    background: rgba(255, 255, 255, 0.3);
    overflow: hidden;
}
.ms-content {
    padding: 30px 30px;
}
.login-btn {
    text-align: center;
}
.login-btn button {
    width: 100%;
    height: 36px;
    margin-bottom: 10px;
}
.login-tips {
    font-size: 12px;
    line-height: 30px;
    color: #fff;
}
</style>