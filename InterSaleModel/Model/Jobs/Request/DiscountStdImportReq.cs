using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.Jobs.Request
{
    public class DiscountStdImportReq : IJRequestModel
    {
        public string customerCode { get; set; }
    }
}
