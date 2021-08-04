using InterSaleApi.ADO;
using InterSaleApi.Engine.API.ShipmentPlan;
using InterSaleModel.Model.API.Request;
using InterSaleModel.Model.API.Request.PublicModel;
using InterSaleModel.Model.API.Request.PublicRequest;
using InterSaleModel.Model.API.Response;
using InterSaleModel.Model.Constant.ConstEnum;
using KKFCoreEngine.Util;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InterSaleApi.Engine.API.ShipmentPlanMain
{
    public class ShipmentPlanMainGetStatus : BaseAPIEngine<ShipmentPlanMainGetStatusRequest, ShipmentPlanMainGetStatusResponse>
    {
        protected override string PermissionKey { get { return "PUBLIC_API"; } }

        protected override void ExecuteChild(ShipmentPlanMainGetStatusRequest dataReq, ShipmentPlanMainGetStatusResponse dataRes)
        {
            //var searchProgress = new ShipmentPlanMainSearchProgressAPI();
            //ShipmentPlanMainSearchProgressResponse data = searchProgress.ExecuteResponse(this.token, new ShipmentPlanMainSearchProgressRequest
            //{
            //    planMonth = dataReq.planMonth,
            //    planYear = dataReq.planYear,
            //    saleEmployeeIDs = dataReq.saleEmployeeIDs,
            //    zoneAccountIDs = dataReq.zoneAccountIDs,
            //    customerIDs = dataReq.customerIDs,
            //    monthlyStatus = new List<string>(),
            //    weeklyStatus = new List<string>(), 
            //    regzoneCodes = dataReq.regzoneCodes
            //}, this.Logger);

            var searchPlan = new ShipmentPlanSearchPlanAPI();
            ShipmentPlanMainSearchProgressResponse data = searchPlan.ExecuteResponse(this.token, new ShipmentPlanMainGetPlanForApproveReq
            {
                planMonth = dataReq.planMonth,
                planYear = dataReq.planYear,
                saleEmployeeIDs = dataReq.saleEmployeeIDs,
                zoneAccountIDs = dataReq.zoneAccountIDs,
                customerIDs = dataReq.customerIDs,
                regionalZoneIDs = dataReq.regionalZoneIDs
            }, this.Logger);
            data.customers.ForEach(
                x => {
                    if (x.shipmentPlanMain != null)
                    {
                        foreach (var y in dataReq.shipmentPlanMainID)
                        {
                            if (y == x.shipmentPlanMain.id)
                            {
                                if (x.shipmentPlanMain.status != EnumUtil.GetValueString<ENShipmentPlanMonthlyStatus>(ENShipmentPlanMonthlyStatus.AUTO_PROCESSING))
                                {
                                    dataRes.shipmentPlanMain.Add(x.shipmentPlanMain);
                                }
                            }
                        }
                    }
                }
            );
            ShipmentPlanMainADO.GetInstant().GetByID(dataReq.shipmentPlanMainID, this.Logger).ForEach(
                x => {
                    if (x.Status == "C")
                    {
                        var tmp = new ShipmentPlanMainSearchProgressResponse.Customer.ShipmentPlanMain();
                        tmp.id = x.ID;
                        tmp.status = x.Status;
                        dataRes.shipmentPlanMain.Add(tmp);
                    }
                }
            );
        }
    }
}
