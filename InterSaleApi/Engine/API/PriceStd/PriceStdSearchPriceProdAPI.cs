using InterSaleApi.ADO;
using InterSaleApi.Engine.Validate;
using InterSaleApi.Model.StaticValue;
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
    public class PriceStdSearchPriceProdAPI : BaseAPIEngine<SearchRequest, PriceStdSearchPriceProdResponse>
    {
        protected override string PermissionKey { get { return "PUBLIC_API"; } }

        protected override void ExecuteChild(SearchRequest dataReq, PriceStdSearchPriceProdResponse dataRes)
        {

            PriceStdADO.GetInstant().SearchPriceStdProd(dataReq, this.Logger).ForEach(
                x =>
                {
                    dataRes.priceStdValues.Add(new PriceStdValue()
                    {
                        id = x.ID
                        , priceStdMainID = x.PriceStdMain_ID
                        , priceStdProdID = x.PriceStdProd_ID
                        , priceEffectiveDateID = x.PriceStdEffectiveDate_ID
                        , seq = x.Seq
                        , fob = x.PriceFOB
                        , caf = x.PriceCAF
                        , cif = x.PriceCIF
                        , status = x.Status
                        , updateFlag = new INTIdCodeDescriptionModel() { id = x.UpdateFlag_ID, code = x.UpdateFlag_Code, description = x.UpdateFlag_Des }
                        , approved = new ApproveDocumentModel()
                        {
                            id = x.Approved_ID
                            , actionFlag = x.ActionFlag
                            , flag = x.ApprovedFlag
                            , statusFlag = new INTIdCodeDescriptionModel() { id = x.StatusFlag_ID, code = x.StatusFlag_Code, description = x.StatusFlag_Des }
                            , by = BaseValidate.GetEmpName(x.ApprovedBy)
                            , datetime = BaseValidate.GetDateTimeString(x.ApprovedDate)
                        }
                        , product = new INTIdCodeDescriptionModel() { id = x.Product_ID, code = x.Product_Code, description = x.Product_Des }
                        , rumType = new INTIdCodeDescriptionModel() { id = x.ProductRumType_ID, code = x.ProductRumType_Code, description = x.ProductRumType_Des }
                        , unitType = new INTIdCodeDescriptionModel() { id = x.UnitType_ID, code = x.UnitType_Code, description = x.UnitType_Des }
                        , lastUpdate = BaseValidate.GetByDateTime((x.ModifyBy.HasValue ? x.ModifyBy : x.CreateBy), (x.ModifyDate.HasValue ? x.ModifyDate : x.CreateDate))
                    });
                }
            );
        }
    }
}

