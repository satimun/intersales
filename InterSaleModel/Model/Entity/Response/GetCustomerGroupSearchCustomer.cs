using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.Entity.Response
{
    public class GetCustomerGroupSearchCustomer
    {
        public int CustomerGroupID { get; set; }
        public string CustomerGroupCode { get; set; }
        public string CustomerGroupDesc { get; set; }
        public string CustomerGroupGroupType { get; set; }
        public string CustomerGroupStatus { get; set; }

        public int CustomerID { get; set; }        
        public string CustomerCode { get; set; }
        public string CompanyName { get; set; }

        public int EmployeeID { get; set; }
        public string EmployeeCode { get; set; }
        public string EmployeeName { get; set; }

        public int CreateBy { get; set; }
        public DateTime CreateDate { get; set; }

        
		  

    }
}
