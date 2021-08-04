using InterSaleModel.Model.API.Response.PublicModel;
using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Response
{ 
    public class ConstantCustomerGroupTypeResponse : IResponseModel
    {
      //  public List<CustomerGroupTypeRQ> constants = new List<CustomerGroupTypeRQ>();
        public List<StringIdCodeDescriptionModel> CustomerGroupType = new List<StringIdCodeDescriptionModel>();
    }

    public class CustomerGroupTypeRQ
    {
        public StringIdCodeDescriptionModel constantsCustomerGroupType = new  StringIdCodeDescriptionModel();
        public ByDateTimeModel create = new ByDateTimeModel();
        public ByDateTimeModel modify = new ByDateTimeModel();
    }


}
