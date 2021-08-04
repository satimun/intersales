using InterSaleApi.ADO;
using InterSaleApi.Engine.Validate;
using InterSaleModel.Model.API.Request;
using InterSaleModel.Model.API.Request.PublicRequest;
using InterSaleModel.Model.API.Response;
using InterSaleModel.Model.API.Response.PublicModel;
using KKFCoreEngine.Constant;
using KKFCoreEngine.KKFException;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;

namespace InterSaleApi.Engine.API.Country
{
    public class CountryGroupMoveCountryAPI : BaseAPIEngine<CountryGroupMoveCountryReq, CountryGroupMoveCountryRes>
    {
        protected override string PermissionKey { get { return "PRIVATE_API"; } }

        protected override void ExecuteChild(CountryGroupMoveCountryReq dataReq, CountryGroupMoveCountryRes dataRes)
        {
            var isSuccess = true;
            var conn = BaseADO.OpenConnection();
            conn.Open();
            SqlTransaction transac = conn.BeginTransaction();
            var tmp = new CountryGroupSearchCountryRes.CountryGroups();
            try
            {
                var res = CountryGroupADO.GetInstant().MoveCountry(transac, dataReq, this.employeeID, this.Logger);
                tmp.code = res.First().Code;
                tmp.groupType = res.First().GroupType;
                tmp.description = res.First().Description;
                tmp.status = res.First().Status;
                tmp.countrys = new List<CountryGroupSearchCountryRes.CountryGroups.Countrys>();
                tmp.lastUpdate = BaseValidate.GetByDateTime((res.First().ModifyBy.HasValue ? res.First().ModifyBy : res.First().CreateBy), (res.First().ModifyDate.HasValue ? res.First().ModifyDate : res.First().CreateDate));
                res.ForEach(x =>
                {
                   tmp.countrys.Add(new CountryGroupSearchCountryRes.CountryGroups.Countrys()
                   {
                       id = x.Country_ID
                       , code = x.Country_Code
                       , description = x.Country_Des
                       , lastUpdate = BaseValidate.GetByDateTime(x.UpdateBy, x.UpdateDate)
                       , regionalZone = new INTIdCodeDescriptionModel() { id = x.RegionalZone_ID, code = x.RegionalZone_Code, description = x.RegionalZone_Des }
                       , zone = new INTIdCodeDescriptionModel() { id = x.Zone_ID, code = x.Zone_Code, description = x.Zone_Des }
                   });
                });
                tmp._result._status = "S";
                tmp._result._message = "SUCCESS";                
            }
            catch (Exception ex)
            {
                tmp._result._status = "F";
                tmp._result._message = ex.Message;
                isSuccess = false;
            }
            finally
            {
                dataRes.countryGroups = tmp;
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
