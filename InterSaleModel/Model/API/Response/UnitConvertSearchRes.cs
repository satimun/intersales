using InterSaleModel.Model.API.Response.PublicModel;
using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Response
{
    public class UnitConvertSearchRes : IResponseModel
    {
        public List<UnitConvert> unitConverts = new List<UnitConvert>();

        public class UnitConvert
        {
            public string formula { get; set; }
            public string description { get; set; }
            public bool round { get; set; }
            public INTIdCodeDescriptionModel unitGroupType { get; set; }
            public UnitType unitType { get; set; }
            public UnitType unitType2 { get; set; }
            public string status { get; set; }
            public ByDateTimeModel lastUpdate { get; set; }
            public ResultModel _result = new ResultModel();
        }

        public class UnitType : INTIdCodeDescriptionModel
        {
            public string symbol { get; set; }
        }

    }
}
