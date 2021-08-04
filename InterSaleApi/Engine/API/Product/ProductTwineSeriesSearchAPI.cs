using InterSaleApi.ADO;
using InterSaleApi.Engine.Validate;
using InterSaleModel.Model.API.Request.PublicRequest;
using InterSaleModel.Model.API.Response;
using InterSaleModel.Model.API.Response.PublicModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InterSaleApi.Engine.API.Product
{
    public class ProductTwineSeriesSearchAPI : BaseAPIEngine<SearchRequest, ProductTwineSeriesSearchRes>
    {
        protected override string PermissionKey { get { return "PUBLIC_API"; } }

        protected override void ExecuteChild(SearchRequest dataReq, ProductTwineSeriesSearchRes dataRes)
        {
            ProductTwineSeriesADO.GetInstant().Search(dataReq, this.Logger).ForEach(x =>
            {
                dataRes.twineSeries.Add(new ProductTwineSeriesSearchRes.TwineSeries()
                {
                    id = x.ID
                    , amountPackage = x.AmountPackage
                    , amountUnitPerPackage = x.AmountUnitPerPackage
                    , packageType = new INTIdCodeDescriptionModel() { id = x.PackageType_ID, code = x.PackageType_Code, description = x.PackageType_Des }
                    , unitType = new INTIdCodeDescriptionModel() { id = x.UnitType_ID, code = x.UnitType_Code, description = x.UnitType_Des }
                    , productType = new INTIdCodeDescriptionModel() { id =x.ProductType_ID, code = x.ProductType_Code, description = x.PackageType_Des }
                    , code = x.Code
                    , description = x.Description
                    , status = x.Status
                    , lastUpdate = BaseValidate.GetByDateTime((x.ModifyBy.HasValue ? x.ModifyBy : x.CreateBy), (x.ModifyDate.HasValue ? x.ModifyDate : x.CreateDate))
                });
            });
        }
    }
}
