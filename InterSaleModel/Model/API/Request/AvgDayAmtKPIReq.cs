using InterSaleModel.Model.API.Response;
using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.API.Request
{
    public class AvgDayAmtKPIReq : IRequestModel
    {
        public List<AvgDayAmtKPIRes.AvgDay> avgDays { get; set; }
    }
}
