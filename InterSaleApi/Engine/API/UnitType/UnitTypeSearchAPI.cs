using InterSaleApi.ADO;
using InterSaleApi.Engine.Validate;
using InterSaleModel.Model.API.Request;
using InterSaleModel.Model.API.Request.PublicRequest;
using InterSaleModel.Model.API.Response;
using InterSaleModel.Model.API.Response.PublicModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InterSaleApi.Engine.API
{
    public class UnitTypeSearchAPI : BaseAPIEngine<SearchRequest, UnitTypeSearchResponse>
    {
        protected override string PermissionKey { get { return "PUBLIC_API"; } }

        protected override void ExecuteChild(SearchRequest dataReq, UnitTypeSearchResponse dataRes)
        {
            UnitTypeADO.GetInstant().Search(dataReq ,this.Logger).ForEach(
                   x =>
                   {
                       var tmp = new UnitTypeSearchResponse.UnitType();
                       tmp.id = x.ID;
                       tmp.code = x.Code;
                       tmp.symbol = x.Symbol;
                       tmp.description = x.Description;
                       tmp.groupType = x.GroupType;
                       tmp.unit = new INTIdCodeDescriptionModel() { id = x.Unit_ID, code = x.Unit_Code, description = x.Description };
                       tmp.unitGroupType = new INTIdCodeDescriptionModel() { id = x.UnitGroupType_ID, code = x.UnitGroupType_Code, description = x.UnitGroupType_Des };
                       tmp.lastUpdate = BaseValidate.GetByDateTime((x.ModifyBy.HasValue ? x.ModifyBy : x.CreateBy), (x.ModifyDate.HasValue ? x.ModifyDate : x.CreateDate));
                       dataRes.unitTypes.Add(tmp);
                   }
               );
        }
    }
}
