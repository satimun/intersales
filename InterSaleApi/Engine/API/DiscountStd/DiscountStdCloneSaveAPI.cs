using InterSaleApi.ADO;
using InterSaleModel.Model.API.Request;
using InterSaleModel.Model.API.Response;
using KKFCoreEngine.Constant;
using KKFCoreEngine.KKFException;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;

namespace InterSaleApi.Engine.API.DiscountStd
{
    public class DiscountStdCloneSaveAPI : BaseAPIEngine<DiscountStdCloneSaveReq, DiscountStdCloneSearchRes>
    {
        protected override string PermissionKey { get { return "SALES_API"; } }

        protected override void ExecuteChild(DiscountStdCloneSaveReq dataReq, DiscountStdCloneSearchRes dataRes)
        {
            var isSuccess = true;
            var conn = BaseADO.OpenConnection();
            conn.Open();
            SqlTransaction transac = conn.BeginTransaction();

            dataReq.discountStds.ForEach(x => {

                var tmp = new DiscountStdCloneSearchRes.DiscountCloneSearh();
                try
                {
                    tmp.id = x.id;
                    tmp.code = x.code;
                    tmp.type = x.type;
                    tmp.discountStdEffectiveDate = x.discountStdEffectiveDate;
                    tmp.productType = x.productType;
                    tmp.productGroup = x.productGroup;
                    tmp.productGrade = x.productGrade;
                    tmp.effectiveDateFrom = x.effectiveDateFrom;
                    tmp.effectiveDateTo = x.effectiveDateTo;
                    tmp.currency = x.currency;
                    tmp.customer = x.customer;
                    tmp.countApproved = x.countApproved;
                    tmp.status = x.status;
                    tmp._result._status = "S";
                    tmp._result._message = "SUCCESS";
                    var result = DiscountStdADO.GetInstant().CloneSave(transac, x, this.employeeID, this.Logger);
                    if (result == 0) { throw new Exception("Save Fail."); }
                }
                catch (Exception ex)
                {
                    tmp._result._status = "F";
                    tmp._result._message = ex.Message;
                    isSuccess = false;
                }
                finally
                {
                    dataRes.discountStds.Add(tmp);
                }

            });

            if (!isSuccess)
            {
                transac.Rollback();
                throw new KKFException(this.Logger, KKFExceptionCode.V0000, "Save Fail");
            }
            else { transac.Commit(); }
            conn.Close();

        }
    }
}
