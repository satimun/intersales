using InterSaleApi.ADO;
using InterSaleApi.Engine.Validate;
using InterSaleModel.Model.API.Request;
using InterSaleModel.Model.API.Response;
using InterSaleModel.Model.API.Response.PublicModel;
using KKFCoreEngine.Constant;
using KKFCoreEngine.KKFException;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;

namespace InterSaleApi.Engine.API
{
    public class CountryGroupSaveAPI : BaseAPIEngine<CountryGroupSaveReq, CountryGroupsResponse>
    {
        protected override string PermissionKey { get { return "PRIVATE_API"; } }

        protected override void ExecuteChild(CountryGroupSaveReq dataReq, CountryGroupsResponse dataRes)
        {
            var isSuccess = true;
            var conn = BaseADO.OpenConnection();
            conn.Open();
            SqlTransaction transac = conn.BeginTransaction();

            dataReq.countryGroups.ForEach(x => {
                var tmp = new SearchResModel();
                try
                {
                    tmp.code = x.code;
                    tmp.groupType = x.groupType;
                    tmp.description = x.description;
                    tmp.status = x.status;
                    tmp._result._status = "S";
                    tmp._result._message = "SUCCESS";
                    var res = CountryGroupADO.GetInstant().Save(transac, x, this.employeeID, this.Logger).FirstOrDefault();
                    tmp.id = res.ID;
                    if (tmp.id == 0) { throw new Exception("Save Fail."); }
                    tmp.lastUpdate = BaseValidate.GetByDateTime((res.ModifyBy.HasValue ? res.ModifyBy : res.CreateBy), (res.ModifyDate.HasValue ? res.ModifyDate : res.CreateDate));
                }
                catch (Exception ex)
                {
                    tmp._result._status = "F";
                    tmp._result._message = ex.Message;
                    isSuccess = false;
                }
                finally
                {
                    dataRes.countryGroups.Add(tmp);
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
