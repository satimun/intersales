using InterSaleApi.ADO;
using InterSaleApi.Model.StaticValue;
using InterSaleModel.Model.API.Response.PublicModel;
using InterSaleModel.Model.Entity.Response;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using KKFCoreEngine.Util;
using System.Text.RegularExpressions;

namespace InterSaleApi.Engine.Validate
{
    public static class BaseValidate
    {
        public static string GetDateTimeString(DateTime? dt)
        {
            string dtx = "";
            if (dt.HasValue)
            {
                dtx += dt.Value.Year.ToString() + "-";
                dtx += (dt.Value.Month < 10 ? "0" + dt.Value.Month.ToString() : dt.Value.Month.ToString()) + "-";
                dtx += (dt.Value.Day < 10 ? "0" + dt.Value.Day.ToString() : dt.Value.Day.ToString());
                dtx += " ";
                dtx += (dt.Value.Hour < 10 ? "0" + dt.Value.Hour.ToString() : dt.Value.Hour.ToString()) + ":";
                dtx += (dt.Value.Minute < 10 ? "0" + dt.Value.Minute.ToString() : dt.Value.Minute.ToString()) + ":";
                dtx += (dt.Value.Second < 10 ? "0" + dt.Value.Second.ToString() : dt.Value.Second.ToString());
            }
            return dtx;
        }
        
        public static string GetDateString(DateTime? d)
        {
            string dx = "";
            if (d.HasValue)
            {
                dx += d.Value.Year.ToString() + "-";
                dx += (d.Value.Month < 10 ? "0" + d.Value.Month.ToString() : d.Value.Month.ToString()) + "-";
                dx += (d.Value.Day < 10 ? "0" + d.Value.Day.ToString() : d.Value.Day.ToString());
            }
            return dx;
        }

        internal static ByDateTimeModel GetByDateTime(object p1, object p2)
        {
            throw new NotImplementedException();
        }

        public static string GetDateTimeISO(DateTime? dt)
        {
            string dx = "";
            if (dt.HasValue)
            {
                dx = dt.Value.ToUniversalTime().ToString("s") + "Z";
            }
            return dx;
        }

        public static DateTime GetDateTime(string dt)
        {
            var tmp = dt.Split(" ");
            var d = tmp[0].Split("-");
            var t = tmp[1].Split(":");
            return new DateTime(int.Parse(d[0]), int.Parse(d[1]), int.Parse(d[2]), int.Parse(t[0]), int.Parse(t[1]), int.Parse(t[2]));
        }
        public static DateTime GetDate(string d)
        {
            try
            {
                var tmp = d.Split("-");
                return new DateTime(int.Parse(tmp[0]), int.Parse(tmp[1]), int.Parse(tmp[2]));
            }
            catch(Exception ex)
            {
                Console.WriteLine(ex.Message);
                return new DateTime(2000, 1, 1);
            }            
        }

        public static string GetEmpName (int? id)
        {
            string nameEmp = "";
            if (id.HasValue)
            {
                nameEmp = StaticValueManager.GetInstant()
                    .sxsEmployee.Where(x => x.ID == id.Value)
                    .Select(x => x.Code + " : " + x.Name)
                    .FirstOrDefault();
                //EmployeeADO.GetInstant().GetByID(id.Value).ForEach(y => { nameEmp = y.ID + " : " + y.Name; });
            }
            return nameEmp == null ? "" : nameEmp;
        }

        public static int? GetId(int id)
        {
            if(id == 0) return null;
            return id;
        }

        public static ByDateTimeModel GetByDateTime(int? byID, DateTime? dateTime)
        {
            return new ByDateTimeModel()
            {
                by = GetEmpName(byID),
                datetime = GetDateTimeString(dateTime)
            };
        }

        public static string GetTagDescription(decimal? minMeshSize, decimal? maxMeshSize, decimal? minMeshDepth, decimal? maxMeshDepth, decimal? minLength, decimal? maxLength, string meshSizeUnit = null, string meshDepthUnit = null, string LengthUnit = null)
        {
            if(meshSizeUnit == null) { meshSizeUnit = "cm"; }
            if(meshDepthUnit == null) { meshDepthUnit = "md"; }
            if(LengthUnit == null) { LengthUnit = "m"; }

            string o = "";
            if(minMeshSize == maxMeshSize) o += ( minMeshSize.HasValue? minMeshSize.Value.ToString("") : "any") + $" {meshSizeUnit} , "; 
            else o += (minMeshSize.HasValue ? minMeshSize.Value.ToString("") : "any") + " - " + (maxMeshSize.HasValue ? maxMeshSize.Value.ToString("") : "any") + $" {meshSizeUnit} , ";

            if (minMeshDepth == maxMeshDepth) o += (minMeshDepth.HasValue ? minMeshDepth.Value.ToString("") : "any") + $" {meshDepthUnit} , ";
            else o += (minMeshDepth.HasValue ? minMeshDepth.Value.ToString("") : "any") + " - " + (maxMeshDepth.HasValue ? maxMeshDepth.Value.ToString("") : "any") + $" {meshDepthUnit} , ";

            if (minLength == maxLength) o += (minLength.HasValue ? minLength.Value.ToString("") : "any") + $" {LengthUnit}";
            else o += (minLength.HasValue ? minLength.Value.ToString("") : "any") + " - " + (maxLength.HasValue ? maxLength.Value.ToString("") : "any") + $" {LengthUnit}";
            
            return o;
        }

        public static double StringToDouble(string s)
        {
            byte[] x = Encoding.ASCII.GetBytes(s);
            s = "";
            for (int i = 0; i < x.Length; i++)
            {
                s += x[i].ToString();
            }
            double result = double.Parse(s);
            return result;
        }

        public static bool DecimalRange(decimal? min, decimal? max, decimal? rmin, decimal? rmax)
        {
            if (!min.HasValue) min = 0;
            if (!max.HasValue) max = 9999999;
            if (!rmin.HasValue) rmin = 0;
            if (!rmax.HasValue) rmax = 9999999;

            if ((min <= rmin && max >= rmax) || (max >= rmin && max <= rmax) || (min <= rmin && max >= rmin) || (min >= rmin && max <= rmax)) {
                return true;
            }
            return false;
        }

        public static string DecimalToString(decimal? v)
        {
            return (v.HasValue ? v.Value.ToString("0.##") : "any");
        }

        public static List<ShipmentPlanWeeks> GetWeeks(int year, int month)
        {
            DateTime fdate = new DateTime(year, month, 1);
            DateTime ldate = fdate.AddMonths(1).AddDays(-1);

            var weeks = new List<ShipmentPlanWeeks>();

            var weeksTmp = new List<ShipmentPlanWeeks>();
            DateTime ptrDate = fdate;
            int weekNo = 1;

            while(ptrDate.Ticks <= ldate.Ticks)
            {
                weeksTmp.Add(new ShipmentPlanWeeks() { weekNo = weekNo, startDate = ptrDate });
                if((int)ptrDate.DayOfWeek == 0) { weekNo++; }
                ptrDate = ptrDate.AddDays(1);
            }
            weeksTmp.GroupBy(x => x.weekNo).ToList().ForEach(x => weeks.Add(new ShipmentPlanWeeks() { weekNo = x.First().weekNo, startDate = x.Min(y => y.startDate), endDate = x.Max(y => y.startDate)}));
            return weeks;
        }
    }
}
