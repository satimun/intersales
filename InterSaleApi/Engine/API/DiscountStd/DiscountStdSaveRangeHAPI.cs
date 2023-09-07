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

            dataReq.discountStdRangeHs.ForEach(req => {
                var tmp = new DiscountStdRangeHs();
                try
                {
                    tmp.discountStdMainID = req.discountStdMainID;
                    tmp.discountStdEffectiveDateID = req.discountStdEffectiveDateID;
                    tmp.colorGroups = req.colorGroups;
                    tmp.minTwineSize = req.minTwineSize;
                    tmp.maxTwineSize = req.maxTwineSize;
                    tmp.knot = req.knot;
                    tmp.selvageWovenType = req.selvageWovenType;
                    tmp.stretching = req.stretching;
                    tmp.unitType = req.unitType;
                    tmp.status = req.status;
                    tmp._result._status = "S";
                    tmp._result._message = "SUCCESS";

                    var rangeHID = DiscountStdRangeHADO.GetInstant().Import(transac, new sxsDiscountStdRangeH() {
                        ID = 0
                        , DiscountStdMain_ID = req.discountStdMainID
                        , DiscountStdEffectiveDate_ID = req.discountStdEffectiveDateID
                        , ProductKnot_ID = req.knot.id
                        , ProductStretching_ID = req.stretching.id
                        , ProductSelvageWovenType_ID = req.selvageWovenType.id
                        , UnitType_ID = req.unitType.id??0
                        , ProductColorGroup_ID = req.colorGroups.id
                        , Status = req.status
                        , MinProductTwineSizeCode = req.minTwineSize.code
                        , MinFilamentSize = req.minTwineSize.size
                        , MinFilamentAmount = req.minTwineSize.amount
                        , MinFilamentWord = StringUtil.GetStringValue(req.minTwineSize.word)
                        , MaxProductTwineSizeCode = req.maxTwineSize.code
                        , MaxFilamentSize = req.maxTwineSize.size
                        , MaxFilamentAmount = req.maxTwineSize.amount
                        , MaxFilamentWord = StringUtil.GetStringValue(req.maxTwineSize.word)
                        , CreateBy = this.employeeID
                    }, this.Logger);

                    tmp.id = rangeHID;
                    if (tmp.id == 0) { throw new Exception("Save Fail."); }

                    // get rangeH old
                    var rangeH = DiscountStdRangeHADO.GetInstant().GetById(req.id);
                    if(rangeH != null)
                    {
                        // get rangeD old 
                        var rangeDs = DiscountStdRangeDADO.GetInstant().GetByRangeHID(new List<int>() { rangeH.ID }, new List<string>() { "A", "I" }, this.Logger, transac);
                        foreach (var rangeD in rangeDs)
                        {
                            // copy rangeD
                            var rangeDID = DiscountStdRangeDADO.GetInstant().Import(transac, new sxsDiscountStdRangeD() {
                                ID = 0,
                                DiscountStdRangeH_ID = rangeHID, // new rangeH_ID
                                ProductTwineSeries_ID = rangeD.ProductTwineSeries_ID,
                                MinMeshSize = rangeD.MinMeshSize,
                                MaxMeshSize = rangeD.MaxMeshSize,
                                MinMeshDepth = rangeD.MinMeshDepth,
                                MaxMeshDepth = rangeD.MaxMeshDepth,
                                MinLength = rangeD.MinLength,
                                MaxLength = rangeD.MaxLength,
                                TagDescription = rangeD.TagDescription,
                                SalesDescription = rangeD.SalesDescription,
                                Status = rangeD.Status,
                                CreateBy = this.employeeID,
                                discountEffectiveDateID = tmp.discountStdEffectiveDateID
                            });

                            if (rangeDID == 0) { throw new Exception("Save Fail."); }

                            // get value old
                            var values = DiscountStdValueADO.GetInstant().GetByRangeDID(rangeD.ID, tmp.discountStdEffectiveDateID.Value, transac);
                            foreach (var value in values)
                            {
                                // copy value
                                var valueID = DiscountStdValueADO.GetInstant().Import(transac, new sxsDiscountStdValue()
                                {
                                    ID = 0
                                    , DiscountStdRangeD_ID = rangeDID
                                    , DiscountStdEffectiveDate_ID = tmp.discountStdEffectiveDateID.Value
                                    , DiscountPercent = value.DiscountPercent
                                    , DiscountAmount = value.DiscountAmount
                                    , IncreaseAmount = value.IncreaseAmount
                                    , CreateBy = this.employeeID
                                }, this.employeeID, "M");

                                if (valueID == 0) { throw new Exception("Save Fail."); }                            
                            }
                        }

                        // cancel rangeH, rangeD, value
                        DiscountStdRangeHADO.GetInstant().UpdateStatus(transac, new UpdateStatusReq() {
                            ids = new List<int>() { req.id },
                            status = "C",
                            discountStdEffectiveDateID = tmp.discountStdEffectiveDateID?.ToString()
                        }, this.employeeID);
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
