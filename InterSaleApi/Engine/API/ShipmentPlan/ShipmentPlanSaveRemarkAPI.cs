using InterSaleApi.ADO;
using InterSaleModel.Model.API.Request;
using InterSaleModel.Model.API.Response;
using InterSaleModel.Model.Entity;
using KKFCoreEngine.Constant;
using KKFCoreEngine.KKFException;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;

namespace InterSaleApi.Engine.API.ShipmentPlan
{
    public class ShipmentPlanSaveRemarkAPI : BaseAPIEngine<ShipmentPlanSaveRemarkReq, ShipmentPlanGetRemarkRes>
    {
        protected override string PermissionKey { get { return "PRIVATE_API"; } }

        protected override void ExecuteChild(ShipmentPlanSaveRemarkReq dataReq, ShipmentPlanGetRemarkRes dataRes)
        {
            var isSuccess = true;
            var conn = BaseADO.OpenConnection();
            conn.Open();
            SqlTransaction transac = conn.BeginTransaction();

            dataReq.planRemarks.ForEach(x => {
                var tmp = new ShipmentPlanGetRemarkRes.PlanRemark();
                try
                {
                    tmp.planWeek = x.planWeek;
                    tmp.customers = x.customers;
                    tmp.ciCode = x.ciCode;
                    tmp.plan = x.plan;
                    tmp.actual = x.actual;
                    tmp.remark = x.remark;
                    tmp._result._status = "S";
                    tmp._result._message = "SUCCESS";
                    var res = ShipmentPlanADO.GetInstant().SaveRemark(Convert.ToInt32(x.plan.id), x.actual.id, x.remark.id, this.employeeID, this.Logger);
                }
                catch (Exception ex)
                {
                    tmp._result._status = "F";
                    tmp._result._message = ex.Message;
                    isSuccess = false;
                }
                finally
                {
                    dataRes.planRemarks.Add(tmp);
                }

            });

            if (!isSuccess)
            {
                transac.Rollback();
                throw new KKFException(this.Logger, KKFExceptionCode.V0000, "ไม่สามารถบันทึกข้อมูลได้");
            }
            else { transac.Commit(); }
            conn.Close();

        }
    }
}
