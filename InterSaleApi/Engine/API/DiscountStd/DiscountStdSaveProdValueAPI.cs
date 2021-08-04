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
    public class DiscountStdSaveProdValueAPI : BaseAPIEngine<DiscountStdSaveProdValueReq, DiscountStdSearchDiscountProdResponse>
    {
        protected override string PermissionKey { get { return "SALES_API"; } }

        protected override void ExecuteChild(DiscountStdSaveProdValueReq dataReq, DiscountStdSearchDiscountProdResponse dataRes)
        {
            var isSuccess = true;
            var conn = BaseADO.OpenConnection();
            conn.Open();
            SqlTransaction transac = conn.BeginTransaction();

            dataReq.discountStdValues.ForEach(x => {
                var tmp = new DiscountStdValue();
                try
                {
                    tmp.discountStdProdID = x.discountStdProdID;
                    tmp.discountEffectiveDateID = x.discountEffectiveDateID;
                    tmp.seq = x.seq;
                    tmp.discountPercent = x.discountPercent;
                    tmp.discountAmount = x.discountAmount;
                    tmp.increaseAmount = x.increaseAmount;
                    tmp.product = x.product;
                    tmp.status = x.status;
                    tmp._result._status = "S";
                    tmp._result._message = "SUCCESS";
                    var prodID = DiscountStdProdADO.GetInstant().Import(transac, new sxsDiscountStdProd() {
                        ID = x.discountStdProdID
                        , DiscountStdMain_ID = x.discountStdMainID
                        , Product_ID = x.product.id??0
                        , UnitType_ID = x.unitType.id??0
                        , Status = x.status
                        , CreateBy = this.employeeID
                        , discountEffectiveDateID = x.discountEffectiveDateID
                    }, this.Logger);
                    if (prodID == 0) { throw new Exception("Save Fail."); }

                    var valueID = DiscountStdValueADO.GetInstant().Import(transac, new sxsDiscountStdValue()
                    {
                        ID = x.id
                        , DiscountStdProd_ID = prodID
                        , DiscountStdEffectiveDate_ID = x.discountEffectiveDateID
                        , DiscountPercent = x.discountPercent
                        , DiscountAmount = x.discountAmount
                        , IncreaseAmount = x.increaseAmount
                        , CreateBy = this.employeeID
                        , cloneFlag = x.cloneFlag
                    }, this.employeeID, x.id == 0 ? "A" : x.cloneFlag == true ? "C" : "M", this.Logger);
                    tmp.id = valueID;
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
                    dataRes.discountStdValues.Add(tmp);
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
