using InterSaleApi.ADO;
using InterSaleApi.Engine.Validate;
using InterSaleApi.Model.StaticValue;
using InterSaleModel.Model.API.Request;
using InterSaleModel.Model.API.Response;
using InterSaleModel.Model.API.Response.PublicModel;
using InterSaleModel.Model.Entity.Response;
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
    public class PriceStdApprovalAPI : BaseAPIEngine<PriceStdApprovalReq, PriceStdSearchDetailRes>
    {
        protected override string PermissionKey { get { return "PRIVATE_API"; } }

        protected override void ExecuteChild(PriceStdApprovalReq dataReq, PriceStdSearchDetailRes dataRes)
        {
            var isSuccess = true;

            dataReq.priceDetails.ForEach(x =>
            {
                var tmp = new PriceStdSearchDetailRes.PriceDetail();
                tmp = x;
                tmp._result = new ResultModel() { _status = "S", _message = "SUCCESS" };
                var conn = BaseADO.OpenConnection();
                conn.Open();
                var isSuccess2 = true;
                SqlTransaction transac = conn.BeginTransaction();
                try
                {
                    var res = PriceStdADO.GetInstant().Approval(transac, x.id, x.approved.actionFlag, x.updateFlag.id ?? 0, this.employeeID, this.Logger);
                    x.approved.flag = res;
                } 
                catch(Exception ex)
                {
                    tmp._result._status = "F";
                    tmp._result._message = ex.Message;
                    isSuccess2 = isSuccess = false;
                    transac.Rollback();
                }
                finally
                {
                    if (isSuccess2) { transac.Commit(); }
                    dataRes.priceDetails.Add(tmp);
                }
                conn.Close();
            });

            if (!isSuccess)
            {
                throw new KKFException(this.Logger, KKFExceptionCode.V0000, "Approval Fail.");
            } 
            else
            {
                Task.Run(() => SendToKKFConnect(dataReq));
            }
        }

        private void SendToKKFConnect(PriceStdApprovalReq dataReq)
        {
            try
            {
                List<PridListCountry> data = new List<PridListCountry>();
                dataReq.priceDetails.Where(v => v.approved.flag == "A").GroupBy(v => new { mainID = v.priceStdMainID, effectiveID = v.priceEffectiveDateID }).ToList().ForEach(v =>
                {
                    var tmp = PriceStdADO.GetInstant().PridListCountry(v.Key.mainID, v.Key.effectiveID);
                    data.AddRange(tmp);
                });

                data.GroupBy(v => v.Country_Code).ToList().ForEach(d =>
                {
                    Function.Base.PriceUpdateToKKFConnect(new PriceJobUpdateReq()
                    {
                        CountryCode = d.Key,
                        EffictiveDateFrom = DateTimeUtil.GetDateString(d.Min(v => v.EffectiveDateFrom)),
                        EffictiveDateTo = DateTimeUtil.GetDateString(d.Max(v => v.EffectiveDateTo))
                    });
                });                
            }
            catch (Exception) { }
        }
    }
}
