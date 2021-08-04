using InterSaleModel.Model.API.Response.PublicModel;
using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Response
{
    
    public class UnitTypeSearchResponse : IResponseModel
    {
        public List<UnitType> unitTypes = new List<UnitType>();

        public class UnitType : SearchResModel
        {
            public string symbol { get; set; }
            public INTIdCodeDescriptionModel unit { get; set; }
            public INTIdCodeDescriptionModel unitGroupType { get; set; }
        }
    }
}
