using InterSaleModel.Model.API.Request;
using InterSaleModel.Model.API.Response;
using InterSaleModel.Model.API.Response.PublicModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InterSaleApi.Engine.API
{
    public class EmployeeSearchSaleAPI : BaseAPIEngine<EmployeeSearchSaleRequest, EmployeeSearchSaleResponse>
    {
        protected override string PermissionKey
        {
            get { return "PUBLIC_API"; }
        }

        protected override void ExecuteChild(EmployeeSearchSaleRequest dataRequest, EmployeeSearchSaleResponse dataResponse)
        {
            var res = ADO.EmployeeADO.GetInstant().SearchSale(
                dataRequest.search,  
                //new List<string> { "8076", "8081", "8096", "8120", "8124", "8144", "B108", "E011", "E033", "G021", "HS2L", "KSRV" },
                dataRequest.status, 
                this.Logger);
            dataResponse.employees = new List<EmployeeSearchSaleResponse.Employee>();
            res.ForEach(x => dataResponse.employees.Add(new EmployeeSearchSaleResponse.Employee()
            {
                id = x.ID,
                code = x.Code,
                description = x.Name,
                position = new INTIdCodeDescriptionModel()
                {
                    id = x.PositionID,
                    code = x.PositionCode,
                    description = x.PositionDescription
                },
                create = null,
                modify = null
            }));
        }
    }
}
