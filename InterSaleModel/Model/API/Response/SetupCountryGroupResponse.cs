using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Response
{
    public class SetupCountryGroupResponse : IResponseModel
    {
        public List<CustomerGroupType> CustomerGroupTypeValues = new List<CustomerGroupType>();
    }


    public class CustomerGroupType
    {
        public int ID { get; set; }
        public string GroupType { get; set; }
        public string Code { get; set; }
        public string Description { get; set; }
        public string Status { get; set; }
        public int CreateBy { get; set; }
        public DateTime CreateDate { get; set; }
        public int? modifyBy { get; set; }
        public DateTime? modifyDate { get; set; }
    }
}
