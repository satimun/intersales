using InterSaleModel.Model.API.Request;
using InterSaleModel.Model.API.Response;
using InterSaleModel.Model.API.Response.PublicModel;
using InterSaleModel.Model.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InterSaleApi.Engine.API.InvTurnOver
{
    public class InvTurnOverReportAPI : BaseAPIEngine<InvTurnOverReportReq, InvTurnOverReportRes>
    {
        protected override string PermissionKey { get { return "SALES_API"; } }

        protected override void ExecuteChild(InvTurnOverReportReq dataReq, InvTurnOverReportRes dataRes)
        {
            //this.ExecuteForecast(dataRequest, dataResponse);
            var kpis = ADO.AvgDateAmtKPIADO.GetInstant().Search(new InterSaleModel.Model.API.Request.PublicRequest.SearchRequest()
            {
                ids = new List<string>() { dataReq.year.ToString() },
                ids1 = new List<string>(),
                status = new List<string>() { "A" }
            });

            //prdouct color
            List<sxsProductColor> productColor = new List<sxsProductColor>();
            productColor = ADO.ProductColorADO.GetInstant().Search(new InterSaleModel.Model.API.Request.PublicRequest.SearchRequest() { status = new List<string>() { "A" } });
            productColor.ForEach(v => v.Description = string.Concat(v.DescriptionNew, " (", v.CodeOld, ")"));

            ADO.InventoryRatoADO.GetInstant().Search(dataReq).ForEach(x =>
            {
                var pc = productColor.Find(v => v.ID == x.Color_ID);
                dataRes.invTurnOvers.Add(new InvTurnOverReportRes.InventoryTurnOver()
                {
                    zone = new INTIdCodeDescriptionModel() { id = x.Zone_ID, code = x.Zone_Code, description = x.Zone_Des },
                    country = new INTIdCodeDescriptionModel() { id = x.Country_ID, code = x.Country_Code, description = x.Country_Des },
                    customer = new INTIdCodeDescriptionModel() { id = x.Customer_ID, code = x.Customer_Code, description = x.Customer_Des },
                    productType = new INTIdCodeDescriptionModel() { id = x.ProductType_ID, code = x.ProductType_Code, description = x.ProductType_Des },
                    diameter = x.Diameter,
                    color = new INTIdCodeDescriptionModel() { id = x.Color_ID, code = pc.CodeNew, description = pc.Description },
                    salesCost = x.SalesCost,
                    salesWeight = x.SalesWeight,
                    quotedCost = x.QuotedCost,
                    quotedWeight = x.QuotedWeight,
                    forwardCost = x.ForwardCost,
                    forwardWeight = x.ForwardWeight,

                    salesCostLast = x.SalesCost_Last,
                    salesWeightLast = x.SalesWeight_Last,
                    quotedCostLast = x.QuotedCost_Last,
                    quotedWeightLast = x.QuotedWeight_Last,
                    forwardCostLast = x.ForwardCost_Last,
                    forwardWeightLast = x.ForwardWeight_Last,

                    avgPeriodDayKPI = kpis.Where(z => z.ZoneAccount_ID == x.Zone_ID).Select(z => z.AvgPeriodDay).ToList().FirstOrDefault(),

                    day = x.Day,
                    dayLast = x.Day_Last,
                });
            });


        }

    }
}
