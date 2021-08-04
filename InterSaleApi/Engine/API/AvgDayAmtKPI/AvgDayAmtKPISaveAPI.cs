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

namespace InterSaleApi.Engine.API.AvgDayAmtKPI
{
    public class AvgDayAmtKPISaveAPI : BaseAPIEngine<AvgDayAmtKPIReq, AvgDayAmtKPIRes>
    {
        protected override string PermissionKey { get { return "PRIVATE_API"; } }

        protected override void ExecuteChild(AvgDayAmtKPIReq dataReq, AvgDayAmtKPIRes dataRes)
        {

            var isSuccess = true;
            var conn = BaseADO.OpenConnection();
            conn.Open();
            SqlTransaction transac = conn.BeginTransaction();

            dataReq.avgDays.ForEach(x => {
                var tmp = new AvgDayAmtKPIRes.AvgDay();
                try
                {
                    tmp.year = x.year;
                    tmp.zone = x.zone;
                    tmp.status = x.status;
                    tmp._result._status = "S";
                    tmp._result._message = "SUCCESS";
                    var res = AvgDateAmtKPIADO.GetInstant().Save(transac, x, this.employeeID, this.Logger).FirstOrDefault();

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
                    dataRes.avgDays.Add(tmp);
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
