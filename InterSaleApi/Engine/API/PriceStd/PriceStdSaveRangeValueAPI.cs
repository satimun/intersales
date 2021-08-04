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

namespace InterSaleApi.Engine.API.PriceStd
{
    public class PriceStdSaveRangeValueAPI : BaseAPIEngine<PriceStdSaveRangeValueReq, PriceStdSearchPriceRangeValueResponse>
    {
        protected override string PermissionKey { get { return "SALES_API"; } }

        protected override void ExecuteChild(PriceStdSaveRangeValueReq dataReq, PriceStdSearchPriceRangeValueResponse dataRes)
        {
            var isSuccess = true;
            var conn = BaseADO.OpenConnection();
            conn.Open();
            SqlTransaction transac = conn.BeginTransaction();

            dataReq.priceStdValues.ForEach(x => {
                var tmp = new PriceStdValues();
                try
                {
                    tmp.priceRangeDID = x.priceRangeDID;
                    tmp.priceEffectiveDateID = x.priceEffectiveDateID;
                    tmp.seq = x.seq;
                    tmp.fob = x.fob;
                    tmp.caf = x.caf;
                    tmp.cif = x.cif;
                    tmp.minMeshSize = x.minMeshSize;
                    tmp.maxMeshSize = x.maxMeshDepth;
                    tmp.minMeshDepth = x.minMeshDepth;
                    tmp.maxMeshDepth = x.maxMeshDepth;
                    tmp.minLength = x.minLength;
                    tmp.maxLength = x.maxLength;
                    tmp.tagDescription = x.tagDescription;
                    tmp.salesDescription = x.salesDescription;
                    tmp.twineSeries = x.twineSeries;
                    tmp.status = x.status;
                    tmp._result._status = "S";
                    tmp._result._message = "SUCCESS";

                    var rangeDID = PriceStdRangeDADO.GetInstant().Import(transac, new sxsPriceStdRangeD() {
                        ID = x.priceRangeDID
                        , PriceStdRangeH_ID = x.priceRangeHID
                        , ProductTwineSeries_ID = x.twineSeries?.id
                        , MinMeshSize = x.minMeshSize ?? null
                        , MaxMeshSize = x.maxMeshSize ?? null
                        , MinMeshDepth = x.minMeshDepth ?? null
                        , MaxMeshDepth = x.maxMeshDepth ?? null
                        , MinLength = x.minLength ?? null
                        , MaxLength = x.maxLength ?? null
                        , Status = x.status
                        , TagDescription = x.tagDescription
                        , SalesDescription = x.salesDescription //new
                        , CreateBy = this.employeeID
                        , priceEffectiveDateID = x.priceEffectiveDateID
                    }, this.Logger);
                    if (rangeDID == 0) { throw new Exception("Save Fail."); }

                    var valueID = PriceStdValueADO.GetInstant().Import(transac, new sxsPriceStdValue()
                    {
                        ID = x.id
                        , PriceStdRangeD_ID = rangeDID
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
