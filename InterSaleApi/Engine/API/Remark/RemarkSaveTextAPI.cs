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
    public class RemarkSaveTextAPI : BaseAPIEngine<RemarkSaveTextReq, RemarkRes>
    {
        protected override string PermissionKey { get { return "PRIVATE_API"; } }

        protected override void ExecuteChild(RemarkSaveTextReq dataReq, RemarkRes dataRes)
        {
            var isSuccess = true;
            var conn = BaseADO.OpenConnection();
            conn.Open();
            SqlTransaction transac = conn.BeginTransaction();

            dataReq.remarks.ForEach(x => {
                var tmp = new RemarkGetDataRes.RemarkGroup.Remark();
                try
                {
                    var res = RemarkADO.GetInstant().SaveText(transac, x, this.employeeID, this.Logger).FirstOrDefault();
                    tmp.id = res.Remark_ID;
                    tmp.code = res.Remark_Code;
                    tmp.description = res.Remark_Description;
                    tmp.lastUpdate = BaseValidate.GetByDateTime(res.Remark_LastUpdateBy, res.Remark_LastUpdateDate);
                    tmp.status = res.Remark_Status;
                    tmp._result._status = "S";
                    tmp._result._message = "SUCCESS";
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
                throw new KKFException(this.Logger, KKFExceptionCode.V0000, "ไม่สามารถบันทึกข้อมูลได้");
            }
            else { transac.Commit(); }
            conn.Close();

        }
    }
}
