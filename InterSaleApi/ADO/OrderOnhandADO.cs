using InterSaleModel.Model.API.Request;
using InterSaleModel.Model.Entity.Response;
using KKFCoreEngine.KKFLogger;
using KKFCoreEngine.Util;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InterSaleApi.ADO
{
    public class OrderOnhandADO : BaseADO
    {
        private static OrderOnhandADO instant;
        public static OrderOnhandADO GetInstant()
        {
            if (instant == null)
                instant = new OrderOnhandADO();
            return instant;
        }
        private OrderOnhandADO() { }

        public List<OrderOnhandSearch> Search(OrderOnhandReportReq d, Logger logger = null)
        {
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@showOrder", d.showOrder);
            param.Add("@dateFrom", DateTimeUtil.GetDate(d.dateFrom));
            param.Add("@dateTo", DateTimeUtil.GetDate(d.dateTo));
            param.Add("@invtoryDate", d.invtoryDate);
            param.Add("@closeBy", d.closeBy);
            param.Add("@admitDate", d.admitDate);
            param.Add("@onlyInventory", d.onlyInventory);
            param.Add("@deadstock", d.deadstock);

            param.Add("@customerIDs", d.customerIDs.Join(","));

            return QuerySP<OrderOnhandSearch>("SP_OrderOnhand_Search", param, logger).ToList();
        }

         public List<OrderOnhandSearch2> Search2(OrderOnhandReportReq d, Logger logger = null)
        {
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@showOrder", d.showOrder);
            param.Add("@dateFrom", DateTimeUtil.GetDate(d.dateFrom));
            param.Add("@dateTo", DateTimeUtil.GetDate(d.dateTo));
            param.Add("@invtoryDate", d.invtoryDate);
            param.Add("@closeBy", d.closeBy);
            param.Add("@admitDate", d.admitDate);
            param.Add("@onlyInventory", d.onlyInventory);
            param.Add("@deadstock", d.deadstock);

            param.Add("@customerIDs", d.customerIDs.Join(","));

            return QuerySP<OrderOnhandSearch2>("SP_OrderOnhand_Search2", param, logger).ToList();
        }
    }
}
