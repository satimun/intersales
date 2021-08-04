using InterSaleApi.ADO;
using InterSaleApi.Engine.Validate;
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
    public class PriceStdSaveMainAPI : BaseAPIEngine<PriceStdSaveMainReq, PriceStdSearchMainResponse>
    {
        protected override string PermissionKey { get { return "PRIVATE_API"; } }

        protected override void ExecuteChild(PriceStdSaveMainReq dataReq, PriceStdSearchMainResponse dataRes)
        {
            var isSuccess = true;
            var conn = BaseADO.OpenConnection();
            conn.Open();
            SqlTransaction transac = conn.BeginTransaction();

            dataReq.priceStdMains.ForEach(x => {
                var tmp = new PriceStdMains();
                try
                {
                    tmp.code = x.code;
                    tmp.type = x.type;
                    tmp.priceStdEffectiveDate = x.priceStdEffectiveDate;
                    tmp.productType = x.productType;
                    tmp.productGrade = x.productGrade;
                    tmp.countryGroup = x.countryGroup;
                    tmp.currency = x.currency;
                    tmp.status = x.status;
                    tmp._result._status = "S";
                    tmp._result._message = "SUCCESS";
                    var mainID = PriceStdMainADO.GetInstant().Import(transac, new sxsPriceStdMain() { Type = x.type, CountryGroup_ID = x.countryGroup.id??0, ProductType_ID = x.productType.id??0, ProductGrade_ID = x.productGrade.id, Currency_ID = x.currency.id??0, CreateBy = this.employeeID  }, x.code, this.Logger);
                    tmp.id = mainID;
                    if(tmp.id == 0) { throw new Exception("Save Fail."); }
                    //tmp.lastUpdate = BaseValidate.GetByDateTime((res.ModifyBy.HasValue ? res.ModifyBy : res.CreateBy), (res.ModifyDate.HasValue ? res.ModifyDate : res.CreateDate));
                }
                catch (Exception ex)
                {
                    tmp._result._status = "F";
                    tmp._result._message = ex.Message;
                    isSuccess = false;
                }
                finally
                {
                    dataRes.priceStdMains.Add(tmp);
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
