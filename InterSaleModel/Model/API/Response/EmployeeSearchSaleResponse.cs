using InterSaleModel.Model.API.Response.PublicModel;
using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Response
{
    public class EmployeeSearchSaleResponse : IResponseModel
    {
        public List<Employee> employees { get; set; }
        public class Employee : INTIdCodeDescriptionModel
        {
            public INTIdCodeDescriptionModel position { get; set; }
            public ByDateTimeModel create { get; set; }
            public ByDateTimeModel modify { get; set; }
        }
    }
}
