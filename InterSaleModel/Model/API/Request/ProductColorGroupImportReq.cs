using InterSaleModel.Model.API.Response;
using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Request
{
    public class ProductColorGroupImportReq : IRequestModel
    {
        public List<ProductColorGroupSearchRes.ColorGroup> colorGroups { get; set; }
    }
}
