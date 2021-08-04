using InterSaleApi.ADO;
using InterSaleApi.Engine.Validate;
using InterSaleModel.Model.API.Request.PublicRequest;
using InterSaleModel.Model.API.Response;
using InterSaleModel.Model.API.Response.PublicModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InterSaleApi.Engine.API.UnitType
{
    public class UnitTypeProductTypeListAPI: BaseAPIEngine<SearchRequest, UnitTypeProductTypeListRes>
    {
        protected override string PermissionKey { get { return "PUBLIC_API"; } }

        protected override void ExecuteChild(SearchRequest dataReq, UnitTypeProductTypeListRes dataRes)
        {
            UnitTypeADO.GetInstant().ProductTypeList(dataReq, this.Logger).GroupBy(x => new { productType = x.ProductType_ID, groupType = x.UnitGroupType_ID, utype2 = x.UnitType_ID2 }).ToList().ForEach(x =>
            {
                dataRes.unitTypes.Add(new UnitTypeProductTypeListRes.UnitTypePList()
                {
                    productType = new INTIdCodeDescriptionModel() { id = x.First().ProductType_ID, code = x.First().ProductType_Code, description = x.First().ProductType_Des }
                    , unitGroupType = new INTIdCodeDescriptionModel() { id = x.First().UnitGroupType_ID, code = x.First().UnitGroupType_Code, description = x.First().UnitGroupType_Des }
                    , p_unitType = new UnitTypeProductTypeListRes.UnitType() { id = x.First().UnitType_ID2, code = x.First().UnitType_Code2, description = x.First().UnitType_Des2, symbol = x.First().UnitType_Symbol2 }
                    , s_unitType = x.Select(z => new UnitTypeProductTypeListRes.UnitType() { id = z.UnitType_ID, code = z.UnitType_Code, description = z.UnitType_Des, symbol = z.UnitType_Symbol }).ToList()
                });
            });

        }
    }
}
