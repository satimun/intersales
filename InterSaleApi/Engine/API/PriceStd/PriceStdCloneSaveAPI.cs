using InterSaleApi.ADO;
using InterSaleModel.Model.API.Request;
using InterSaleModel.Model.API.Response;
using InterSaleModel.Model.Entity;
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
    public class PriceStdCloneSaveAPI : BaseAPIEngine<PriceStdCloneSaveReq, PriceStdCloneSearchRes>
    {
        protected override string PermissionKey { get { return "SALES_API"; } }

        protected override void ExecuteChild(PriceStdCloneSaveReq dataReq, PriceStdCloneSearchRes dataRes)
        {
            var isSuccess = true;
            var conn = BaseADO.OpenConnection();
            conn.Open();
            SqlTransaction transac = conn.BeginTransaction();

            dataReq.priceStds.ForEach(x => {

                var tmp = new PriceStdCloneSearchRes.PriceCloneSearh();
                try
                {
                    tmp.id = x.id;
                    tmp.code = x.code;
                    tmp.type = x.type;
                    tmp.priceStdEffectiveDate = x.priceStdEffectiveDate;
                    tmp.productType = x.productType;
                    tmp.productGroup = x.productGroup;
                    tmp.productGrade = x.productGrade;
                    tmp.effectiveDateFrom = x.effectiveDateFrom;
                    tmp.effectiveDateTo = x.effectiveDateTo;
                    tmp.currency = x.currency;
                    tmp.countryGroup = x.countryGroup;
                    tmp.countApproved = x.countApproved;
                    tmp.status = x.status;
                    tmp._result._status = "S";
                    tmp._result._message = "SUCCESS";
                    var result = PriceStdADO.GetInstant().CloneSave(transac, x, this.employeeID, this.Logger);
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
                    dataRes.priceStds.Add(tmp);
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
