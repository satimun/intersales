using InterSaleApi.ADO;
using InterSaleApi.Engine.Validate;
using InterSaleApi.Model.StaticValue;
using InterSaleModel.Model.API.Request;
using InterSaleModel.Model.API.Request.PublicRequest;
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
    public class PortLoadingSaveAPI : BaseAPIEngine<PortLoadingSaveReq, PortLoadingRes>
    {
        protected override string PermissionKey { get { return "PRIVATE_API"; } }

        protected override void ExecuteChild(PortLoadingSaveReq dataReq, PortLoadingRes dataRes)
        {

            var isSuccess = true;
            var conn = BaseADO.OpenConnection();
            conn.Open();
            SqlTransaction transac = conn.BeginTransaction();

            dataReq.portLoadings.ForEach(x => {
                var tmp = new PortLoadingRes.PortLoading();
                try
                {
                    tmp.code = x.code;
                    tmp.description = x.description;
                    tmp.status = x.status;
                    tmp._result._status = "S";
                    tmp._result._message = "SUCCESS";
                    var res = PortLoadingADO.GetInstant().Save(transac, x, this.employeeID, this.Logger).FirstOrDefault();
                    tmp.id = res.ID;
                    tmp.lastUpdate = BaseValidate.GetByDateTime((res.ModifyBy.HasValue ? res.ModifyBy : res.CreateBy), (res.ModifyDate.HasValue ? res.ModifyDate : res.CreateDate));
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
                throw new KKFException(this.Logger, KKFExceptionCode.V0000, "ไม่สามารถบันทึกข้อมูลได้");
            }
            else { transac.Commit(); }
            conn.Close();

            StaticValueManager.GetInstant().sxsPortLoading_load();
        }
    }
}
