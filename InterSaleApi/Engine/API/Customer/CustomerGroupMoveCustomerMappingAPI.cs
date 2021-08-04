using InterSaleApi.ADO;
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

namespace InterSaleApi.Engine.API
{
    public class CustomerGroupMoveCustomerMappingAPI : BaseAPIEngine<CustomerGroupMoveCustomerMappingRequest, CustomerGroupMoveCustomerMappingResponse>
    {
        //CustomerGroupMoveCustomerMappingRequest,CustomerGroupMoveCustomerMappingResponse
        protected override string PermissionKey { get { return "PRIVATE_API"; } }

        protected override void ExecuteChild(CustomerGroupMoveCustomerMappingRequest dataReq, CustomerGroupMoveCustomerMappingResponse dataRes)
        {

            var isSuccess = true;
            var conn = BaseADO.OpenConnection();
            conn.Open();
            SqlTransaction transac = conn.BeginTransaction();

            for (int i = 0; i < dataReq.customerIDs.Count; i++)
            {
                CustomerGroupMoveCustomerMappingRes tmp = new CustomerGroupMoveCustomerMappingRes();
                CustomerMoveCustomerMapping obj = new CustomerMoveCustomerMapping();

                try
                {
                    
                    CustomerGroupADO.GetInstant().MoveCustomerMapping(transac, dataReq.customerGroupID, dataReq.customerIDs[i], this.employeeID, this.Logger)
                    .ForEach(x =>
                    {
                        tmp.ID = x.CustomerGroup_ID;
                        tmp.GroupType = x.GroupType;
                        tmp.Code = x.CustomerGroupCode;
                        tmp.Description = x.CustomerGroupDesc;
                        tmp.Status = x.Status;

                        obj.ID = x.Customer_ID;
                        obj.Code = x.CustomerCode;
                        obj.Description = x.CompanyName;
                       
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

                    tmp.customers.Add(obj);


                }

                dataRes.customerGroup = tmp;
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
