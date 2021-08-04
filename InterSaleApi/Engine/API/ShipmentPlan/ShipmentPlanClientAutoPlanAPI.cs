using InterSaleApi.ADO;
using InterSaleApi.Engine.Validate;
using InterSaleApi.Model.StaticValue;
using InterSaleModel.Model.API.Request;
using InterSaleModel.Model.API.Response;
using InterSaleModel.Model.API.Response.PublicModel;
using InterSaleModel.Model.Constant.ConstEnum;
using InterSaleModel.Model.Entity;
using KKFCoreEngine.Constant;
using KKFCoreEngine.KKFException;
using KKFCoreEngine.KKFLogger;
using KKFCoreEngine.Util;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace InterSaleApi.Engine.API.ShipmentPlanMain
{
    public class ShipmentPlanClientAutoPlanAPI :
        BaseAPIEngine<ShipmentPlanClientAutoPlanRequest, ShipmentPlanClientAutoPlanResponse>
    {
        protected override string PermissionKey
        {
            get { return "SALES_API"; }
        }

        protected override void ExecuteChild(ShipmentPlanClientAutoPlanRequest dataRequest, ShipmentPlanClientAutoPlanResponse dataResponse)
        {
            var dateCircleTmp = new List<int>();
            dataRequest.shipmentPlanMain.shipmentPlanOrderStands.GroupBy(x => x.customer.id).Select(x => x.Key).ToList().ForEach(x => {
                int? tmpD = ADO.ShipmentPlanDateCircleADO.GetInstant().GetByCustomerID(x).Select(y => y.ShippingDay).FirstOrDefault();
                if(tmpD != null)
                {
                    dateCircleTmp.Add(tmpD.Value);
                }
            });

            int? dateCircle = dateCircleTmp.Min(x => x);

            var customer = StaticValueManager.GetInstant().sxsCustomers.FirstOrDefault(x => x.ID == dataRequest.shipmentPlanMain.customer.id.Value);
            if (dateCircle == null)
                throw new KKFException(this.Logger, KKFExceptionCode.V0002, "Setup รอบส่งออกลูกค้ารหัส " + customer.Code);
            //ShipmentPlanSavePlanRequest.ShipmentPlanMain.ShipmentPlanOrderStand
            RunAutoPlanProcess run = new RunAutoPlanProcess(Logger, token); 
            var planHs = run.GetPlanAuto(dataRequest.shipmentPlanMain.shipmentPlanOrderStands,
                new sxtShipmentPlanMain()
                {
                    ID = dataRequest.shipmentPlanMain.id,
                    PlanMonth = dataRequest.shipmentPlanMain.planMonth,
                    PlanYear = dataRequest.shipmentPlanMain.planYear
                }, 
                dataRequest.limitContainerOfWeeks, 
                dataRequest.containerCodeOfWeek,
                dateCircle.Value,
                dataRequest.containerVolumeOfWeek
                , dataRequest.containerCalcTypeOfWeek);

            dataResponse.shipmentPlanHs = new List<ShipmentPlanClientAutoPlanResponse.ShipmentPlanH>();
            foreach (var ph in planHs)
            {
                var ds = new List<ShipmentPlanClientAutoPlanResponse.ShipmentPlanH.ShipmentPlanD>();
                foreach (var pd in ph.shipmentPlanDs)
                {
                    ds.Add(new ShipmentPlanClientAutoPlanResponse.ShipmentPlanH.ShipmentPlanD()
                    {
                        id = pd.id,
                        //customer = new INTIdCodeDescriptionModel()
                        //{
                        //    id = customer.ID,
                        //    code = customer.Code,
                        //    description = customer.CompanyName
                        //},
                        customer = StaticValueManager.GetInstant().sxsCustomers.Where(x => x.ID == pd.customer.id).Select(x => new INTIdCodeDescriptionModel() { id = x.ID, code = x.Code, description = x.CompanyName }).FirstOrDefault(),
                        planBalance = pd.planBalance,
                        shipmentPlanMainID = pd.shipmentPlanMainID,
                        shipmentPlanOrderStandID = pd.shipmentPlanOrderStandID,
                        status = pd.status
                    });
                }
                dataResponse.shipmentPlanHs.Add(new ShipmentPlanClientAutoPlanResponse.ShipmentPlanH()
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
                });
            }
        }
    }

}
