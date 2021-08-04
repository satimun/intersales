using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.Jobs.Request
{
    public class PriceStdImportReq : IJRequestModel
    {
        public string countryGroupCode { get; set; }
    }
}
