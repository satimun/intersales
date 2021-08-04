using InterSaleModel.Model.API.Response.PublicModel;
using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Response
{
    public class UnitTypeProductTypeListRes : IResponseModel
    {
        public List<UnitTypePList> unitTypes = new List<UnitTypePList>();
        public class UnitTypePList
        {
            public INTIdCodeDescriptionModel productType { get; set; }
            public INTIdCodeDescriptionModel unitGroupType { get; set; }
            public UnitType p_unitType { get; set; }
            public List<UnitType> s_unitType { get; set; }
        }

        public class UnitType : INTIdCodeDescriptionModel
        {
            public string symbol { get; set; }
        }
    }
}
