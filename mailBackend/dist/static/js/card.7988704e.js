(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["card"],{5321:function(e,t,a){"use strict";var i=a("72a5"),l=a.n(i);l.a},"72a5":function(e,t,a){},ad0f:function(e,t,a){"use strict";a.r(t);var i=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"goods-form"},[a("h2",[e._v("无忧宝卡管理")]),a("hr",{staticStyle:{"margin-bottom":"10px"}}),a("div",{staticClass:"table-area"},[a("div",{staticStyle:{height:"50px"}},[a("div",{staticStyle:{float:"left"}},[a("el-button",{attrs:{type:"primary"},on:{click:e.create}},[e._v("新建")])],1)]),a("el-table",{ref:"multipleTable",staticClass:"table",attrs:{data:e.tableData,border:"","row-key":"id","header-cell-class-name":"table-header"},on:{"selection-change":e.handleSelectionChange}},[a("el-table-column",{attrs:{prop:"title",label:"保险名称"}}),a("el-table-column",{attrs:{prop:"price",label:"价钱"}}),a("el-table-column",{attrs:{prop:"description",label:"描述"}}),a("el-table-column",{attrs:{label:"操作",width:"180"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("el-button",{attrs:{type:"primary"},on:{click:function(a){return e.checkCard(t.row)}}},[e._v("查看卡券")]),a("el-button",{attrs:{type:"danger"},on:{click:function(a){return e.del(t.row)}}},[e._v("删除")])]}}])})],1),a("div",{staticClass:"pagination"},[a("el-pagination",{attrs:{background:"",layout:"total, prev, pager, next","current-page":e.page.no,"page-size":e.page.size,total:e.page.total},on:{"current-change":e.handlePageChange}})],1),a("el-dialog",{staticClass:"user-dialog",attrs:{"close-on-click-modal":!1,title:"create"===e.operate?"新建无忧宝卡":"detail"===e.operate?"查看无忧宝卡":"",visible:e.dialogVisible,"before-close":e.closeDialog,width:"700px"}},[a("el-form",{staticClass:"demo-form-inline",attrs:{model:e.form,"label-width":"80px"}},[a("el-row",{attrs:{gutter:20}},[a("el-col",{attrs:{span:12}},[a("el-form-item",{attrs:{label:"保险名称"}},[a("el-input",{model:{value:e.form.title,callback:function(t){e.$set(e.form,"title",t)},expression:"form.title"}})],1)],1),a("el-col",{attrs:{span:12}},[a("el-form-item",{attrs:{label:"价格"}},[a("el-input",{model:{value:e.form.price,callback:function(t){e.$set(e.form,"price",e._n(t))},expression:"form.price"}})],1)],1)],1),a("el-row",{attrs:{gutter:20}},[a("el-col",{attrs:{span:24}},[a("el-form-item",{attrs:{label:"描述"}},[a("el-input",{attrs:{type:"textarea"},model:{value:e.form.description,callback:function(t){e.$set(e.form,"description",t)},expression:"form.description"}})],1)],1)],1)],1),a("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[a("el-button",{on:{click:function(t){e.dialogVisible=!1}}},[e._v("取 消")]),a("el-button",{attrs:{type:"primary"},on:{click:e.save}},[e._v("确 定")])],1)],1),a("el-dialog",{staticClass:"user-dialog",attrs:{"close-on-click-modal":!1,title:"查看卡券",visible:e.detailDialogVisible,"before-close":e.closeDetailDialog,width:"900px"}},[a("card-detail-manage",{ref:"cardDetail"})],1)],1)])},l=[],o=(a("c5f6"),a("365c")),s=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"goods-form"},[a("div",{staticClass:"table-area"},[a("div",{staticStyle:{height:"50px"}},[a("div",{staticStyle:{float:"left"}},[a("el-button",{attrs:{type:"primary"},on:{click:e.create}},[e._v("新建")])],1)]),a("el-table",{ref:"multipleTable",staticClass:"table",attrs:{data:e.tableData,border:"","row-key":"id","header-cell-class-name":"table-header"},on:{"selection-change":e.handleSelectionChange}},[a("el-table-column",{attrs:{prop:"insuranceNo",label:"卡号"}}),a("el-table-column",{attrs:{label:"卡状态"},scopedSlots:e._u([{key:"default",fn:function(t){return[e._v("\n                "+e._s(1==t.row.insuranceType?"已售":"未售")+"\n            ")]}}])}),a("el-table-column",{attrs:{label:"操作",width:"180"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("el-button",{attrs:{type:"danger"},on:{click:function(a){return e.del(t.row)}}},[e._v("删除")])]}}])})],1),a("div",{staticClass:"pagination"},[a("el-pagination",{attrs:{background:"",layout:"total, prev, pager, next","current-page":e.page.no,"page-size":e.page.size,total:e.page.total},on:{"current-change":e.handlePageChange}})],1),a("el-dialog",{staticClass:"user-dialog",attrs:{"close-on-click-modal":!1,title:"create"===e.operate?"新建卡券":"detail"===e.operate?"查看卡券":"",visible:e.dialogVisible,"before-close":e.closeDialog,"append-to-body":"",width:"700px"}},[a("el-form",{staticClass:"demo-form-inline",attrs:{model:e.form,"label-width":"80px"}},[a("el-row",{attrs:{gutter:20}},[a("el-col",{attrs:{span:12}},[a("el-form-item",{attrs:{label:"卡号"}},[a("el-input",{model:{value:e.form.insuranceNo,callback:function(t){e.$set(e.form,"insuranceNo",t)},expression:"form.insuranceNo"}})],1)],1)],1),a("el-row",{attrs:{gutter:20}},[a("el-col",{attrs:{span:12}},["edit"==e.operate?a("el-form-item",{attrs:{label:"状态"}},[a("el-select",{attrs:{placeholder:"请选择"},model:{value:e.form.insuranceType,callback:function(t){e.$set(e.form,"insuranceType",t)},expression:"form.insuranceType"}},e._l(e.statusOpt,(function(e){return a("el-option",{key:e.value,attrs:{clearable:"",label:e.label,value:e.value}})})),1)],1):e._e()],1)],1)],1),a("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[a("el-button",{on:{click:function(t){e.dialogVisible=!1}}},[e._v("取 消")]),a("el-button",{attrs:{type:"primary"},on:{click:e.save}},[e._v("确 定")])],1)],1)],1)])},n=[],r=a("2ef0"),c={name:"CardDetailManage",components:{},data:function(){return{operate:"detail",tableData:[],page:{no:1,total:0,size:20},form:{},dialogVisible:!1,selectRow:[],statusOpt:[{value:0,label:"未售"},{value:1,label:"已售"}],insuranceId:""}},methods:{create:function(){this.operate="create",this.form={insuranceId:this.insuranceId,insuranceNo:"",insuranceType:0},this.openDialog()},handlePageChange:function(){this.getData(this.insuranceId)},getData:function(e){var t=this;this.insuranceId=e;var a={insuranceId:e,page:this.page.no,pageSize:this.page.size};Object(o["i"])(a).then((function(e){t.tableData=e.records,t.page.total=e.total,t.page.no=e.current}))},handleSelectionChange:function(e){this.selectRow=e},edit:function(e){this.operate="edit",e.status=Number(e.status),this.form=Object(r["cloneDeep"])(e),this.openDialog()},detail:function(e){var t=this;contractDetail(e.id).then((function(e){console.log(e),t.operate="detail",t.form=e,t.openDialog()}))},del:function(e){var t=this;this.$confirm("确认删除当前卡？").then((function(a){var i=e.id,l={id:i};Object(o["n"])(l).then((function(e){t.$message.success({message:"删除成功"}),t.getData(t.insuranceId)}))})).catch((function(e){}))},save:function(){var e=this,t=Object(r["cloneDeep"])(this.form);"create"==this.operate&&Object(o["d"])(t).then((function(t){e.$message.success({message:"创建成功"}),e.dialogVisible=!1,e.getData(e.insuranceId)})),"edit"==this.operate&&userUpdate(t).then((function(t){t&&(e.$message.success({message:"修改成功"}),e.dialogVisible=!1,e.getData(e.insuranceId))}))},openDialog:function(){this.dialogVisible=!0},closeDialog:function(){this.dialogVisible=!1}}},u=c,d=(a("5321"),a("2877")),p=Object(d["a"])(u,s,n,!1,null,"4d26ad58",null),f=p.exports,g={name:"CardManage",components:{CardDetailManage:f},data:function(){return{disabled:!1,operate:"detail",tableData:[],page:{no:1,total:0,size:20},form:{},dialogVisible:!1,detailDialogVisible:!1,selectRow:[],statusOpt:[{value:0,label:"未售"},{value:1,label:"已售"}]}},created:function(){this.getData()},methods:{create:function(){this.operate="create",this.form={description:"",price:"",title:""},this.openDialog()},handlePageChange:function(){this.getData()},getData:function(){var e=this,t={pageSize:this.page.size,page:this.page.no,status:0};Object(o["u"])(t).then((function(t){e.tableData=t.records,e.page.total=t.total,e.page.no=t.current}))},handleSelectionChange:function(e){this.selectRow=e},edit:function(e){this.operate="edit",e.status=Number(e.status),this.form=Object(r["cloneDeep"])(e),this.openDialog()},detail:function(e){var t=this;contractDetail(e.id).then((function(e){console.log(e),t.operate="detail",t.form=e,t.openDialog()}))},checkCard:function(e){var t=this;this.detailDialogVisible=!0,this.$nextTick((function(){t.$refs.cardDetail.getData(e.id)}))},del:function(e){var t=this;this.$confirm("确认删除当前卡？").then((function(a){var i=e.id,l={id:i};Object(o["t"])(l).then((function(e){t.$message.success({message:"删除成功"}),t.getData()}))})).catch((function(e){}))},save:function(){var e=this;if(!this.disabled){this.disabled=!0,setTimeout((function(){e.disabled=!1}),6e3);var t=Object(r["cloneDeep"])(this.form);"create"==this.operate&&Object(o["e"])(t).then((function(t){e.$message.success({message:"创建成功"}),e.dialogVisible=!1,e.disabled=!1,e.getData()})),"edit"==this.operate&&userUpdate(t).then((function(t){t&&(e.$message.success({message:"修改成功"}),e.dialogVisible=!1,e.disabled=!1,e.getData())}))}},openDialog:function(){this.dialogVisible=!0},closeDialog:function(){this.dialogVisible=!1},closeDetailDialog:function(){this.detailDialogVisible=!1}}},b=g,h=(a("e8e8"),Object(d["a"])(b,i,l,!1,null,"38bf5d3e",null));t["default"]=h.exports},bf25:function(e,t,a){},e8e8:function(e,t,a){"use strict";var i=a("bf25"),l=a.n(i);l.a}}]);