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
    public class DiscountStdSaveRangeHAPI : BaseAPIEngine<DiscountStdSaveRangeHReq, DiscountStdSearchDiscountRangeHResponse>
    {
        protected override string PermissionKey { get { return "SALES_API"; } }

        protected override void ExecuteChild(DiscountStdSaveRangeHReq dataReq, DiscountStdSearchDiscountRangeHResponse dataRes)
        {
            var isSuccess = true;
            var conn = BaseADO.OpenConnection();
            conn.Open();
            SqlTransaction transac = conn.BeginTransaction();

            dataReq.discountStdRangeHs.ForEach(x => {
                var tmp = new DiscountStdRangeHs();
                try
                {
                    tmp.discountStdMainID = x.discountStdMainID;
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
                    var rangeHID = DiscountStdRangeHADO.GetInstant().Import(transac, new sxsDiscountStdRangeH() {
                        ID = x.id
                        , DiscountStdMain_ID = x.discountStdMainID
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

                    List<int> discountRangeDIDs = DiscountStdRangeDADO.GetInstant().GetByRangeHID(new List<int>() { tmp.id }, new List<string>() { "A", "I" }, this.Logger, transac).Select(z => z.ID).ToList();
                    if(discountRangeDIDs.Count > 0)
                    {
                        DiscountStdValueADO.GetInstant().GetByRangeDID(discountRangeDIDs, new List<string> { "A", "I" }, this.Logger, transac).ForEach(z =>
                        {
                            var valueID = DiscountStdValueADO.GetInstant().Import(transac, new sxsDiscountStdValue()
                            {
                                ID = z.ID
                                , DiscountStdRangeD_ID = z.DiscountStdRangeD_ID
                                , DiscountStdEffectiveDate_ID = z.DiscountStdEffectiveDate_ID
                                , DiscountPercent = z.DiscountPercent
                                , DiscountAmount = z.DiscountAmount
                                , IncreaseAmount = z.IncreaseAmount
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
                    dataRes.discountStdRangeHs.Add(tmp);
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
