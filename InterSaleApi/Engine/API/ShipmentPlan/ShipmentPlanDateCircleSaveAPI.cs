using InterSaleApi.ADO;
using InterSaleApi.Engine.Validate;
using InterSaleApi.Model.StaticValue;
using InterSaleModel.Model.API.Request;
using InterSaleModel.Model.API.Response;
using KKFCoreEngine.Constant;
using KKFCoreEngine.KKFException;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;

namespace InterSaleApi.Engine.API.ShipmentPlan
{
    public class ShipmentPlanDateCircleSaveAPI : BaseAPIEngine<ShipmentPlanDateCircleSaveRequest, ShipmentPlanDateCircleSaveResponse>
    {
        protected override string PermissionKey { get { return "PRIVATE_API"; } }

        private bool isSuccess { get; set; }

        protected override void ExecuteChild(ShipmentPlanDateCircleSaveRequest dataReq, ShipmentPlanDateCircleSaveResponse dataRes)
        {
            isSuccess = true;
            var conn = BaseADO.OpenConnection();
            conn.Open();
            SqlTransaction transac = conn.BeginTransaction();
            List<int> cusID = new List<int>();
            List<int> shippingDay = new List<int>();
            dataReq.shipmentPlanDateCircles.ForEach(x => { cusID.Add(x.customerID); shippingDay.Add(x.shippingDay); });
            ShipmentPlanDateCircleADO.GetInstant().Save(transac, cusID, shippingDay, this.employeeID, this.Logger).ForEach(
                 y => {
                     var tmp = new ShipmentPlanDateCircleSaveResponse.ShipmentPlanDateCircles();
                     tmp.id = y.DateCircleID ?? null;
                     tmp.shippingDay = y.DateCircleShippingDay;
                     tmp.customer.id = y.CustomerID;
                     tmp.customer.code = y.CustomerCode;
                     tmp.customer.description = y.CustomerDescription;
                     tmp.saleEmployee.id = y.SaleID;
                     tmp.saleEmployee.code = y.SaleCode;
                     tmp.saleEmployee.description = y.SaleDescription;

                     tmp.create.by = BaseValidate.GetEmpName(y.DateCircleCreateBy);
                     tmp.create.datetime = BaseValidate.GetDateTimeString(y.DateCircleCreateDate);
                     tmp.modify.by = BaseValidate.GetEmpName(y.DateCircleModifyBy);
                     tmp.modify.datetime = BaseValidate.GetDateTimeString(y.DateCircleModifyDate);
                     if (!y.DateCircleID.HasValue)
                     {
                         isSuccess = false;
                         tmp._result._message = new KKFException(this.Logger, KKFExceptionCode.V0000, "customer : " + y.CustomerCode + " Save Fail.").Message;
                     }
                     dataRes.shipmentPlanDateCircles.Add(tmp);
                 }
             );

            if (!isSuccess)
            {
                transac.Rollback();
                throw new KKFException(this.Logger, KKFExceptionCode.S0001, "");
            }
            else { transac.Commit(); }
            conn.Close();
        }
    }
}
