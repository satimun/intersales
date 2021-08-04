using InterSaleModel.Model.API.Response.PublicModel;
using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Response
{
    public class CustomerGroupSearchCustomerResponse : IResponseModel
    {
        public List<CustomerGroupSearchCustomerRQ> customerGroups = new List<CustomerGroupSearchCustomerRQ>();
    }

    public class CustomerGroupSearchCustomerRQ
    {
        public int ID { get; set; }
        public string GroupType { get; set; }
        public string Code { get; set; }
        public string Description { get; set; }
        public string Status { get; set; }
        public List<CustomerSearchCustomer> Customers = new List<CustomerSearchCustomer>();
    }

    public class CustomerSearchCustomer
    {
        public int ID { get; set; }
        public string Code { get; set; }
        public string Description { get; set; }
        public ManagerEmployeeSearchCustomer ManagerEmployee = new ManagerEmployeeSearchCustomer();
        public ByDateTimeModel create = new ByDateTimeModel();
    }

    public class ManagerEmployeeSearchCustomer
    {
        public int ID { get; set; }
        public string Code { get; set; }
        public string Description { get; set; }
    }


}
