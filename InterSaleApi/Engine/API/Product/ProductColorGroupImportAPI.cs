using InterSaleApi.ADO;
using InterSaleApi.Engine.Validate;
using InterSaleModel.Model.API.Request;
using InterSaleModel.Model.API.Response;
using InterSaleModel.Model.API.Response.PublicModel;
using InterSaleModel.Model.Entity;
using KKFCoreEngine.Constant;
using KKFCoreEngine.KKFException;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;

namespace InterSaleApi.Engine.API.Product
{
    public class ProductColorGroupImportAPI : BaseAPIEngine<ProductColorGroupImportReq, ProductColorGroupSearchRes>
    {
        protected override string PermissionKey { get { return "PRIVATE_API"; } }

        protected override void ExecuteChild(ProductColorGroupImportReq dataReq, ProductColorGroupSearchRes dataRes)
        {
            var isSuccess = true;
            var conn = BaseADO.OpenConnection();
            conn.Open();
            SqlTransaction transac = conn.BeginTransaction();

            dataReq.colorGroups.ForEach(x => {
                var tmp = new ProductColorGroupSearchRes.ColorGroup();
                try
                {                    
                    tmp._result._status = "S";
                    tmp._result._message = "SUCCESS";

                    ProductColorGroupADO.GetInstant().Import(transac, x, this.employeeID, this.Logger).GroupBy(y => y.ID).ToList().ForEach(y =>
                    {
                        tmp.id = y.First().ID;
                        tmp.code = y.First().Code;
                        tmp.description = y.First().Description;
                        tmp.groupType = y.First().GroupType;
                        tmp.countryGroup = new INTIdCodeDescriptionModel() { id = y.First().CountryGroup_ID, code = y.First().CountryGroup_Code, description = y.First().CountryGroup_Des };
                        tmp.colors = y.Select(z => new INTIdCodeDescriptionModel() { id = z.ProductColor_ID, code = z.ProductColor_Code, description = z.ProductColor_Des }).ToList();
                        tmp.status = y.First().Status;
                        tmp.lastUpdate = BaseValidate.GetByDateTime((y.First().ModifyBy.HasValue ? y.First().ModifyBy : y.First().CreateBy), (y.First().ModifyDate.HasValue ? y.First().ModifyDate : y.First().CreateDate));
                    });

                    // price
                    List<int> priceRangeHIDs = PriceStdRangeHADO.GetInstant().GetColorGroupID(new List<int>() { tmp.id }, new List<string>() { "A", "I" }, this.Logger, transac).Select(z => z.ID).ToList();
                    List<int> priceRangeDIDs = PriceStdRangeDADO.GetInstant().GetByRangeHID(priceRangeHIDs, new List<string>() { "A", "I" }, this.Logger, transac).Select(z => z.ID).ToList();
                    if(priceRangeDIDs.Count > 0)
                    {
                        PriceStdValueADO.GetInstant().GetByRangeDID(priceRangeDIDs, new List<string> { "A", "I" }, this.Logger, transac).ForEach(z =>
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

                    // discount
                    List<int> discountRangeHIDs = DiscountStdRangeHADO.GetInstant().GetColorGroupID(new List<int>() { tmp.id }, new List<string>() { "A", "I" }, this.Logger, transac).Select(z => z.ID).ToList();
                    List<int> discountRangeDIDs = DiscountStdRangeDADO.GetInstant().GetByRangeHID(discountRangeHIDs, new List<string>() { "A", "I" }, this.Logger, transac).Select(z => z.ID).ToList();
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
                    dataRes.colorGroups.Add(tmp);
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
