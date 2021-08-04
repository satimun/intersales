using InterSaleModel.Model.API.Response.PublicModel;
using InterSaleModel.Model.Constant.ConstEnum;
using KKFCoreEngine.Util;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;

namespace InterSaleTest
{
    [TestClass]
    public class UnitTest1
    {
        [TestMethod]
        public void Test()
        {

            dynamic d = new[]
            {
                new {id = 1,name = "NameTestA", eTest = "A" },
                new {id = 2,name = "NameTestB", eTest = "B" }
            };
            string json = Newtonsoft.Json.JsonConvert.SerializeObject(d);
            //TestModel[] res = Newtonsoft.Json.JsonConvert.DeserializeObject<TestModel[]>(json);
            Console.WriteLine(json);
        }
        [TestMethod]
        public void Test2()
        {

            List<CodeDescModel> codes = new List<CodeDescModel>();
            codes.Add(new CodeDescModel() { code = "code1111", description = "description1111" });
            codes.Add(new CodeDescModel() { code = "code1111", description = "description1111" });
            codes.Add(new CodeDescModel() { code = "code1112", description = "description1111" });
            codes.Add(new CodeDescModel() { code = "code1111", description = "description1112" });
            codes.Add(new CodeDescModel() { code = "code1111", description = "description1111" });
            codes.GroupBy(x => new CodeDescModel { code = x.code, description = x.description }).Select(x => x.Key).ToList()
                .ForEach(x => Console.WriteLine(x.code + " / " + x.description));
        }
        [TestMethod]
        public void Test3()
        {
            var d = DateTime.Now;
            Console.WriteLine(d.DayOfYear);
            d = new DateTime(2018, 1, 1);
            Console.WriteLine(d.DayOfYear);
        }

    }
    public class TestModel
    {
        public int id { get; set; }
        public string name { get; set; }
        public EnumTest eTest { get; set; }
    }
    public enum EnumTest
    {
        TestA = 'A',
        TestB = 'B'
    }
}
