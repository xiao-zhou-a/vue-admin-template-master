import request from '@/utils/request'
import { reqCategory1 } from './attr'

//获取图片的接口
export const reqSpuImageList = (spuId) => request({
  url: `/admin/product/spuImageList/${spuId}`,
  method:'get'
})
//获取销售属性 /admin/product/spuSaleAttrList/{spuId}
export const reqSpuSaleAttrList = (spuId) => request({
  url: `/admin/product/spuSaleAttrList/${spuId}`,
  method:'get'
})
//获取平台属性的数据 /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}
export const reqAttrInfoList = (category1Id, category2Id, category3Id) => request({
  url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,
  method:'get'
})

//添加sku  /admin/product/saveSkuInfo
export const reqAddSku = (skuInfo) => request({
  url: '/admin/product/saveSkuInfo',
  method: 'post',
  data:skuInfo
})
//获取sku列表的接口
export const reqSkuList = (spuId) => request({
  url: `/admin/product/findBySpuId/${spuId}`,
  method:'get'
})

//在sku页面获取sku列表的接口 /admin/product/list/{page}/{limit}
export const reqSkuTable = (page, limit) => request({
  url: `/admin/product/list/${page}/${limit}`,
  method:'get'
})

//上架的接口          
export const reqOnSale = (skuId) => request({
  url: `/admin/product/onSale/${skuId}`,
  method:'get'
})
//下架的接口
export const reqCancelSale = (skuId) => request({
  url: `/admin/product/cancelSale/${skuId}`,
  method:'get'
})
//获取sku详情的接口 /admin/product/getSkuById/{skuId}
export const reqSkuById = (skuId) => request({
  url: `/admin/product/getSkuById/${skuId}`,
  method:'get'
})
