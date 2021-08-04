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

namespace InterSaleApi.Engine.API.ShipmentPlanMain
{
    public class ShipmentPlanMainRemoveAPI : BaseAPIEngine<ShipmentPlanMainIDsRequest, ShipmentPlanMainUpdateResponse>
    {
        protected override string PermissionKey { get { return "SALES_API"; } }

        protected override void ExecuteChild(ShipmentPlanMainIDsRequest dataReq, ShipmentPlanMainUpdateResponse dataRes)
        {
            var isSuccess = true;
            var conn = BaseADO.OpenConnection();
            conn.Open();
            SqlTransaction transac = conn.BeginTransaction();

            ShipmentPlanMainADO.GetInstant().UpdateStatus(dataReq.shipmentPlanMainIDs, EnumUtil.GetValueEnum<ENShipmentPlanMonthlyStatus>("C"), this.employeeID, this.Logger, transac).ForEach(
                x =>
                {
                    if (x.Status != "C")
                    {
                        isSuccess = false;
                    }
                    var tmp = new InterSaleModel.Model.API.Response.ShipmentPlanMain();
                    tmp.id = x.ID;
                    tmp.code = x.Code;
                    tmp.planType = x.PlanType;
                    tmp.planMonth = x.PlanMonth;
                    tmp.planYear = x.PlanYear;
                    //tmp.revision = x.Revision;
                    tmp.status = x.Status;
                    //tmp.approve = new ByDateTimeModel { by = BaseValidate.GetEmpName(x.ApproveBy), datetime = DateTimeUtil.GetDateTimeString(x.ApproveDate) };
                    tmp.create = new ByDateTimeModel { by = BaseValidate.GetEmpName(x.CreateBy), datetime = DateTimeUtil.GetDateTimeString(x.CreateDate) };
                    tmp.modify = new ByDateTimeModel { by = BaseValidate.GetEmpName(x.ModifyBy), datetime = DateTimeUtil.GetDateTimeString(x.ModifyDate) };
                    dataRes.shipmentPlanMain.Add(tmp);
                }
            );

            if (!isSuccess)
            {
                transac.Rollback();
                throw new KKFException(this.Logger, KKFExceptionCode.V0000, "Remove Fail.");
            }
            else { transac.Commit(); }
            conn.Close();
        }
    }
}
