using InterSaleApi.ADO;
using InterSaleModel.Model.API.Request;
using InterSaleModel.Model.API.Request.PublicModel;
using InterSaleModel.Model.API.Response;
using InterSaleModel.Model.Entity;
using KKFCoreEngine.Constant;
using KKFCoreEngine.KKFException;
using KKFCoreEngine.Util;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;

namespace InterSaleApi.Engine.API.DiscountStd
{
    public class DiscountStdSaveEffectiveDateAPI : BaseAPIEngine<DiscountStdSaveEffectiveDateReq, DiscountStdSearchEffectDateResponse>
    {
        protected override string PermissionKey { get { return "PRIVATE_API"; } }

        protected override void ExecuteChild(DiscountStdSaveEffectiveDateReq dataReq, DiscountStdSearchEffectDateResponse dataRes)
        {
            var isSuccess = true;
            var conn = BaseADO.OpenConnection();
            conn.Open();
            SqlTransaction transac = conn.BeginTransaction();

            dataReq.discountStdEffectiveDates.ForEach(x => {
                var tmp = new EffectiveDateModel();
                try
                {
                    tmp.discountStdMain = x.discountStdMain;
                    tmp.effectiveDateFrom = x.effectiveDateFrom;
                    tmp.effectiveDateTo = x.effectiveDateTo;
                    tmp.countApprove = x.countApprove;
                    tmp.countTotal = x.countTotal;
                    tmp.status = x.status;
                    tmp._result._status = "S";
                    tmp._result._message = "SUCCESS";
                    var effectiveID = DiscountStdEffectiveDateADO.GetInstant().Import(transac, new sxsDiscountStdEffectiveDate() { DiscountStdMain_ID = x.discountStdMain.id ?? 0, EffectiveDateFrom = DateTimeUtil.GetDate(x.effectiveDateFrom).Value, EffectiveDateTo = DateTimeUtil.GetDate(x.effectiveDateTo).Value, CreateBy = this.employeeID }, x.discountStdMain.code, this.Logger);
                    tmp.id = effectiveID;
                    tmp.code = x.code;
                    if (tmp.id == 0) { throw new Exception("Save Fail."); }
                }
                catch (Exception ex)
                {
                    tmp._result._status = "F";
                    tmp._result._message = ex.Message;
                    isSuccess = false;
                }
                finally
                {
                    dataRes.discountStdEffectiveDates.Add(tmp);
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
