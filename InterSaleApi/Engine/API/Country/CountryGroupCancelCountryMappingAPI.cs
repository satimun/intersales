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
    public class CountryGroupCancelCountryMappingAPI : BaseAPIEngine<CountryGroupCancelCountryMappingRequest, CountryGroupCancelCountryMappingResponse>
    {
        // CustomerGroupCancelCustomerMappingRequest ,CustomerGroupCancelCustomerMappingReponse
        protected override string PermissionKey { get { return "PRIVATE_API"; } }

        protected override void ExecuteChild(CountryGroupCancelCountryMappingRequest dataReq, CountryGroupCancelCountryMappingResponse dataRes)
        {
            var isSuccess = true;
            var conn = BaseADO.OpenConnection();
            conn.Open();
            SqlTransaction transac = conn.BeginTransaction();

            for (int i = 0; i < dataReq.countryMappings.Count; i++)
            {

                CountryGroupCancelCountryMappingRes tmp = new CountryGroupCancelCountryMappingRes();


                try
                {

                    CountryGroupADO.GetInstant().CancelCountryMapping(transac, dataReq.countryMappings[i].CountryGroupID , dataReq.countryMappings[i].CountryID ,this.employeeID, this.Logger)
                    .ForEach(x =>
                    {
                        tmp.Country.ID = x.Country_ID ;
                        tmp.Country.Description = x.CountryDesc;
                        tmp.Country.Code = x.CountryCode;

                        tmp.CountryGroup.ID = x.CountryGroup_ID;
                        tmp.CountryGroup.Description = x.CountryGroupDesc;
                        tmp.CountryGroup.Code = x.CountryGroupCode;
                    }
                    );

                }
                catch (Exception ex)
                {
                    tmp._result._status = "F";
                    tmp._result._message = ex.Message;
                    isSuccess = false;
                }
                finally
                {

                    tmp._result._status = "S";
                    tmp._result._message = "SUCCESS";



                }
                dataRes.CountryGroupMapping.Add(tmp);

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
