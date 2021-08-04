using InterSaleModel.Model.API.Request;
using InterSaleModel.Model.API.Request.PublicRequest;
using InterSaleModel.Model.API.Response;
using InterSaleModel.Model.API.Response.PublicModel;
using InterSaleModel.Model.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InterSaleApi.Engine.API.ShipmentPlan
{
    public class ShipmentPlanSearchPlanAPI : BaseAPIEngine<ShipmentPlanMainGetPlanForApproveReq, ShipmentPlanMainSearchProgressResponse>
    {
        protected override string PermissionKey { get { return "SALES_API"; } }

        protected override void ExecuteChild(ShipmentPlanMainGetPlanForApproveReq dataReq, ShipmentPlanMainSearchProgressResponse dataRes)
        {
            var dbRes = ADO.ShipmentPlanADO.GetInstant().SearchPlan(dataReq, this.Logger);

            List<sxtShipmentPlanOutstandProcess> outstandProcessDatas = new List<sxtShipmentPlanOutstandProcess>();
            if (dataReq.showOutstand)
            {
                var customeIDs = dbRes.Select(x => x.customerID).Distinct().ToList();
                outstandProcessDatas = ADO.ShipmentPlanADO.GetInstant().GetOutstandProcess(customeIDs, dataReq.option, this.Logger);
            }
            dataRes.customers = new List<ShipmentPlanMainSearchProgressResponse.Customer>();
            
            dbRes.GroupBy(x => x.customerID).ToList().ForEach(x =>
            {
                var tmp = new ShipmentPlanMainSearchProgressResponse.Customer();
                var d = x.ToList();
                tmp.id = d.First().customerID;
                tmp.code = d.First().customerCode;
                tmp.description = d.First().customerDes;
                tmp.country = new INTIdCodeDescriptionModel() { id = d.First().countryID, code = d.First().countryCode, description = d.First().countryDes };
                tmp.zoneAccount = new INTIdCodeDescriptionModel() { id = d.First().zoneID, code = d.First().zoneCode, description = d.First().zoneDes };

                if (dataReq.showOutstand)
                {
                    tmp.outstanding = new ShipmentPlanMainSearchProgressResponse.Customer.Balance();
                    tmp.outstanding.values = new List<CurrencyModel>();
                    tmp.inventory.values = new List<CurrencyModel>();
                    outstandProcessDatas.Where(y => y.Customer_ID == tmp.id).ToList().ForEach(z =>
                    {
                        var currencyCode = ADO.CurrencyADO.GetInstant().Search(new SearchRequest() { ids = new List<string>() { z.Currency_ID.ToString() } }).FirstOrDefault().Code;
                        tmp.outstanding.quantity = z.OutstandQuantity;
                        tmp.outstanding.weight = z.OutstandWeight;
                        tmp.outstanding.bale = z.OutstandBale;
                        tmp.outstanding.volume = z.OutstandVolume;
                        tmp.outstanding.values.Add(new CurrencyModel() { num = z.OutstandValue, code = currencyCode });

                        tmp.inventory.quantity = z.InvQuantity;
                        tmp.inventory.weight = z.InvWeight;
                        tmp.inventory.bale = z.InvBale;
                        tmp.inventory.volume = z.InvVolume;
                        tmp.inventory.values.Add(new CurrencyModel() { num = z.InvValue, code = currencyCode });
                    });
                }

                if (d.Any(y => y.ShipmentPlanMain_ID != 0))
                {
                    tmp.shipmentPlanMain = new ShipmentPlanMainSearchProgressResponse.Customer.ShipmentPlanMain();
                    tmp.shipmentPlanMain.progress = new ShipmentPlanMainSearchProgressResponse.Customer.ShipmentPlanMain.ShipmentProgress();
                    tmp.shipmentPlanMain.progress.alertMessage = new List<string>();
                    var monthly = d.Where(y => y.PlanType == "M").ToList();
                    if(monthly.Count != 0)
                    {
                        tmp.shipmentPlanMain.id = monthly.First().ShipmentPlanMain_ID;
                        tmp.shipmentPlanMain.monthlyID = tmp.shipmentPlanMain.id;
                        tmp.shipmentPlanMain.status = monthly.First().ShipmentPlanMain_Status;
                        monthly = monthly.Where(y => y.ShipmentPlanH_ID != 0).ToList();
                        tmp.shipmentPlanMain.monthlyAmount = monthly.GroupBy(y => y.ShipmentPlanH_ID).Count();
                        tmp.shipmentPlanMain.monthlyApprove = monthly.GroupBy(y => new { id = y.ShipmentPlanH_ID, status = y.ShipmentPlanH_Status }).ToList().Where(y => y.Key.status == "A").Count();
                        
                    }
                   
                    tmp.shipmentPlanMain.waitApprove = monthly.Any(y => y.ShipmentPlanH_Status != "P") ? "Y" : "N";

                    var weekly = d.Where(y => y.PlanType == "W").ToList();
                    if(weekly.Count != 0)
                    {
                        tmp.shipmentPlanMain.weeklyID = weekly.First().ShipmentPlanMain_ID;
                        weekly = weekly.Where(y => y.ShipmentPlanH_ID != 0).ToList();
                        tmp.shipmentPlanMain.weeklyAmount = weekly.GroupBy(y => y.ShipmentPlanH_ID).Count();
                    }

                    if(monthly.Count == 0 && weekly.Count == 0) { tmp.shipmentPlanMain.progress.alertMessage.Add("No shipment plan available."); }

                    tmp.shipmentPlanMain.ports = d.GroupBy(y => y.portCode).Select(y => y.Key).ToList();
                    
                } 
                dataRes.customers.Add(tmp);
            });
        }
    }
}
