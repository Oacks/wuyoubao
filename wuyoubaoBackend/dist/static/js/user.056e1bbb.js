(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["user"],{6454:function(e,t,a){"use strict";a.r(t);var o=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"goods-form"},[a("div",{staticClass:"table-area"},[a("div",{staticStyle:{"margin-bottom":"10px"}},[a("el-button",{attrs:{type:"primary"},on:{click:e.create}},[e._v("新建")])],1),a("el-table",{ref:"multipleTable",staticClass:"table",attrs:{data:e.tableData,border:"","row-key":"id","header-cell-class-name":"table-header"},on:{"selection-change":e.handleSelectionChange}},[a("el-table-column",{attrs:{type:"selection",width:"55",align:"center"}}),a("el-table-column",{attrs:{prop:"userName",label:"会员呢称"}}),a("el-table-column",{attrs:{prop:"mobile",label:"手机号"}}),a("el-table-column",{attrs:{prop:"status",label:"操作",width:"180"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("el-button",{attrs:{type:"primary"},on:{click:function(a){return e.edit(t.row)}}},[e._v("编辑")]),a("el-button",{attrs:{type:"danger"},on:{click:function(a){return e.del(t.row)}}},[e._v("注销")])]}}])})],1),a("div",{staticClass:"pagination"},[a("el-pagination",{attrs:{background:"",layout:"total, prev, pager, next","current-page":e.page.no,"page-size":e.page.size,total:e.page.total},on:{"current-change":e.handlePageChange}})],1),a("el-dialog",{staticClass:"user-dialog",attrs:{"close-on-click-modal":!1,title:"create"===e.operate?"创建用户":"编辑用户",visible:e.dialogVisible,width:"700px"},on:{"update:visible":function(t){e.dialogVisible=t}}},[a("el-form",{staticClass:"demo-form-inline",attrs:{model:e.form,"label-width":"80px"}},[a("el-row",{attrs:{gutter:20}},[a("el-col",{attrs:{span:12}},[a("el-form-item",{attrs:{label:"用户名"}},[a("el-input",{model:{value:e.form.userName,callback:function(t){e.$set(e.form,"userName",t)},expression:"form.userName"}})],1)],1),a("el-col",{attrs:{span:12}},["create"==e.operate?a("el-form-item",{attrs:{label:"用户密码"}},[a("el-input",{attrs:{type:"password",placeholder:"create"==e.operate?"":"需要修改请输入原密码"},model:{value:e.form.password,callback:function(t){e.$set(e.form,"password",t)},expression:"form.password"}})],1):e._e()],1)],1),a("el-row",{attrs:{gutter:20}},[a("el-col",{attrs:{span:12}},[a("el-form-item",{attrs:{label:"手机号"}},[a("el-input",{model:{value:e.form.mobile,callback:function(t){e.$set(e.form,"mobile",t)},expression:"form.mobile"}})],1)],1)],1),a("el-row",{attrs:{gutter:20}},[a("el-col",{attrs:{span:12}},["create"!==e.operate?a("el-form-item",{attrs:{label:"新密码"}},[a("el-input",{attrs:{type:"password",placeholder:"需要修改请输入新密码"},model:{value:e.form.newPwd,callback:function(t){e.$set(e.form,"newPwd",t)},expression:"form.newPwd"}})],1):e._e()],1),a("el-col",{attrs:{span:12}},["create"!==e.operate?a("el-form-item",{attrs:{label:"确认密码"}},[a("el-input",{attrs:{type:"password",placeholder:"需要修改请确认新密码"},model:{value:e.form.confirmPwd,callback:function(t){e.$set(e.form,"confirmPwd",t)},expression:"form.confirmPwd"}})],1):e._e()],1)],1),a("el-row",{attrs:{gutter:20}},[a("el-col",{attrs:{span:24}},["edit"==e.operate?a("el-form-item",{attrs:{label:"分配菜单"}},[a("el-checkbox-group",{model:{value:e.selectedMenu,callback:function(t){e.selectedMenu=t},expression:"selectedMenu"}},e._l(e.menuList,(function(t,o){return a("el-checkbox",{key:o,attrs:{label:t.id}},[e._v(e._s(t.name))])})),1)],1):e._e()],1)],1)],1),a("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[a("el-button",{on:{click:function(t){e.dialogVisible=!1}}},[e._v("取 消")]),a("el-button",{attrs:{type:"primary"},on:{click:e.save}},[e._v("确 定")])],1)],1)],1)])},s=[],n=(a("c5f6"),a("365c")),l=a("2ef0"),i={name:"userForm",props:{},components:{},computed:{},data:function(){return{operate:"create",tableData:[],selectedMenu:[],page:{no:1,total:0,size:20},form:{mobile:"",orgin:"wy",password:"",state:1,userName:"",newPwd:"",confirmPwd:""},dialogVisible:!1,selectRow:[],level:"",userName:"",menuList:[]}},created:function(){this.getData(),this.getMenuList()},methods:{search:function(){this.getData()},handlePageChange:function(e){this.page.no=e,this.getData()},getMenuList:function(){var e=this;Object(n["C"])().then((function(t){e.menuList=t||[]}))},getData:function(){var e=this,t={pageSize:this.page.size,page:this.page.no,orgin:"wy"};Object(n["P"])(t).then((function(t){console.log(t.records),e.tableData=t.records,e.page.total=t.total,e.page.no=t.current}))},changeLevel:function(e){this.level=e,this.getData()},handleSelectionChange:function(e){this.selectRow=e},create:function(){this.operate="create",this.form={mobile:"",orgin:"wy",password:"",state:1,userName:"",newPwd:"",confirmPwd:""},this.openDialog()},edit:function(e){var t=this;Object(n["O"])({id:e.id}).then((function(a){for(var o=[],s=0;s<a.menuList.length;s++){a.menuList[s];o.push(a.menuList[s].id)}t.selectedMenu=o,t.operate="edit",e.status=Number(e.status),t.form=Object(l["cloneDeep"])(e),t.openDialog()}))},del:function(e){var t=this;this.$confirm("确认删除当前用户？").then((function(a){var o=e.id,s={id:o};Object(n["r"])(s).then((function(e){t.$message.success({message:"删除成功"}),t.getData()}))})).catch((function(e){}))},save:function(){var e=this,t=Object(l["cloneDeep"])(this.form);if(t.password&&(t.password=window.btoa(t.password)),"create"==this.operate&&(delete t.newPwd,delete t.confirmPwd,Object(n["m"])(t).then((function(t){t&&(e.$message.success({message:"创建成功"}),e.dialogVisible=!1,e.getData())}))),"edit"==this.operate){if(console.log(this.selectedMenu),""!=t.newPwd||""!=t.confirmPwd){if(t.newPwd!==t.confirmPwd)return void this.$message.warning({message:"两次新密码输入不一样"});t.password=window.btoa(t.newPwd)}Object(n["d"])({userId:t.id,menuList:this.selectedMenu}),Object(n["M"])(t).then((function(t){t&&(e.$message.success({message:"修改成功"}),e.dialogVisible=!1,e.getData())}))}},openDialog:function(){this.dialogVisible=!0},closeDialog:function(){this.dialogVisible=!1}}},r=i,c=(a("7daf"),a("2877")),u=Object(c["a"])(r,o,s,!1,null,"faa6a33c",null);t["default"]=u.exports},"7daf":function(e,t,a){"use strict";var o=a("8282"),s=a.n(o);s.a},8282:function(e,t,a){}}]);