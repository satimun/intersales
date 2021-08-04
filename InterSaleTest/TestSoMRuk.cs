using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Collections.Generic;
using System.Text;
using System.Linq;
using KKFCoreEngine.Util;
using IBM.Data.DB2.Core;
using System.Text.RegularExpressions;

namespace InterSaleTest
{
    [TestClass]
    public class TestSoMRuk
    {
        [TestMethod]
        public void Test2()
        {
            //dynamic d = new[]
            //{
            //    new {id = 1,name = 2, eTest = "A" },
            //    new {id = 2,name = 3, eTest = "B" }
            //};

            //List<A> l = new List<A>();
            //l.Add(new A { x = 1, y = 1 });
            //l.Add(new A { x = 2, y = 2 });
            //l.Add(new A { x = 3, y = 3 });

            var d = new DateTime(2018,7,29);
            Console.WriteLine(d.DayOfYear);
            Console.WriteLine(d.AddDays(-1));
            Console.WriteLine(d.AddDays(-1).DayOfYear);
            Console.WriteLine(d.AddDays(1).DayOfYear);
            Console.WriteLine((int)d.DayOfWeek);

            //string str = null;

            //var tmp = str != null ? Encoding.ASCII.GetBytes(str).Length != 0 ? Encoding.ASCII.GetBytes(str)[0] : 0 : 0;

            var tmp = "";
            Console.WriteLine(string.IsNullOrWhiteSpace(tmp));
            //for ()
            //{
            //    Console.WriteLine("sfdfdsf");
            //    Console.WriteLine(c[i]);
            //}
            //Console.WriteLine(str.Substring(0));
            //l.ForEach(
            //    x => Console.WriteLine(x.x)
            //);
            //l.IsBetween(null, null);



            //if (l.Any(x => x.x <= 1 && x.y == 2))
            //{
            //    Console.WriteLine("true");
            //} else
            //{
            //    Console.WriteLine("false");
            //}

            //DB2Connection connect =
            //new DB2Connection("Database=SAMPLE;UserID=db2admin;Password=yourPass;Server=xxx.xxx.xxx.xxx:50000");

            //DB2Command MyDB2Command = null;
            //// Use the dsn alias that you defined in db2dsdriver.cfg with the db2cli writecfg command in step 1.
            ////String MyDb2ConnectionString = "database=HISERIES;uid=skkF;pwd=Profit2000;";
            //String MyDb2ConnectionString = "Database=HISERIES;UserID=skkF;Password=PROfit2000;Server=191.20.2.18:50000";
            //DB2Connection MyDb2Connection = new DB2Connection(MyDb2ConnectionString);
            //MyDb2Connection.Open();
            //MyDB2Command = MyDb2Connection.CreateCommand();
            //MyDB2Command.CommandText = "SELECT * from CUSTOMER";
            //Console.WriteLine(MyDB2Command.CommandText);

            //DB2DataReader MyDb2DataReader = null;
            //MyDb2DataReader = MyDB2Command.ExecuteReader();
            //Console.WriteLine("BRANCH\tCITY");
            //Console.WriteLine("============================");
            //while (MyDb2DataReader.Read())
            //{
            //    for (int i = 0; i <= 1; i++)
            //    {
            //        try
            //        {
            //            if (MyDb2DataReader.IsDBNull(i))
            //            {
            //                Console.Write("NULL");
            //            }
            //            else
            //            {
            //                Console.Write(MyDb2DataReader.GetString(i));
            //            }
            //        }
            //        catch (Exception e)
            //        {
            //            Console.Write(e.ToString());
            //        }
            //        Console.Write("\t");

            //    }
            //    Console.WriteLine("");
            //}
            //MyDb2DataReader.Close();
            //MyDB2Command.Dispose();
            //MyDb2Connection.Close();

        }

        public class A
        {
            public int x { get; set; }
            public int y { get; set; }
            public string z { get; set; }
        }

