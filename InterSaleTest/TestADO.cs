using InterSaleApi.Engine.API.ShipmentPlanMain;
using InterSaleModel.Model.API.Request.PublicRequest;
using InterSaleModel.Model.Entity;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;

namespace InterSaleTest
{
    [TestClass]
    public class TestADO
    {
        [TestMethod]
        public void Test_OutstandingSearchADO()
        {
            //var res = InterSaleApi.ADO.ShipmentPlanADO.GetInstant().SearchOutstanding(
            //    new DateTime(2016, 03, 02), new DateTime(2019, 03, 02),
            //    new List<string> { "A0001" },
            //    new List<string> { "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z" }
            //    );

            //res.ToList().Sort();
            //List<string> xxx = new List<string>();
            //res.OrderBy(x => x.BPL).ToList().ForEach(x => xxx.Add(x.BARCODE));

            //Console.WriteLine("DATA > " + res.Count);
            //Console.WriteLine(Newtonsoft.Json.JsonConvert.SerializeObject(res));
            //res.ForEach(x => Console.WriteLine(x.ORDERNO));
        }
        [TestMethod]
        public void Test_CustomerSearchADO()
        {
            //var res = InterSaleApi.ADO.CustomerADO.GetInstant().Search("A0", new List<string> { "A" });

            //Console.WriteLine("DATA > " + res.Count);
            //Console.WriteLine(Newtonsoft.Json.JsonConvert.SerializeObject(res));
        }
        [TestMethod]
        public void Test_ZoneAccountSearchADO()
        {
            var res = InterSaleApi.ADO.ZoneAccountADO.GetInstant().Search("A0", new List<string> { "A" });

            Console.WriteLine("DATA > " + res.Count);
            Console.WriteLine(Newtonsoft.Json.JsonConvert.SerializeObject(res));
            //res.ForEach(x => Console.WriteLine(x.ORDERNO));
        }
        [TestMethod]
        public void Test_OrderStandSaveADO()
        {
            string connStr = "Server=191.20.2.29;Uid=sa;PASSWORD=abc123;database=smartsale_dev;Max Pool Size=400;Connect Timeout=600;";
            using (SqlConnection conn = new SqlConnection(connStr))
            {
                conn.Open();
                SqlTransaction trans = conn.BeginTransaction();
                try
                {
                    //string cmd = "exec SP_Currency_GetByCode @code";
                    string cmd = "SP_Currency_GetByCode ";
                    Dapper.DynamicParameters param = new Dapper.DynamicParameters();
                    param.Add("@code", "U");

                    var res = Dapper.SqlMapper.Query<sxsCurrency>(conn, cmd, param, trans, true, null, System.Data.CommandType.StoredProcedure).ToList();
                    Console.WriteLine("Success>>");
                    res.ForEach(x => Console.WriteLine(x.Code));
                }
                catch (Exception ex)
                {
                    Console.WriteLine("ERROR>>");
                    Console.Error.WriteLine(ex.Message);
                }
                finally
                {
                    trans.Rollback();
                }
            }

        }
        [TestMethod]
        public void TestShipmentPlanGetPlan()
        {
            // InterSaleApi.Engine.API.ShipmentPlanMainGetPlanAPI api = new InterSaleApi.Engine.API.ShipmentPlanMainGetPlanAPI();
            // var res = api.ExecuteResponse(new InterSaleModel.Model.API.Request.ShipmentPlanGetPlanRequest() { shipmentPlanMainID = 3 });
            ShipmentPlanMainSearchProgressAPI api2 = new ShipmentPlanMainSearchProgressAPI();
            var res2 = api2.ExecuteResponse(null, new InterSaleModel.Model.API.Request.ShipmentPlanMainSearchProgressRequest()
            {
                customerIDs = new List<int>() { 1068 },
                planMonth = 3,
                planYear = 2018,
                saleEmployeeIDs = new List<int>(),
                zoneAccountIDs = new List<int>()
            }, null);

            Console.WriteLine(Newtonsoft.Json.JsonConvert.SerializeObject(res2));
        }


        [TestMethod]
        public void Test_RunningADO()
        {
            var res = InterSaleApi.ADO.RunningADO.GetInstant().Next_sxtShipmentPlanOrderStand_ID();

            Console.WriteLine("DATA > " + res);
            //res.ForEach(x => Console.WriteLine(x.ORDERNO));
        }

        [TestMethod]
        public void Test_UnitTypeADO()
        {
            var res = InterSaleApi.ADO.UnitTypeADO.GetInstant().Search(new SearchRequest() { groupTypes = new List<string>() { "M", "D", "L" } });

            Console.WriteLine("DATA > " + res);
            //res.ForEach(x => Console.WriteLine(x.ORDERNO));
        }


    }
}
