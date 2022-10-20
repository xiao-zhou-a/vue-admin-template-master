import request from '@/utils/request'

//获取spu数据 GET /admin/product/{page}/{limit}
export const reqGetSpuList = (page,limit,category3Id) => request({
  url: `/admin/product/${page}/${limit}`,
  method: 'get',
  params:{category3Id}
})
  
//获取spu基本信息 /admin/product/getSpuById/{spuId}
export const reqGetSpu = (spuId) => request({
  url: `/admin/product/getSpuById/${spuId}`,
  method:'get'
})

//获取品牌的信息 /admin/product/baseTrademark/getTrademarkList
export const reqTradeMarkList = () => request({
  url: '/admin/product/baseTrademark/getTrademarkList',
  method:'get'
})
//获取spu图标的接口 /admin/product/spuImageList/{spuId}
export const reqSpuImageList = (spuId) => request({
  url: `/admin/product/spuImageList/${spuId}`,
  method:'get'
})
//获取整个平台的销售属性  一共就三个销售属性 /admin/product/baseSaleAttrList
export const reqBaseSaleAttrList = () => request({
  url: '/admin/product/baseSaleAttrList',
  method:'get'
})
//保存信息  '/admin/product/saveSpuInfo'  '/admin/product/updateSpuInfo'
export const reqSaveSaleAttr = (spuInfo) => {
  //如果携带有id说明 是修改  没有的话就说明是添加属性
  if (spuInfo.id) {
    return request({
      url: '/admin/product/updateSpuInfo',
      method: 'post',
      data:spuInfo
    })
  }
  else {
    return request({
      url: '/admin/product/saveSpuInfo',
      method: 'post',
      data:spuInfo
    })
  }
}
//删除spu
export const reqDeleteSpu = (spuId) => request({
  url: `/admin/product/deleteSpu/${spuId}`,
  method:'delete'
})
  