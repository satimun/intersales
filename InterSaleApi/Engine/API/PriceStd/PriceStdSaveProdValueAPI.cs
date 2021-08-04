using InterSaleApi.ADO;
using InterSaleModel.Model.API.Request;
using InterSaleModel.Model.API.Response;
using InterSaleModel.Model.Entity;
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
    public class PriceStdSaveProdValueAPI : BaseAPIEngine<PriceStdSaveProdValueReq, PriceStdSearchPriceProdResponse>
    {
        protected override string PermissionKey { get { return "SALES_API"; } }

        protected override void ExecuteChild(PriceStdSaveProdValueReq dataReq, PriceStdSearchPriceProdResponse dataRes)
        {
            var isSuccess = true;
            var conn = BaseADO.OpenConnection();
            conn.Open();
            SqlTransaction transac = conn.BeginTransaction();

            dataReq.priceStdValues.ForEach(x => {
                var tmp = new PriceStdValue();
                try
                {
                    tmp.id = x.id;
                    tmp.priceStdProdID = x.priceStdProdID;
                    tmp.priceEffectiveDateID = x.priceEffectiveDateID;
                    tmp.seq = x.seq;
                    tmp.fob = x.fob;
                    tmp.caf = x.caf;
                    tmp.cif = x.cif;
                    tmp.product = x.product;
                    tmp.status = x.status;
                    tmp._result._status = "S";
                    tmp._result._message = "SUCCESS";
                    var prodID = PriceStdProdADO.GetInstant().Import(transac, new sxsPriceStdProd() {
                        ID = x.priceStdProdID
                        , PriceStdMain_ID = x.priceStdMainID
                        , Product_ID = x.product.id??0
                        , UnitType_ID = x.unitType.id??0
                        , Status = x.status
                        , CreateBy = this.employeeID
                        , priceEffectiveDateID = x.priceEffectiveDateID
                    }, this.Logger);
                    if (prodID == 0) { throw new Exception("Save Fail."); }

                    var valueID = PriceStdValueADO.GetInstant().Import(transac, new sxsPriceStdValue()
                    {
                        ID = x.id
                        , PriceStdProd_ID = prodID
                        , PriceStdEffectiveDate_ID = x.priceEffectiveDateID
                        , PriceFOB = x.fob
                        , PriceCAF = x.caf
                        , PriceCIF = x.cif
                        , CreateBy = this.employeeID
                    }, this.employeeID, x.id == 0 ? "A" : "M", this.Logger);
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
                    dataRes.priceStdValues.Add(tmp);
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
