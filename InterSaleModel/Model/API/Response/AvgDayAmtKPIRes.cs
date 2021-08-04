using InterSaleModel.Model.API.Response.PublicModel;
using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Response
{
    public class AvgDayAmtKPIRes : IResponseModel
    {
        public List<AvgDay> avgDays = new List<AvgDay>();
        public class AvgDay
        {
            public int year { get; set; }
            public INTIdCodeDescriptionModel zone { get; set; }
            public int avgPeriodDay { get; set; }
            public string status { get; set; }
            public ByDateTimeModel lastUpdate { get; set; }
            public ResultModel _result = new ResultModel();
        }

    }
}
