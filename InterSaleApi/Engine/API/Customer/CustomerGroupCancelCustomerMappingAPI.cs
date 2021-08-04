using InterSaleApi.ADO;
using InterSaleApi.Engine.API;
using InterSaleApi.Engine.Validate;
using InterSaleModel.Model.API.Request;
using InterSaleModel.Model.API.Response;
using KKFCoreEngine.Constant;
using KKFCoreEngine.KKFException;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;

namespace InterSaleModel.Model.API
{
    public class CustomerGroupCancelCustomerMappingAPI : BaseAPIEngine<CustomerGroupCancelCustomerMappingRequest, CustomerGroupCancelCustomerMappingReponse>
    {
        // CustomerGroupCancelCustomerMappingRequest ,CustomerGroupCancelCustomerMappingReponse
        protected override string PermissionKey { get { return "PRIVATE_API"; } }

        protected override void ExecuteChild(CustomerGroupCancelCustomerMappingRequest dataReq, CustomerGroupCancelCustomerMappingReponse dataRes)
        {
            var isSuccess = true;
            var conn = BaseADO.OpenConnection();
            conn.Open();
            SqlTransaction transac = conn.BeginTransaction();

            for (int i = 0; i < dataReq.customerMappings.Count; i++)
            {
                
                    CustomerGroupCancelCustomerMappingRes tmp = new CustomerGroupCancelCustomerMappingRes();


                    try
                    {

                        CustomerGroupADO.GetInstant().CancelCustomerMapping(transac, dataReq.customerMappings[i].customerGroupID,dataReq.customerMappings[i].customerID, this.employeeID, this.Logger)
                        .ForEach(x =>
                        {
                            tmp.customer.ID = x.Customer_ID;
                            tmp.customer.Description = x.CompanyName;
                            tmp.customer.Code = x.CustomerCode;

                            tmp.customerGroup.ID = x.CustomerGroup_ID;
                            tmp.customerGroup.Description = x.CustomerGroupDesc;
                            tmp.customerGroup.Code = x.CustomerCode;
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
                    dataRes.customerGroupMapping.Add(tmp);

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
