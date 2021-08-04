using InterSaleApi.Engine.Validate;
using InterSaleModel.Model.API.Request;
using InterSaleModel.Model.API.Request.PublicRequest;
using InterSaleModel.Model.API.Response;
using InterSaleModel.Model.API.Response.PublicModel;
using InterSaleModel.Model.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InterSaleApi.Engine.API
{
    public class CountryGroupSearchAPI : BaseAPIEngine<SearchRequest, CountryGroupsResponse>
    {
        protected override string PermissionKey { get { return "PUBLIC_API"; } }

        protected override void ExecuteChild(SearchRequest dataReq, CountryGroupsResponse dataRes)
        {
            ADO.CountryGroupADO.GetInstant().Search(dataReq,this.Logger).ForEach(x =>
            {
                dataRes.countryGroups.Add(new SearchResModel()
                {
                    id = x.ID
                    , code = x.Code
                    , description = x.Description
                    , groupType = x.GroupType
                    , status = x.Status
                    , lastUpdate = BaseValidate.GetByDateTime((x.ModifyBy.HasValue ? x.ModifyBy : x.CreateBy), (x.ModifyDate.HasValue ? x.ModifyDate : x.CreateDate))
                });
            });
        }
    }
}
