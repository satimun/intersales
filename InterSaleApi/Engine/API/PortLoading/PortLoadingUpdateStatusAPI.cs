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

namespace InterSaleApi.Engine.API.PortLoading
{
    public class PortLoadingUpdateStatusAPI : BaseAPIEngine<UpdateStatusReq, PortLoadingRes>
    {
        protected override string PermissionKey { get { return "PRIVATE_API"; } }

        protected override void ExecuteChild(UpdateStatusReq dataReq, PortLoadingRes dataRes)
        {
            var isSuccess = true;
            var conn = BaseADO.OpenConnection();
            conn.Open();
            SqlTransaction transac = conn.BeginTransaction();

            PortLoadingADO.GetInstant().UpdataStatus(transac, dataReq, this.employeeID, this.Logger).ForEach(x => {
                var tmp = new PortLoadingRes.PortLoading();
                try
                {
                    tmp.id = x.ID;
                    tmp.code = x.Code;
                    tmp.description = x.Description;
                    tmp.lastUpdate = BaseValidate.GetByDateTime((x.ModifyBy.HasValue ? x.ModifyBy : x.CreateBy), (x.ModifyDate.HasValue ? x.ModifyDate : x.CreateDate));
                    tmp.status = x.Status;
                    tmp._result._status = "S";
                    tmp._result._message = "SUCCESS";
                    if (x.Status != dataReq.status) throw new KKFException(this.Logger, KKFExceptionCode.V0000, "Unable to update status.");
                }
                catch (Exception ex)
                {
                    tmp._result._status = "F";
                    tmp._result._message = ex.Message;
                    isSuccess = false;
                }
                finally
                {
                    dataRes.portLoadings.Add(tmp);
                }
            });

            if (!isSuccess)
            {
                transac.Rollback();
                throw new KKFException(this.Logger, KKFExceptionCode.S0002, "การอัปเดตไม่สำเร็จ");
            }
            else { transac.Commit(); }
            conn.Close();

            StaticValueManager.GetInstant().sxsPortLoading_load();
        }
    }
}