        [TestMethod]
        public void Test3()
        {
            //Regex pt = new Regex(@"ms/37");
            //Regex px = new Regex(@"\b^[0-9]+[/][0-9]+$\b");
            //List<string> arr = new List<string>() { "12.34mm", "7.00cm", "1.1/48\"", "2.54/8\"", "100yd(91.44)", "19ms/37\"", "13mm", "6ft..", "5ft", "2k", "3.34mtrs", "34kg/pc", "100yds(91.44)", "12ft", "12inch", "20/50" };
            //arr.ForEach(s =>
            //{
            //    //s = $"0{s}";
            //    string num = "";
            //    string unit = "";
            //    if(pt.Match(s).Success)
            //    {
            //        num = Regex.Replace(s, @"\b^([0-9]+).*$", "$1");
            //        unit = "ms/37\"";
            //    }
            //    else if (px.Match(s).Success)
            //    {
            //        num = Regex.Replace(s, @"\b^([0-9]+).*$", "$1");
            //        unit = Regex.Replace(s, @"\b^[0-9]+([/][0-9]+)$", "$1");
            //    }
            //    else
            //    {
            //        var tmp = Regex.Replace(s, "\"", "in");
            //        num = Regex.Replace(tmp, @"\b^([0-9]+?[.]?[0-9]+?[/]?[0-9]+)[a-z].*$", "$1");
            //        if(num.Equals(tmp)) { num = Regex.Replace(tmp, @"\b^([0-9]+).*$", "$1"); }
            //        unit = Regex.Replace(tmp, @"\b^.*[0-9]([a-z]+).*$", "$1");
            //    }

            //    switch (unit)
            //    {
            //        case "yds": unit = "yd"; break;
            //        case "y": unit = "yd"; break;

            //        case "mtrs": unit = "m"; break;

            //        case "lbs": unit = "lb"; break;

            //        case "k": unit = "kn"; break;
            //        case "knots": unit = "kn"; break;
            //        case "knot": unit = "kn"; break;

            //        case "kgs": unit = "kg"; break;

            //        case "gram": unit = "g"; break;

            //        case "fms": unit = "fm"; break;

            //        case "inch": unit = "\""; break;
            //        case "in": unit = "\""; break;
            //    }

            //    Console.WriteLine($"{s} --> {num} - {unit}");
            //});

            var minMeshSize = GetNumberAndUnit("19.99mmsq");
            var maxMeshSize = GetNumberAndUnit("4");
            var minMeshDepth = GetNumberAndUnit("");
            var maxMeshDepth = GetNumberAndUnit("12mtrs");
            var minLength = GetNumberAndUnit("2.1/4\"");
            var maxLength = GetNumberAndUnit("2.1/4\"");

            Console.WriteLine($"{GenDes(minMeshSize, maxMeshSize)} , {GenDes(minMeshDepth, maxMeshDepth)} , {GenDes(minLength, maxLength)}");

        }

        private numUnit GetNumberAndUnit(string s)
        {
            Regex pt = new Regex(@"ms/37");
            Regex px = new Regex(@"\b^[0-9]+[/][0-9]+$\b");
            string num = "";
            string unit = "";
            if (pt.Match(s).Success)
            {
                num = Regex.Replace(s, @"\b^([0-9]+).*$", "$1");
                unit = "ms/37\"";
            }
            else if (px.Match(s).Success)
            {
                num = Regex.Replace(s, @"\b^([0-9]+).*$", "$1");
                unit = Regex.Replace(s, @"\b^[0-9]+([/][0-9]+)$", "$1");
            }
            else
            {
                var tmp = Regex.Replace(s, "\"", "in");
                num = Regex.Replace(tmp, @"\b^([0-9]+?[.]?[0-9]+?[/]?[0-9]+)[a-z].*$", "$1");
                if (num.Equals(tmp)) { num = Regex.Replace(tmp, @"\b^([0-9]+).*$", "$1"); }
                unit = Regex.Replace(tmp, @"\b^.*[0-9]([a-z]+).*$", "$1");
                if(num.Equals(tmp)) { num = ""; }
                if (unit.Equals(tmp)) { unit = ""; }
            }

            switch (unit)
            {
                case "yds": unit = "yd"; break;
                case "y": unit = "yd"; break;

                case "mtrs": unit = "m"; break;

                case "lbs": unit = "lb"; break;

                case "k": unit = "kn"; break;
                case "knots": unit = "kn"; break;
                case "knot": unit = "kn"; break;

                case "kgs": unit = "kg"; break;

                case "gram": unit = "g"; break;

                case "fms": unit = "fm"; break;

                case "inch": unit = "\""; break;
                case "in": unit = "\""; break;

                case "msq": unit = "mmsq"; break;
                case "mmmsq": unit = "mmsq"; break;
            };

            return new numUnit() { num = num, unit = unit };
        }

        public class numUnit
        {
            public string num { get; set; }
            public string unit { get; set; }
        }

        private string GenDes(numUnit min, numUnit max)
        {
            if (!ChkNull(min) && !ChkNull(max))
            {
                if (min.unit == max.unit)
                {
                    if (min.num == max.num) { return $"{min.num} {min.unit}"; }
                    else { return $"{min.num} - {max.num} {min.unit}"; }
                }
            }
            else if (!ChkNull(min))
            {
                return $"{min.num} {min.unit}";
            }
            else if (!ChkNull(max))
            {
                return $"{max.num} {max.unit}";
            }
            return "-";
        }

        private bool ChkNull(numUnit x)
        {
            return x.num == "" || x.unit == "";
        }

    }
}
