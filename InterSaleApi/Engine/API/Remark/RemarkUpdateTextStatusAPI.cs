using InterSaleApi.ADO;
using InterSaleApi.Engine.Validate;
using InterSaleModel.Model.API.Request;
using InterSaleModel.Model.API.Response;
using KKFCoreEngine.Constant;
using KKFCoreEngine.KKFException;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;

namespace InterSaleApi.Engine.API
{
    public class RemarkUpdateTextStatusAPI : BaseAPIEngine<UpdateStatusReq, RemarkRes>
    {
        protected override string PermissionKey { get { return "PRIVATE_API"; } }

        protected override void ExecuteChild(UpdateStatusReq dataReq, RemarkRes dataRes)
        {
            var isSuccess = true;
            var conn = BaseADO.OpenConnection();
            conn.Open();
            SqlTransaction transac = conn.BeginTransaction();

            RemarkADO.GetInstant().UpdateTextStatus(transac, dataReq, this.employeeID, this.Logger).ForEach(x => {
                var tmp = new RemarkGetDataRes.RemarkGroup.Remark();
                try
                {
                    tmp.id = x.Remark_ID;
                    tmp.code = x.Remark_Code;
                    tmp.description = x.Remark_Description;
                    tmp.lastUpdate = BaseValidate.GetByDateTime(x.Remark_LastUpdateBy, x.Remark_LastUpdateDate);
                    tmp.status = x.Remark_Status;
                    tmp._result._status = "S";
                    tmp._result._message = "SUCCESS";
                    if (x.Remark_Status != dataReq.status) throw new KKFException(this.Logger, KKFExceptionCode.V0000, "Unable to update status.");
                }
                catch (Exception ex)
                {
                    tmp._result._status = "F";
                    tmp._result._message = ex.Message;
                    isSuccess = false;
                }
                finally
                {
                    dataRes.remarks.Add(tmp);
                }
            });

            if (!isSuccess)
            {
                transac.Rollback();
                throw new KKFException(this.Logger, KKFExceptionCode.S0002, "การอัปเดตไม่สำเร็จ");
            }
            else { transac.Commit(); }
            conn.Close();

        }
    }
}
