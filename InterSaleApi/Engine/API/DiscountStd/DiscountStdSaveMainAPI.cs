using InterSaleApi.ADO;
using InterSaleModel.Model.API.Request;
using InterSaleModel.Model.API.Response;
using InterSaleModel.Model.Entity;
using KKFCoreEngine.Constant;
using KKFCoreEngine.KKFException;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;

namespace InterSaleApi.Engine.API.DiscountStd
{
    public class DiscountStdSaveMainAPI : BaseAPIEngine<DiscountStdSaveMainReq, DiscountStdSearchMainResponse>
    {
        protected override string PermissionKey { get { return "PRIVATE_API"; } }

        protected override void ExecuteChild(DiscountStdSaveMainReq dataReq, DiscountStdSearchMainResponse dataRes)
        {
            var isSuccess = true;
            var conn = BaseADO.OpenConnection();
            conn.Open();
            SqlTransaction transac = conn.BeginTransaction();

            dataReq.discountStdMains.ForEach(x => {
                var tmp = new DiscountStdMains();
                try
                {
                    tmp.code = x.code;
                    tmp.type = x.type;
                    tmp.discountStdEffectiveDate = x.discountStdEffectiveDate;
                    tmp.productType = x.productType;
                    tmp.productGrade = x.productGrade;
                    tmp.customer = x.customer;
                    tmp.currency = x.currency;
                    tmp.status = x.status;
                    tmp._result._status = "S";
                    tmp._result._message = "SUCCESS";
                    var mainID = DiscountStdMainADO.GetInstant().Import(transac, new sxsDiscountStdMain() { Type = x.type, Customer_ID = x.customer.id ?? 0, ProductType_ID = x.productType.id ?? 0, ProductGrade_ID = x.productGrade.id, Currency_ID = x.currency.id ?? 0, CreateBy = this.employeeID }, x.code, this.Logger);
                    tmp.id = mainID;
                    if (tmp.id == 0) { throw new Exception("Save Fail."); }
                }
                catch (Exception ex)
                {
                    tmp._result._status = "F";
                    tmp._result._message = ex.Message;
                    isSuccess = false;
                }
                finally
                {
                    dataRes.discountStdMains.Add(tmp);
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
