//获取品牌列表接口  /admin/product/baseTrademark/{page}/{limit}
import request from '@/utils/request'
export const reqTradeMark = (page, limit) => request({
  url: `/admin/product/baseTrademark/${page}/${limit}`,
  method:'get'
})
  
//新增品牌  /admin/product/baseTrademark/save  品牌名称和logo
//修改品牌  /admin/product/baseTrademark/update  put  id 名称 logo
export const reqAddOrUpdateTradeMark = (tradeMark) => {
  //如果携带id 就是修改
  if (tradeMark.id) {
    return request({
      method: 'put',
      url: '/admin/product/baseTrademark/update',
      data:tradeMark
    })
  }
  else { //不带id就是新增
    return request({
      method: 'post',
      url: '/admin/product/baseTrademark/save',
      data:tradeMark
    })
  }
}


//删除品牌   /admin/product/baseTrademark/remove/{id}
export const reqDeleteTradeMark = (id)=>request({
  url: `/admin/product/baseTrademark/remove/${id}`,
  method:'delete'
})