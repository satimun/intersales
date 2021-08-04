using InterSaleModel.Model.API.Response.PublicModel;
using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Response
{
    public class ProductTwineSizeSearchRes : IResponseModel
    {
        public List<TwineSize> twineSizes = new List<TwineSize>();
        public class TwineSize : SearchResModel
        {
            public INTIdCodeDescriptionModel productGroup { get; set; }
            public decimal filamentSize { get; set; }
            public decimal filamentAmount { get; set; }
            public string filamentWord { get; set; }
        }
    }
}
