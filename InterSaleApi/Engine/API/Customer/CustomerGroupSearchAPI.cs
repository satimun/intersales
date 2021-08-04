using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using InterSaleApi.ADO;
using InterSaleApi.Engine.Validate;
using InterSaleModel.Model.API.Request;
using InterSaleModel.Model.API.Response;
using InterSaleModel.Model.Entity;
using InterSaleModel.Model.Entity.Request;
using KKFCoreEngine.Constant;
using KKFCoreEngine.KKFException;
using System.Data.SqlClient;

namespace InterSaleApi.Engine.API
{
    public class CustomerGroupSearchAPI : BaseAPIEngine<CustomerGroupSearchRequest, CustomerGroupSearchResponse>
    {
        protected override string PermissionKey { get { return "PUBLIC_API"; } }
        protected override void ExecuteChild(CustomerGroupSearchRequest dataReq, CustomerGroupSearchResponse dataRes)
        {

            
                CustomerGroupADO.GetInstant().Search(dataReq.search, dataReq.groupType, dataReq.Status , this.Logger)
                .ForEach(x =>
               {
                   CustomerGroupSearchRQ tmp = new CustomerGroupSearchRQ();
                   tmp.ID = x.ID;
                   tmp.GroupType = x.GroupType;
                   tmp.Code = x.Code;
                   tmp.Description = x.Description;
                   tmp.Status = x.Status;

                   tmp.create.by = BaseValidate.GetEmpName(x.CreateBy);
                   tmp.create.datetime = BaseValidate.GetDateTimeString(x.CreateDate);

                   tmp.modify.by = BaseValidate.GetEmpName(x.ModifyBy);
                   tmp.modify.datetime = BaseValidate.GetDateTimeString(x.ModifyDate);

                   dataRes.customerGroups.Add(tmp);
               });

               
        }
    }
}
