using InterSaleApi.Engine.API.ShipmentPlanMain;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleTest
{
    [TestClass]
    public class TestShipmentPlanAutoPlan
    {
        [TestMethod]
        public void MonthlyInit()
        {
            /*ShipmentPlanMainInsertMonthlyInitAPI api2 = new ShipmentPlanMainInsertMonthlyInitAPI();
            var res2 = api2.ExecuteResponse(null, new InterSaleModel.Model.API.Request.ShipmentPlanMainInsertMonthlyInitRequest()
            {
                customerID = 1068,
                planMonth = 1,
                planYear = 2018
            });

            Console.WriteLine(Newtonsoft.Json.JsonConvert.SerializeObject(res2));*/
        }
        [TestMethod]
        public void SaveAuto()
        {

            ShipmentPlanAutoPlanAPI api2 = new ShipmentPlanAutoPlanAPI();
            var res2 = api2.ExecuteResponse(null,
                new InterSaleModel.Model.API.Request.ShipmentPlanAutoPlanRequest()
                {
                    customerIDs = new List<int> { 1078 },
                    planMonth = 4,
                    planYear = 2018,
                    limitContainerPerWeeks = new List<int> { 0, 3, 3, 3, 3, 0 }
                });

            Console.WriteLine(Newtonsoft.Json.JsonConvert.SerializeObject(res2));
        }
    }
}
