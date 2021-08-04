using InterSaleApi.ADO;
using InterSaleModel.Model.API.Request;
using InterSaleModel.Model.API.Response.PublicModel;
using KKFCoreEngine.Constant;
using KKFCoreEngine.KKFException;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;

namespace InterSaleApi.Engine.API.PriceStd
{
    public class PriceStdEffectiveDateUpdateStatusAPI : BaseAPIEngine<UpdateStatusReq, UpdateStatusRes>
    {
        protected override string PermissionKey { get { return "PRIVATE_API"; } }

        protected override void ExecuteChild(UpdateStatusReq dataReq, UpdateStatusRes dataRes)
        {
            var isSuccess = true;
            var conn = BaseADO.OpenConnection();
            conn.Open();
            SqlTransaction transac = conn.BeginTransaction();
            PriceStdEffectiveDateADO.GetInstant().UpdateStatus(transac, dataReq, this.employeeID, this.Logger).ForEach(x => {
                var tmp = new UpdateStatusRes.idStatus();
                try
                {
                    tmp.id = x.id;
                    tmp.status = x.status;
                    tmp._result._status = "S";
                    tmp._result._message = "SUCCESS";
                    if (x.status != dataReq.status) throw new KKFException(this.Logger, KKFExceptionCode.V0000, "ไม่สามารถอัปเดตสถานะได้");
                }
                catch (Exception ex)
                {
                    tmp._result._status = "F";
                    tmp._result._message = ex.Message;
                    isSuccess = false;
                }
                finally
                {
                    dataRes.results.Add(tmp);
                }
            });

            if (!isSuccess)
            {
                transac.Rollback();
                throw new KKFException(this.Logger, KKFExceptionCode.V0000, "การอัปเดตไม่สำเร็จ");
            }
            else { transac.Commit(); }
            conn.Close();
        }
    }
}
