using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Request
{
    public class UpdateStatusReq : IRequestModel
    {
        public List<int> ids { get; set; }
        public List<int> ids1 { get; set; }
        public string type { get; set; }
        public string status { get; set; }
        public string priceEffectiveDateID { get; set; }
        public string discountStdEffectiveDateID { get; set; }
    }
}
