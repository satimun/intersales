using InterSaleApi.ADO;
using InterSaleModel.Model.API.Request;
using InterSaleModel.Model.API.Response;
using KKFCoreEngine.Constant;
using KKFCoreEngine.KKFException;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;

namespace InterSaleApi.Engine.API
{
    public class CountryGroupMoveCountryMappingAPI : BaseAPIEngine<CountryGroupMoveCountryMappingRequest, CountryGroupMoveCountryMappingResponse>
    {
        protected override string PermissionKey { get { return "PRIVATE_API"; } }

        protected override void ExecuteChild(CountryGroupMoveCountryMappingRequest dataReq, CountryGroupMoveCountryMappingResponse dataRes)
        {

            var isSuccess = true;
            var conn = BaseADO.OpenConnection();
            conn.Open();
            SqlTransaction transac = conn.BeginTransaction();

            for (int i = 0; i < dataReq.countryIDs.Count; i++)
            {
                CountryGroupMoveCountryMappingRes tmp = new CountryGroupMoveCountryMappingRes();
                CountryMoveCountryMapping obj = new CountryMoveCountryMapping();

                try
                {

                    CountryGroupADO.GetInstant().MoveCountryMapping(transac, dataReq.countryGroupID, dataReq.countryIDs[i], this.employeeID, this.Logger)
                    .ForEach(x =>
                    {
                        tmp.ID = x.CountryGroup_ID;
                        tmp.GroupType = x.CountryGroupType;
                        tmp.Code = x.CountryGroupCode;
                        tmp.Description = x.CountryGroupDesc;
                        tmp.Status = x.CountryGroupStatus;

                        obj.ID = x.Country_ID;
                        obj.Code = x.CountryCode;
                        obj.Description = x.CountryDesc ;

                    }
                    );

                }
                catch (Exception ex)
                {
                    obj._result._status = "F";
                    obj._result._message = ex.Message;
                    isSuccess = false;
                }
                finally
                {

                    obj._result._status = "S";
                    obj._result._message = "SUCCESS";

                    tmp.Countrys.Add(obj);


                }

                dataRes.CountryGroup= tmp;
            }

            if (!isSuccess)
            {
                transac.Rollback();
                throw new KKFException(this.Logger, KKFExceptionCode.V0000, "การอัปเดตไม่สำเร็จ");
            }
            else { transac.Commit(); }
            conn.Close();
        }
    }
}
