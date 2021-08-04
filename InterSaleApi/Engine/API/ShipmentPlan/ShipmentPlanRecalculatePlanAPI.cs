using InterSaleApi.Engine.API.ShipmentPlanMain;
using InterSaleApi.Engine.Validate;
using InterSaleApi.Model.StaticValue;
using InterSaleModel.Model.API.Request;
using InterSaleModel.Model.API.Response;
using InterSaleModel.Model.API.Response.PublicModel;
using InterSaleModel.Model.Entity;
using KKFCoreEngine.Constant;
using KKFCoreEngine.KKFException;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InterSaleApi.Engine.API.ShipmentPlan
{
    public class ShipmentPlanRecalculatePlanAPI : BaseAPIEngine<ShipmentPlanSavePlanRequest, ShipmentPlanClientAutoPlanResponse>
    {
        protected override string PermissionKey { get { return "SALES_API"; } }

        protected override void ExecuteChild(ShipmentPlanSavePlanRequest dataReq, ShipmentPlanClientAutoPlanResponse dataRes)
        {
            var planMain = new sxtShipmentPlanMain()
            {
                ID = dataReq.shipmentPlanMain.id,
                PlanMonth = dataReq.shipmentPlanMain.planMonth,
                PlanYear = dataReq.shipmentPlanMain.planYear
            };

            var week = BaseValidate.GetWeeks(dataReq.shipmentPlanMain.planYear, dataReq.shipmentPlanMain.planMonth);

            RunAutoPlanProcess run = new RunAutoPlanProcess(Logger, token);

            var planHs = new List<ShipmentPlanSavePlanRequest.ShipmentPlanMain.ShipmentPlanH>();

            dataReq.shipmentPlanMain.shipmentPlanHs.ForEach( x =>
            {
                List<int> limitContainerOfWeeks = new List<int>();
                List<string> containerCodeOfWeek = new List<string>();
                List<decimal> containerVolumeOfWeek = new List<decimal>();
                List<string> containerCalcTypeOfWeek = new List<string>();

                week.ForEach(w =>
                {
                    if (w.weekNo == x.planWeek)
                    {
                        limitContainerOfWeeks.Add(1);
                        containerCodeOfWeek.Add(x.containerCode);
                        containerVolumeOfWeek.Add(x.volumeAdj??0);
                        containerCalcTypeOfWeek.Add(x.calculateType);
                    }
                    else
                    {
                        limitContainerOfWeeks.Add(0);
                        containerCodeOfWeek.Add(null);
                        containerVolumeOfWeek.Add(0);
                        containerCalcTypeOfWeek.Add(null);
                    }
                    
                });
                var outstands = JsonConvert.DeserializeObject<List<ShipmentPlanSavePlanRequest.ShipmentPlanMain.ShipmentPlanOrderStand>>(JsonConvert.SerializeObject(dataReq.shipmentPlanMain.shipmentPlanOrderStands.Where(o => o.toBeShipped.quantity > 0 && o.toBeShipped.weight > 0 && o.toBeShipped.volume > 0 && x.customerIDs.Any(z => z == o.customer.id)).ToList() ));
                var tmp = run.GetPlanAuto(outstands, planMain, limitContainerOfWeeks, containerCodeOfWeek, (int)KKFCoreEngine.Util.DateTimeUtil.GetDate(x.planDate).Value.DayOfWeek, containerVolumeOfWeek , containerCalcTypeOfWeek);
                if(tmp.Count == 1)
                {
                    tmp.First().refID = x.refID;
                    tmp.First().remark = x.remark;
                    tmp.First().portLoading = x.portLoading;

                    tmp.First().shipmentPlanDs.ForEach(d =>
                    {
                        var outstand = dataReq.shipmentPlanMain.shipmentPlanOrderStands.Where(o => o.id == d.shipmentPlanOrderStandID).FirstOrDefault();
                        if(outstand != null)
                        {
                            outstand.toBeShipped.bale -= d.planBalance.bale;
                            outstand.toBeShipped.quantity -= d.planBalance.quantity;
                            outstand.toBeShipped.weight -= d.planBalance.weight;
                            outstand.toBeShipped.volume -= d.planBalance.volume;
                            outstand.toBeShipped.value -= d.planBalance.value;
                        }
                    });

                    planHs.Add(tmp.First());
                }
                
            });


            dataRes.shipmentPlanHs = new List<ShipmentPlanClientAutoPlanResponse.ShipmentPlanH>();
            foreach (var ph in planHs)
            {
                var ds = new List<ShipmentPlanClientAutoPlanResponse.ShipmentPlanH.ShipmentPlanD>();
                foreach (var pd in ph.shipmentPlanDs)
                {
                    ds.Add(new ShipmentPlanClientAutoPlanResponse.ShipmentPlanH.ShipmentPlanD()
                    {
                        id = pd.id,
                        customer = StaticValueManager.GetInstant().sxsCustomers.Where(x => x.ID == pd.customer.id).Select(x => new INTIdCodeDescriptionModel() { id = x.ID, code = x.Code, description = x.CompanyName }).FirstOrDefault(),
                        planBalance = pd.planBalance,
                        shipmentPlanMainID = pd.shipmentPlanMainID,
                        shipmentPlanOrderStandID = pd.shipmentPlanOrderStandID,
                        status = pd.status
                    });
                }
                dataRes.shipmentPlanHs.Add(new ShipmentPlanClientAutoPlanResponse.ShipmentPlanH()
                {
                    id = ph.id,
                    containerCode = ph.containerCode,
                    status = ph.status,
                    planDate = ph.planDate,
                    planWeek = ph.planWeek,
                    shipmentPlanDs = ds
                    , calculateType = ph.calculateType
                    , volumeAdj = ph.volumeAdj
                    , weightAdj = ph.weightAdj
                    , remark = ph.remark
                    , portLoading = ph.portLoading
                    , refID = ph.refID
                });
            }
        }
    }
}
