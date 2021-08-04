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

namespace InterSaleApi.Engine.API.DiscountStd
{
    public class DiscountStdSaveRangeValueAPI : BaseAPIEngine<DiscountStdSaveRangeValueReq, DiscountStdSearchDiscountRangeValueResponse>
    {
        protected override string PermissionKey { get { return "SALES_API"; } }

        protected override void ExecuteChild(DiscountStdSaveRangeValueReq dataReq, DiscountStdSearchDiscountRangeValueResponse dataRes)
        {
            var isSuccess = true;
            var conn = BaseADO.OpenConnection();
            conn.Open();
            SqlTransaction transac = conn.BeginTransaction();

            dataReq.discountStdValues.ForEach(x => {
                var tmp = new DiscountStdValues();
                try
                {
                    tmp.discountRangeDID = x.discountRangeDID;
                    tmp.discountEffectiveDateID = x.discountEffectiveDateID;
                    tmp.seq = x.seq;
                    tmp.discountPercent = x.discountPercent;
                    tmp.discountAmount = x.discountAmount;
                    tmp.increaseAmount = x.increaseAmount;
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
                    var rangeDID = DiscountStdRangeDADO.GetInstant().Import(transac, new sxsDiscountStdRangeD() {
                        ID = x.discountRangeDID
                        , DiscountStdRangeH_ID = x.discountRangeHID
                        , ProductTwineSeries_ID = x.twineSeries?.id
                        , MinMeshSize = x.minMeshSize ?? null
                        , MaxMeshSize = x.maxMeshSize ?? null
                        , MinMeshDepth = x.minMeshDepth ?? null
                        , MaxMeshDepth = x.maxMeshDepth ?? null
                        , MinLength = x.minLength ?? null
                        , MaxLength = x.maxLength ?? null
                        , Status = x.status
                        , TagDescription = x.tagDescription
                        , SalesDescription = x.salesDescription
                        , CreateBy = this.employeeID
                        , discountEffectiveDateID = x.discountEffectiveDateID
                    }, this.Logger);
                    if (rangeDID == 0) { throw new Exception("Save Fail."); }

                    var valueID = DiscountStdValueADO.GetInstant().Import(transac, new sxsDiscountStdValue()
                    {
                        ID = x.id
                        , DiscountStdRangeD_ID = rangeDID
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

            if(dataReq.discountStdValues.Any(x => x.id == 0))
            {
                // discountEffectiveDateID
                // discountRangeHID
                try
                {
                    DiscountStdValueADO.GetInstant().ReApproval(dataReq.discountStdValues.First().discountEffectiveDateID, dataReq.discountStdValues.First().discountRangeHID, employeeID, Logger, transac);
                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex.Message);
                    new KKFException(this.Logger, KKFExceptionCode.V0000, ex.StackTrace);
                    isSuccess = false;
                }
            }

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
