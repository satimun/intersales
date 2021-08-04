using InterSaleModel.Model.API.Request.PublicRequest;
using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Request
{
    public class SearchEffectiveDateReq : SearchRequest 
    {
        public string dateFrom { get; set; }
        public string dateTo { get; set; }
    }
}
