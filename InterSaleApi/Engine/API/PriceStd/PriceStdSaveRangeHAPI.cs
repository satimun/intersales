using InterSaleApi.ADO;
using InterSaleApi.Engine.Validate;
using InterSaleModel.Model.API.Request;
using InterSaleModel.Model.API.Request.PublicModel;
using InterSaleModel.Model.API.Request.PublicRequest;
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
    public class PriceStdSaveRangeHAPI : BaseAPIEngine<PriceStdSaveRangeHReq, PriceStdSearchPriceRangeHResponse>
    {
        protected override string PermissionKey { get { return "SALES_API"; } }

        protected override void ExecuteChild(PriceStdSaveRangeHReq dataReq, PriceStdSearchPriceRangeHResponse dataRes)
        {
            var isSuccess = true;
            var conn = BaseADO.OpenConnection();
            conn.Open();
            SqlTransaction transac = conn.BeginTransaction();

            dataReq.priceStdRangeHs.ForEach(x => {
                var tmp = new PriceStdRangeHs();
                try
                {
                    tmp.id = x.id;
                    tmp.priceStdMainID = x.priceStdMainID;
                    tmp.colorGroups = x.colorGroups;
                    tmp.minTwineSize = x.minTwineSize;
                    tmp.maxTwineSize = x.maxTwineSize;
                    tmp.knot = x.knot;
                    tmp.selvageWovenType = x.selvageWovenType;
                    tmp.stretching = x.stretching;
                    tmp.unitType = x.unitType;
                    tmp.status = x.status;
                    tmp._result._status = "S";
                    tmp._result._message = "SUCCESS";
                    var rangeHID = PriceStdRangeHADO.GetInstant().Import(transac, new sxsPriceStdRangeH() {
                        ID = x.id
                        , PriceStdMain_ID = x.priceStdMainID
                        , ProductKnot_ID = x.knot.id
                        , ProductStretching_ID = x.stretching.id
                        , ProductSelvageWovenType_ID = x.selvageWovenType.id
                        , UnitType_ID = x.unitType.id??0
                        , ProductColorGroup_ID = x.colorGroups.id
                        , Status = x.status
                        , MinProductTwineSizeCode = x.minTwineSize.code
                        , MinFilamentSize = x.minTwineSize.size
                        , MinFilamentAmount = x.minTwineSize.amount
                        , MinFilamentWord = StringUtil.GetStringValue(x.minTwineSize.word)
                        , MaxProductTwineSizeCode = x.maxTwineSize.code
                        , MaxFilamentSize = x.maxTwineSize.size
                        , MaxFilamentAmount = x.maxTwineSize.amount
                        , MaxFilamentWord = StringUtil.GetStringValue(x.maxTwineSize.word)
                        , CreateBy = this.employeeID
                    }, this.Logger);
                    tmp.id = rangeHID;
                    if (tmp.id == 0) { throw new Exception("Save Fail."); }

                    List<int> rangDIDs = PriceStdRangeDADO.GetInstant().GetByRangeHID(new List<int>() { tmp.id }, new List<string>() { "A", "I" }, this.Logger, transac).Select(z => z.ID).ToList();
                    if(rangDIDs.Count > 0)
                    {
                        PriceStdValueADO.GetInstant().GetByRangeDID(rangDIDs, new List<string> { "A", "I" }, this.Logger, transac).ForEach(z =>
                        {
                            var valueID = PriceStdValueADO.GetInstant().Import(transac, new sxsPriceStdValue()
                            {
                                ID = z.ID
                                , PriceStdRangeD_ID = z.PriceStdRangeD_ID
                                , PriceStdEffectiveDate_ID = z.PriceStdEffectiveDate_ID
                                , PriceFOB = z.PriceFOB
                                , PriceCAF = z.PriceCAF
                                , PriceCIF = z.PriceCIF
                                , CreateBy = this.employeeID
                            }, this.employeeID, "M", this.Logger);
                            if (valueID == 0) { throw new Exception("Save Fail."); }
                        });
                    }
                }
                catch (Exception ex)
                {
                    tmp._result._status = "F";
                    tmp._result._message = ex.Message;
                    isSuccess = false;
                }
                finally
                {
                    dataRes.priceStdRangeHs.Add(tmp);
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
