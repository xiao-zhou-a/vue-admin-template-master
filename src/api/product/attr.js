//平台属性管理模块的请求文件
import request from '@/utils/request'
//获取一级路由 /admin/product/get/category1/{id}
export const reqCategory1 = () => request({
  url: '/admin/product/getCategory1',
  method:'get'
})

//获取二级路由 /admin/product/getCategory2/{category1Id}
export const reqCategory2 = (category1Id) => request({
  url: `/admin/product/getCategory2/${category1Id}`,
  method:'get'
})

//获取三级路由 /admin/product/getCategory3/{category2Id}
export const reqCategory3 = (category2Id) => request({
  url: `/admin/product/getCategory3/${category2Id}`,
  method:'get'
})

//获取商品属性
export const reqGetAttrList = (category1Id,category2Id,category3Id) => request({
  url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,
  method:'get'
})

//添加属性名称和属性值  /admin/product/saveAttrInfo
/* {
  "attrName": "string",属性名
  "attrValueList": [   属性值
    {
      "attrId": 0,
      "valueName": "string"
    }
  ],
  "categoryId": 0,
  "categoryLevel": 0,  类别
  "id": 0
} */
////保存商品属性或者添加
export const reqAddOrUpdataAttr = (data) => request({
  url: '/admin/product/saveAttrInfo',
  method: 'post',
  data
})
  

