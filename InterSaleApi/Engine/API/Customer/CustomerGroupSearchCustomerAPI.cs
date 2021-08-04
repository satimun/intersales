using InterSaleApi.ADO;
using InterSaleApi.Engine.Validate;
using InterSaleModel.Model.API.Request;
using InterSaleModel.Model.API.Response;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InterSaleApi.Engine.API
{
    public class CustomerGroupSearchCustomerAPI: BaseAPIEngine<CustomerGroupSearchCustomerRequest, CustomerGroupSearchCustomerResponse>
    {
        // CustomerGroupSearchCustomerRequest , CustomerGroupSearchCustomerResponse
         protected override string PermissionKey { get { return "PUBLIC_API"; } }
         protected override void ExecuteChild(CustomerGroupSearchCustomerRequest dataReq, CustomerGroupSearchCustomerResponse dataRes)
         {
              for (int i = 0; i < dataReq.customerGroupIDs.Count; i++)
              {
                   CustomerGroupSearchCustomerRQ tmp = new CustomerGroupSearchCustomerRQ();

                   CustomerGroupADO.GetInstant().SearchCustomer(dataReq.search, dataReq.customerGroupIDs[i])
                   .ForEach(x =>
                   {
                       CustomerSearchCustomer Cus = new CustomerSearchCustomer();
                        tmp.ID = x.CustomerGroupID;
                        tmp.GroupType = x.CustomerGroupGroupType;
                        tmp.Code = x.CustomerGroupCode;
                        tmp.Description = x.CustomerGroupDesc;
                        tmp.Status = x.CustomerGroupStatus;

                        Cus.ID = x.CustomerID;
                        Cus.Code = x.CustomerCode;
                        Cus.Description = x.CompanyName;

                        Cus.ManagerEmployee.ID = x.EmployeeID;
                        Cus.ManagerEmployee.Code = x.EmployeeCode;
                        Cus.ManagerEmployee.Description = x.EmployeeName;

                        Cus.create.by = BaseValidate.GetEmpName(x.CreateBy);
                        Cus.create.datetime = BaseValidate.GetDateTimeString(x.CreateDate);

                        tmp.Customers.Add(Cus);
                   });
                dataRes.customerGroups.Add(tmp);

                tmp = new CustomerGroupSearchCustomerRQ();

                CustomerGroupADO.GetInstant().SearchCustomer(dataReq.search, "")
                .ForEach(x =>
                {
                    CustomerSearchCustomer Cus = new CustomerSearchCustomer();
                    tmp.ID = x.CustomerGroupID;
                    tmp.GroupType = x.CustomerGroupGroupType;
                    tmp.Code = x.CustomerGroupCode;
                    tmp.Description = x.CustomerGroupDesc;
                    tmp.Status = x.CustomerGroupStatus;

                    Cus.ID = x.CustomerID;
                    Cus.Code = x.CustomerCode;
                    Cus.Description = x.CompanyName;

                    Cus.ManagerEmployee.ID = x.EmployeeID;
                    Cus.ManagerEmployee.Code = x.EmployeeCode;
                    Cus.ManagerEmployee.Description = x.EmployeeName;

                    Cus.create.by = BaseValidate.GetEmpName(x.CreateBy);
                    Cus.create.datetime = BaseValidate.GetDateTimeString(x.CreateDate);

                    tmp.Customers.Add(Cus);
                });

                dataRes.customerGroups.Add(tmp);
            }
         }
    }
}
