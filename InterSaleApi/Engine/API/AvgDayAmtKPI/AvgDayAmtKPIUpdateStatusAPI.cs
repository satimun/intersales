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
    public class AvgDayAmtKPIUpdateStatusAPI : BaseAPIEngine<AvgDayAmtKPIReq, AvgDayAmtKPIRes>
    {
        protected override string PermissionKey { get { return "PRIVATE_API"; } }

        protected override void ExecuteChild(AvgDayAmtKPIReq dataReq, AvgDayAmtKPIRes dataRes)
        {
            var isSuccess = true;
            var conn = BaseADO.OpenConnection();
            conn.Open();
            SqlTransaction transac = conn.BeginTransaction();

            
            //var zones = ADO.ZoneAccountADO.GetInstant().Search(new SearchRequest() { ids = tmp.Select(x => x.ZoneAccount_ID.ToString()).Distinct().ToList(), status = new List<string>() { "A" } }, this.Logger);

            dataReq.avgDays.ForEach(z => {

                AvgDateAmtKPIADO.GetInstant().UpdataStatus(transac, new InterSaleModel.Model.Entity.sxsAvgDateAmtKPI()
                {
                    Year = z.year,
                    ZoneAccount_ID = z.zone.id??0,
                    Status = z.status
                }, this.employeeID, this.Logger).ForEach(x =>
                {
                    var tmp = new AvgDayAmtKPIRes.AvgDay();
                    try
                    {
                        tmp.year = x.Year;
                        //tmp.zone = x.ZoneAccount_ID;
                        tmp.lastUpdate = BaseValidate.GetByDateTime((x.ModifyBy.HasValue ? x.ModifyBy : x.CreateBy), (x.ModifyDate.HasValue ? x.ModifyDate : x.CreateDate));
                        tmp.status = x.Status;
                        tmp._result._status = "S";
                        tmp._result._message = "SUCCESS";
                        if (x.Status != z.status) throw new KKFException(this.Logger, KKFExceptionCode.V0000, "Unable to update status.");
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
