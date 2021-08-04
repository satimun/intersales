using InterSaleApi.Engine.API.ShipmentPlanMain;
using InterSaleApi.Model.StaticValue;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleTest
{
    [TestClass]
    public class TestAPI
    {
        [TestMethod]
        public void TestShipmentPlanGetPlan()
        {
            ShipmentPlanMainGetPlanAPI api = new ShipmentPlanMainGetPlanAPI();
            var res = api.ExecuteResponse(null, new InterSaleModel.Model.API.Request.ShipmentPlanGetPlanRequest() { shipmentPlanMainID = 3 }, null);

            Console.WriteLine(Newtonsoft.Json.JsonConvert.SerializeObject(res));
        }
        [TestMethod]
        public void TestShipmentPlanGetReportAPI()
        {
            StaticValueManager.GetInstant().LoadInstantAll();
            ShipmentPlanGetReportAPI exc = new ShipmentPlanGetReportAPI();
            var res = exc.ExecuteResponse(null, new InterSaleModel.Model.API.Request.ShipmentPlanGetReportRequest()
            {
                costID = 51,
                //customerIDs = new List<int>(),
                saleEmployeeID = 4000704,
                planMonth = 4,
                planYear = 2018,
                planType = "M",
                zoneAccountIDs = new List<int>()
            });

            Console.WriteLine(Newtonsoft.Json.JsonConvert.SerializeObject(res));
        }
    }
}
