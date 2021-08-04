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

namespace InterSaleApi.Engine.API.PriceStd
{
    public class PriceStdSaveEffectiveDateAPI : BaseAPIEngine<PriceStdSaveEffectiveDateReq, PriceStdSearchEffectiveDateResponse>
    {
        protected override string PermissionKey { get { return "PRIVATE_API"; } }

        protected override void ExecuteChild(PriceStdSaveEffectiveDateReq dataReq, PriceStdSearchEffectiveDateResponse dataRes)
        {
            var isSuccess = true;
            var conn = BaseADO.OpenConnection();
            conn.Open();
            SqlTransaction transac = conn.BeginTransaction();

            dataReq.priceStdEffectiveDates.ForEach(x => {
                var tmp = new EffectiveDateModel();
                try
                {
                    tmp.priceStdMain = x.priceStdMain;
                    tmp.effectiveDateFrom = x.effectiveDateFrom;
                    tmp.effectiveDateTo = x.effectiveDateTo;
                    tmp.countApprove = x.countApprove;
                    tmp.countTotal = x.countTotal;
                    tmp.status = x.status;
                    tmp._result._status = "S";
                    tmp._result._message = "SUCCESS";
                    var effectiveID = PriceStdEffectiveDateADO.GetInstant().Import(transac, new sxsPriceStdEffectiveDate() { PriceStdMain_ID = x.priceStdMain.id??0, EffectiveDateFrom = DateTimeUtil.GetDate(x.effectiveDateFrom).Value, EffectiveDateTo = DateTimeUtil.GetDate(x.effectiveDateTo).Value, CreateBy = this.employeeID }, x.priceStdMain.code, this.Logger);
                    tmp.id = effectiveID;
                    tmp.code = x.code;
                    if (tmp.id == 0) { throw new Exception("Save Fail."); }
                    //tmp.lastUpdate = BaseValidate.GetByDateTime((res.ModifyBy.HasValue ? res.ModifyBy : res.CreateBy), (res.ModifyDate.HasValue ? res.ModifyDate : res.CreateDate));
                }
                catch (Exception ex)
                {
                    tmp._result._status = "F";
                    tmp._result._message = ex.Message;
                    isSuccess = false;
                }
                finally
                {
                    dataRes.priceStdEffectiveDates.Add(tmp);
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
