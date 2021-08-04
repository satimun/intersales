using InterSaleApi.ADO;
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

namespace InterSaleApi.Engine.API.DiscountStd
{
    public class DiscountStdApprovalAPI : BaseAPIEngine<DiscountStdApprovalReq, DiscountStdSearchDetailRes>
    {
        protected override string PermissionKey { get { return "PRIVATE_API"; } }

        protected override void ExecuteChild(DiscountStdApprovalReq dataReq, DiscountStdSearchDetailRes dataRes)
        {
            var isSuccess = true;

            dataReq.discountDetails.ForEach(x =>
            {
                var tmp = new DiscountStdSearchDetailRes.DiscountDetail();
                tmp = x;
                tmp._result = new ResultModel() { _status = "S", _message = "SUCCESS" };
                var conn = BaseADO.OpenConnection();
                conn.Open();
                var isSuccess2 = true;
                SqlTransaction transac = conn.BeginTransaction();
                try
                {
                    var res = DiscountStdADO.GetInstant().Approval(transac, x.id, x.approved.actionFlag, x.updateFlag.id ?? 0, employeeID, Logger);
                    x.approved.flag = res;
                }
                catch (Exception ex)
                {
                    tmp._result._status = "F";
                    tmp._result._message = ex.Message;
                    isSuccess2 = isSuccess = false;
                    transac.Rollback();
                }
                finally
                {
                    if (isSuccess2) { transac.Commit(); }
                    dataRes.discountDetails.Add(tmp);
                }
                conn.Close();
            });

            if (!isSuccess)
            {
                throw new KKFException(this.Logger, KKFExceptionCode.V0000, "Approval Fail.");
            }
            else
            {
                SendToKKFConnect(dataReq);
            }
        }

        private void SendToKKFConnect(DiscountStdApprovalReq dataReq)
        {
            try
            {
                List<DiscountListCustomer> data = new List<DiscountListCustomer>();
                dataReq.discountDetails.Where(v => v.approved.flag == "A").GroupBy(v => new { mainID = v.discountStdMainID, effectiveID = v.discountEffectiveDateID }).ToList().ForEach(v =>
                {
                    var tmp = DiscountStdADO.GetInstant().DiscountListCustomer(v.Key.mainID, v.Key.effectiveID);
                    data.AddRange(tmp);
                });

                data.GroupBy(v => v.Customer_Code).ToList().ForEach(d =>
                {
                    Function.Base.PriceUpdateToKKFConnect(new PriceJobUpdateReq()
                    {
                        CustomerCode = d.Key,
                        EffictiveDateFrom = DateTimeUtil.GetDateString(d.Min(v => v.EffectiveDateFrom)),
                        EffictiveDateTo = DateTimeUtil.GetDateString(d.Max(v => v.EffectiveDateTo))
                    });
                });
            }
            catch (Exception) { }
        }
    }
}
