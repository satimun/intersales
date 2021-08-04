using InterSaleApi.ADO;
using InterSaleApi.Engine.Validate;
using InterSaleModel.Model.API.Request;
using InterSaleModel.Model.API.Response;
using InterSaleModel.Model.API.Response.PublicModel;
using InterSaleModel.Model.Constant.ConstEnum;
using KKFCoreEngine.Constant;
using KKFCoreEngine.KKFException;
using KKFCoreEngine.Util;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;

namespace InterSaleApi.Engine.API.ShipmentPlan
{
    public class ShipmentPlanManagerApproveAPI : BaseAPIEngine<ShipmentPlanApproveReq, ShipmentPlanHApproveRes>
    {
        protected override string PermissionKey { get { return "SALESMANAGER_API"; } }

        protected override void ExecuteChild(ShipmentPlanApproveReq dataReq, ShipmentPlanHApproveRes dataRes)
        {
            var isSuccess = true;
            var conn = BaseADO.OpenConnection();
            conn.Open();
            SqlTransaction transac = conn.BeginTransaction();

            string status = "";
            if (dataReq.approve == "Y")
            {
                status = "A";
            }
            else if (dataReq.approve == "N")
            {
                status = "N";
            }
            else
            {
                status = "W";
            }

            ShipmentPlanHADO.GetInstant().Approve(dataReq.shipmentHID, 3, dataReq.approve, status, this.employeeID, this.Logger).ForEach(
                x =>
                {
                    if (x.Status != status) { isSuccess = false; }

                    var tmp = new ShipmentPlanHApproveRes.ShipmentPlanH();
                    tmp.id = x.ID ?? 0;
                    tmp.planDate = BaseValidate.GetDateString(x.PlanDate);
                    tmp.planWeek = x.PlanWeek;
                    tmp.containerCode = x.Container_Code;
                    tmp.salesApprove.by = BaseValidate.GetEmpName(x.SalesApproveBy);
                    tmp.salesApprove.flag = x.SalesApprove;
                    tmp.salesApprove.datetime = BaseValidate.GetDateTimeString(x.SalesApproveDate);

                    tmp.regionalApprove.by = BaseValidate.GetEmpName(x.RegionalApproveBy);
                    tmp.regionalApprove.flag = x.RegionalApprove;
                    tmp.regionalApprove.datetime = BaseValidate.GetDateTimeString(x.RegionalApproveDate);

                    tmp.managerApprove.by = BaseValidate.GetEmpName(x.ManagerApproveBy);
                    tmp.managerApprove.flag = x.ManagerApprove;
                    tmp.managerApprove.datetime = BaseValidate.GetDateTimeString(x.ManagerApproveDate);

                    tmp.status = x.Status;

                    dataRes.shipmentPlanHs.Add(tmp);
                }
            );

            if (!isSuccess)
            {
                transac.Rollback();
                throw new KKFException(this.Logger, KKFExceptionCode.V0000, "Update Status Fail.");
            }
            else { transac.Commit(); }
            conn.Close();
        }
    }
}
