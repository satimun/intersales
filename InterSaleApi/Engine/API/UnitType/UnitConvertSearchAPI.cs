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
    public class UnitConvertSearchAPI : BaseAPIEngine<SearchRequest, UnitConvertSearchRes>
    {
        protected override string PermissionKey { get { return "PUBLIC_API"; } }

        protected override void ExecuteChild(SearchRequest dataReq, UnitConvertSearchRes dataRes)
        {
            UnitConvertADO.GetInstant().Search(dataReq, this.Logger).ForEach(x =>
            {
                dataRes.unitConverts.Add(new UnitConvertSearchRes.UnitConvert()
                {
                    description = x.Description
                    , formula = x.Formula
                    , round = x.Round
                    , unitGroupType = new INTIdCodeDescriptionModel() { id = x.UnitGroupType_ID, code = x.UnitGroupType_Code, description = x.UnitGroupType_Des }
                    , unitType = new UnitConvertSearchRes.UnitType() { id = x.UnitType_ID, code = x.UnitType_Code, description = x.UnitType_Des, symbol = x.UnitType_Symbol }
                    , unitType2 = new UnitConvertSearchRes.UnitType() { id = x.UnitType_ID2, code = x.UnitType_Code2, description = x.UnitType_Des2, symbol = x.UnitType_Symbol2 }
                    , status = x.status
                    , lastUpdate = BaseValidate.GetByDateTime((x.ModifyBy.HasValue ? x.ModifyBy : x.CreateBy), (x.ModifyDate.HasValue ? x.ModifyDate : x.CreateDate))
                });
            });
        }
    }
}
