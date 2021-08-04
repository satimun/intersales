using InterSaleApi.ADO;
using InterSaleApi.Engine.Validate;
using InterSaleModel.Model.API.Request.PublicRequest;
using InterSaleModel.Model.API.Response;
using InterSaleModel.Model.API.Response.PublicModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace InterSaleApi.Engine.API.Product
{
    public class ProductColorGroupSearchAPI : BaseAPIEngine<SearchRequest, ProductColorGroupSearchRes>
    {
        protected override string PermissionKey { get { return "PUBLIC_API"; } }

        protected override void ExecuteChild(SearchRequest dataReq, ProductColorGroupSearchRes dataRes)
        {
            Regex txt = new Regex($"{dataReq.search??""}", RegexOptions.IgnoreCase);
            ProductColorGroupADO.GetInstant().Search(dataReq, this.Logger).GroupBy(x => x.ID).ToList().ForEach(x =>
            {
                if(x.Any(y => txt.Match(y.Description).Success || txt.Match(y.Code).Success || txt.Match(y.ProductColor_Code).Success || txt.Match(y.ProductColor_Des).Success))
                {
                    dataRes.colorGroups.Add(new ProductColorGroupSearchRes.ColorGroup()
                    {
                        id = x.First().ID
                        , code = x.First().Code
                        , description = x.First().Description
                        , productType = new INTIdCodeDescriptionModel() { id = x.First().ProductType_ID, code = x.First().ProductType_Code, description = x.First().ProductType_Des }
                        , productGrade = new INTIdCodeDescriptionModel() { id = x.First().ProductGrade_ID, code = x.First().ProductGrade_Code, description = x.First().ProductGrade_Des }
                        , countryGroup = new INTIdCodeDescriptionModel() { id = x.First().CountryGroup_ID, code = x.First().CountryGroup_Code, description = x.First().CountryGroup_Des }
                        , colors = x.Select(y => new INTIdCodeDescriptionModel() { id = y.ProductColor_ID, code = y.ProductColor_Code, description = y.ProductColor_Des }).ToList()
                        , status = x.First().Status
                        , lastUpdate = BaseValidate.GetByDateTime((x.First().ModifyBy.HasValue ? x.First().ModifyBy : x.First().CreateBy), (x.First().ModifyDate.HasValue ? x.First().ModifyDate : x.First().CreateDate))
                    });
                }
            });
        }
    }
}
