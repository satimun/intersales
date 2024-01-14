using InterSaleModel.Model.API.Request;
using InterSaleModel.Model.API.Response;
using InterSaleModel.Model.API.Response.PublicModel;
using InterSaleModel.Model.Entity;
using InterSaleModel.Model.Entity.Response;
using KKFCoreEngine.KKFLogger;
using KKFCoreEngine.Util;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;

namespace InterSaleApi.ADO
{
    public class ShipmentPlanADO : BaseADO
    {
        private static ShipmentPlanADO instant;
        public static ShipmentPlanADO GetInstant()
        {
            if (instant == null)
                instant = new ShipmentPlanADO();
            return instant;
        }
        private ShipmentPlanADO() { }

        public List<OutstandingSearchCriteria> SearchOutstanding(DateTime admitDateFrom, DateTime admitDateTo, List<string> customerCodes, List<string> produtTypeCodes, int option, bool IgnoreAdmitDate, Logger logger = null)
        {
            var param = new Dapper.DynamicParameters();
            param.Add("@AdmitDateFrom", admitDateFrom);
            param.Add("@AdmitDateTo", admitDateTo);
            param.Add("@CustomerCodes", string.Join(',', customerCodes));
            param.Add("@ProductTypeCodes", string.Join(',', produtTypeCodes));
            param.Add("@option", option);
            param.Add("@ignoreAdmitDate", IgnoreAdmitDate);

            var res = this.QuerySP<OutstandingSearchCriteria>("SP_ShipmentPlan_Outstanding_Search", param, logger).ToList();

            //var volumes = this.ListVolume(logger);
            //foreach (var r in res)
            //{
            //    var vs = volumes.FindAll(x => x.PRODCODE == r.PRODCODE);
            //    if (vs.Count() > 0)
            //    {
            //        r.BPL = GetVolumeBPL(vs, r.P_QUANTITY / r.P_PACK);
            //        //r.B_VOLUME = GetVolume(vs, r.P_QUANTITY / r.P_PACK) * r.B_PACK;
            //        //r.INV_VOLUME= GetVolume(vs, r.B_QUANTITY);
            //        //r.D_VOLUME = GetVolume(vs, r.P_QUANTITY / r.P_PACK) * r.D_PACK;
            //        //r.P_VOLUME = GetVolume(vs, r.P_QUANTITY / r.P_PACK) * r.P_PACK;
            //    }
            //}

            //decimal GetVolumeBPL(List<ProductVolumeCriteria> vs, decimal qty)
            //{
            //    if (vs.Count() > 0)
            //    {
            //        var tmp = vs
            //            .Select(x => new { avg = Math.Abs(qty - x.RECVQTY) / x.RECVQTY, volume = x.VOLUME })
            //            .OrderBy(x => x.avg)
            //            .FirstOrDefault();
            //        if (tmp.avg < 0.10m) return tmp.volume;
            //    }
            //    return 0;
            //}

            return res;
        }

        public List<STKTRNInventoryCriteria> StockInventory_ListByOrder(List<string> orderNos, Logger logger = null)
        {
            var param = new Dapper.DynamicParameters();
            param.Add("@orderNos", string.Join(',', orderNos));
            var res = this.QuerySP<STKTRNInventoryCriteria>("dbo.SP_StockInventory_ListByOrder", param, logger).ToList();
            return res;
        }

        public List<ShipmentPlanGetStock> GetStock(List<string> orderNos, Logger logger = null)
        {
            var param = new Dapper.DynamicParameters();
            param.Add("@orderNos", string.Join(',', orderNos));
            var res = this.QuerySP<ShipmentPlanGetStock>("dbo.SP_ShipmentPlan_GetStock", param, logger).ToList();
            return res;
        }

        public List<ShipmentPlanGetPlanOrder> GetPlanOrder(List<string> orderNos, int planMonth, int planYear, Logger logger = null)
        {
            var param = new Dapper.DynamicParameters();
            param.Add("@planMonth", planMonth);
            param.Add("@planYear", planYear);
            param.Add("@orderNos", string.Join(',', orderNos));
            var res = this.QuerySP<ShipmentPlanGetPlanOrder>("dbo.SP_ShipmentPlan_GetPlanOrder", param, logger).ToList();
            return res;
        }

        public List<ShipmentPlanProgressCriteria> ListCustomerPlan(int planMonth, int planYear, List<int> saleEmployeeIDs, List<int> zoneAccountIDs, List<int> customerIDs, List<string> monthlyStatus, List<string> weeklyStatus, List<string> regzoneCodes, Logger logger)
        {
            var param = new Dapper.DynamicParameters();
            param.Add("@planMonth", planMonth);
            param.Add("@planYear", planYear);
            param.Add("@saleEmployeeIDs", string.Join(',', saleEmployeeIDs));
            param.Add("@zoneAccountIDs", string.Join(',', zoneAccountIDs));
            param.Add("@customerIDs", string.Join(',', customerIDs));
            param.Add("@monthlyStatus", string.Join(',', monthlyStatus));
            param.Add("@weeklyStatus", string.Join(',', weeklyStatus));
            param.Add("@regzoneCodes", string.Join(',', regzoneCodes));

            var res = this.QuerySP<ShipmentPlanProgressCriteria>("dbo.SP_ShipmentPlan_SearchProgress", param, logger).ToList();
            return res;
        }

        public List<ShipmentPlanOrderMarketCloseFlagCriteria> OrderMarketCloseFlag_ListByOrderNo(List<string> orderNos, Logger logger)
        {
            var param = new Dapper.DynamicParameters();
            param.Add("@orderNos", string.Join(',', orderNos));
            var res = this.QuerySP<ShipmentPlanOrderMarketCloseFlagCriteria>("dbo.SP_ShipmentPlan_OrderMarketCloseFlag_ListByOrderNo", param, logger).ToList();
            return res;
        }

        public List<ShipmentPlanGetForecastReport> GetForecastReport(ShipmentPlanGetReportRequest d, Logger logger)
        {
            var param = new Dapper.DynamicParameters();
            param.Add("@planMonthFrom", d.planMonthFrom);
            param.Add("@planMonthTo", d.planMonthTo);
            param.Add("@planYear", d.planYear);
            param.Add("@costID", d.costID);
            param.Add("@regionalZoneIDs", string.Join(',', d.regionalZoneIDs));
            param.Add("@zoneAccountIDs", string.Join(',', d.zoneAccountIDs));
            param.Add("@customerIDs", string.Join(',', d.customerIDs));
            param.Add("@saleEmployeeID", d.saleEmployeeID);

            var res = this.QuerySP<ShipmentPlanGetForecastReport>("SP_ShipmentPlan_GetForecastReport", param, logger).ToList();
            return res;
        }

        public List<ShipmentPlanGetForecastReport> GetForecastReport(ShipmentPlanGetForecastReportReq d, Logger logger)
        {
            var param = new Dapper.DynamicParameters();
            param.Add("@dateFrom", d.dateFrom);
            param.Add("@dateTo", d.dateTo);
            param.Add("@customerIDs", string.Join(',', d.customerIDs));
            param.Add("@zoneAccountIDs", string.Join(',', d.zoneAccountIDs));
            param.Add("@regionalZoneIDs", string.Join(',', d.regionalZoneIDs));
            param.Add("@costID", d.costID);
            param.Add("@saleEmployeeID", d.saleEmployeeID);

            return this.QuerySP<ShipmentPlanGetForecastReport>("SP_ShipmentPlan_GetForecastReport3", param, logger).ToList();
        }

        //public List<ShipmentPlanGetForecastReport> GetForecastReport(ShipmentPlanGetForecastReportReq d, Logger logger)
        //{
        //    var param = new Dapper.DynamicParameters();
        //    param.Add("@dateFrom", d.dateFrom);
        //    param.Add("@dateTo", d.dateTo);
        //    param.Add("@customerIDs", string.Join(',', d.customerIDs));
        //    param.Add("@zoneAccountIDs", string.Join(',', d.zoneAccountIDs));
        //    param.Add("@regionalZoneIDs", string.Join(',', d.regionalZoneIDs));
        //    param.Add("@costID", d.costID);
        //    param.Add("@saleEmployeeID", d.saleEmployeeID);

        //    return this.QuerySP<ShipmentPlanGetForecastReport>("SP_ShipmentPlan_GetForecastReport3", param, logger).ToList();
        //}

        public List<ShipmentPlanCostIDCriteria> PlanCostID_ListByYear(int Year, Logger logger)
        {
            var param = new Dapper.DynamicParameters();
            param.Add("@Year", Year);

            var res = this.QuerySP<ShipmentPlanCostIDCriteria>("SP_ShipmentPlanPlanCostID_ListByYear", param, logger).ToList();
            return res;
        }

        public List<ShipmentPlanTragetValueCriteria> TragetValue(int planMonthFrom, int planMonthTo, int planYearFrom, int planYearTo, string planType, List<int> zoneIDs, Logger logger)
        {
            var param = new Dapper.DynamicParameters();
            param.Add("@planMonthFrom", planMonthFrom);
            param.Add("@planMonthTo", planMonthTo);
            param.Add("@planYearFrom", planYearFrom);
            param.Add("@planYearTo", planYearTo);
            param.Add("@planType", planType);
            param.Add("@zoneIDs", string.Join(',', zoneIDs));

            var res = this.QuerySP<ShipmentPlanTragetValueCriteria>("dbo.SP_ShipmentPlan_TragetValue_V2", param, logger).ToList();
            return res;
        }


        public List<ShipmentPlanGetReportCriteria> GetReport(string planType, int planMonth, int planYear, int saleEmployeeID, List<int> zoneAccountIDs, List<int> regionalZoneIDs, List<int> weeks, Logger logger)
        {
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@planType", planType);
            param.Add("@planMonth", planMonth);
            param.Add("@planYear", planYear);
            param.Add("@saleEmployeeID", saleEmployeeID);
            param.Add("@zoneAccountIDs", string.Join(',', zoneAccountIDs));
            param.Add("@regionalZoneIDs", string.Join(',', regionalZoneIDs));
            param.Add("@weeks", string.Join(',', weeks));

            var res = this.QuerySP<ShipmentPlanGetReportCriteria>("SP_ShipmentPlan_GetReport", param, logger).ToList();
            return res;
        }

        public List<ProductVolumeCriteria> ListVolume(Logger logger)
        {
            var res = this.QuerySP<ProductVolumeCriteria>("SP_ProductVolume_List", null, logger).ToList();
            return res;
        }

        public List<sxsFreightContainer> ListContainerSize(Logger logger)
        {
            var res = this.QuerySP<sxsFreightContainer>("SP_FreighContainer_List", null, logger).ToList();
            return res;
        }
        public List<INTIdCodeDescriptionModel> ListRegionalZone(Logger logger)
        {
            var res = this.QuerySP<INTIdCodeDescriptionModel>("SP_RegionalZone_List", null, logger).ToList();
            return res;
        }

        public List<ShipmetPlanGetVolume> GetVolume(Logger logger)
        {
            var res = this.QuerySP<ShipmetPlanGetVolume>("SP_ShipmentPlan_GetVolume", null, logger).ToList();
            return res;
        }

        public List<ShipmentPlanRelationLastRevisionCriteria> GetPlanForApprove(ShipmentPlanMainGetPlanForApproveReq d, List<string> status, Logger logger)
        {
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@planMonth", d.planMonth);
            param.Add("@planYear", d.planYear);
            param.Add("@regionalManagerIDs", string.Join(',', d.regionalManagerIDs));
            param.Add("@saleEmployeeIDs", string.Join(',', d.saleEmployeeIDs));
            param.Add("@regionalZoneIDs", string.Join(',', d.regionalZoneIDs));
            param.Add("@zoneAccountIDs", string.Join(',', d.zoneAccountIDs));
            param.Add("@customerIDs", string.Join(',', d.customerIDs));
            param.Add("@shipmentStatus", string.Join(',', status));

            var res = this.QuerySP<ShipmentPlanRelationLastRevisionCriteria>("SP_ShipmentPlan_GetPlanForApprove", param, logger).ToList();
            return res;
        }

        public List<ShipmentPlanGetPackList> GetPackList(ShipmentPlanGetPackListReq d, Logger logger = null)
        {
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@planMonth", d.planMonth);
            param.Add("@planYear", d.planYear);
            param.Add("@customerIDs", string.Join(',', d.customerIDs));
            param.Add("@planWeek", d.planWeek);

            var res = this.QuerySP<ShipmentPlanGetPackList>("SP_ShipmentPlan_GetPackList", param, logger).ToList();
            return res;
        }

        public List<OutstandingSearchCriteria> GetOutstanding(DateTime admitDateFrom, DateTime admitDateTo, List<string> customerCodes, List<string> produtTypeCodes, List<string> orderCodes, List<string> productCodes, List<string> packlistCodes, Logger logger = null)
        {
            String str = "";
            productCodes.ForEach(x => str += x + "~");
            var param = new Dapper.DynamicParameters();
            param.Add("@AdmitDateFrom", admitDateFrom);
            param.Add("@AdmitDateTo", admitDateTo);
            param.Add("@CustomerCodes", string.Join(',', customerCodes));
            param.Add("@ProductTypeCodes", string.Join(',', produtTypeCodes));
            param.Add("@orderCodes", string.Join(',', orderCodes));
            param.Add("@productCodes", String.Join("~", productCodes));
            param.Add("@packlistCodes", string.Join(',', packlistCodes));


            var res = this.QuerySP<OutstandingSearchCriteria>("SP_ShipmentPlan_GetOutstanding", param, logger).ToList();
            return res;
        }

        public List<ShipmentPlanGetActual> GetActual(DateTime dateFrom, DateTime dateTo, int? zoneID, int? countryID, int? customerID, string productType, string diameter, string color, bool otherProduct, Logger logger = null)
        {
            var param = new Dapper.DynamicParameters();
            param.Add("@dateFrom", dateFrom);
            param.Add("@dateTo", dateTo);
            param.Add("@zoneID", zoneID);
            param.Add("@countryID", countryID);
            param.Add("@customerID", customerID);
            param.Add("@productType", productType);
            param.Add("@diameter", diameter);
            param.Add("@color", color);
            param.Add("@otherProduct", otherProduct);

            var res = this.QuerySP<ShipmentPlanGetActual>("SP_ShipmentPlan_GetActual", param, logger).ToList();
            return res;
        }

        public List<ShipmentPlanBookingTransport> BookingTransport(ShipmentPlanGetReportRequest d, Logger logger = null)
        {
            var param = new Dapper.DynamicParameters();
            param.Add("@planMonth", d.planMonth);
            param.Add("@planYear", d.planYear);
            param.Add("@weeks", String.Join(",", d.weeks));
            param.Add("@regionalZoneIDs", String.Join(",", d.regionalZoneIDs));
            param.Add("@zoneAccountIDs", String.Join(",", d.zoneAccountIDs));
            param.Add("@customerIDs", String.Join(",", d.customerIDs));

            var res = this.QuerySP<ShipmentPlanBookingTransport>("SP_ShipmentPlan_BookingTransport", param, logger).ToList();
            return res;
        }

        public List<ShipmentPlanBookingTransport> MarkBookingTransport(SqlTransaction transac, ShipmentPlanBookingTransportRes.BookingTransport d, int empID, Logger logger = null)
        {
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@planHID", d.planHID);
            param.Add("@portLoadingID", d.portLoading.id);
            param.Add("@empID", empID);

            return QuerySP<ShipmentPlanBookingTransport>(transac, "SP_ShipmentPlan_MarkBookingTransport", param, logger).ToList();
        }

        public List<ShipmentPlanGetPayAmount> GetPayAmount(List<string> piCodes, Logger logger = null)
        {
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@piCodes", string.Join(",", piCodes));

            return QuerySP<ShipmentPlanGetPayAmount>("SP_ShipmentPlan_GetPayAmount", param, logger).ToList();
        }

        public List<ShipmentPlanGetCustomerGroup> GetCustomerGroup(List<int> customerIDs, Logger logger = null)
        {
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@customerIDs", string.Join(",", customerIDs));

            return QuerySP<ShipmentPlanGetCustomerGroup>("SP_ShipmentPlan_GetCustomerGroup", param, logger).ToList();
        }

        public List<ShipmentPlanRelationLastRevisionCriteria> GetPlanForReplace(int planMonth, int planYear, List<int> customerIDs, string planType, int? planWeek, Logger logger = null)
        {
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@planMonth", planMonth);
            param.Add("@planYear", planYear);
            param.Add("@customerIDs", string.Join(',', customerIDs));
            param.Add("@planType", planType);
            param.Add("@planWeek", planWeek);

            return QuerySP<ShipmentPlanRelationLastRevisionCriteria>("SP_ShipmentPlan_GetPlanForReplace", param, logger).ToList();
        }

        public List<ShipmentPlanSearchPlan> SearchPlan(ShipmentPlanMainGetPlanForApproveReq d, Logger logger = null)
        {
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@planMonth", d.planMonth);
            param.Add("@planYear", d.planYear);
            param.Add("@saleEmployeeIDs", d.saleEmployeeIDs.Join(","));
            param.Add("@zoneAccountIDs", d.zoneAccountIDs.Join(","));
            param.Add("@customerIDs", d.customerIDs.Join(","));
            param.Add("@regionalZoneIDs", d.regionalZoneIDs.Join(","));

            return QuerySP<ShipmentPlanSearchPlan>("SP_ShipmentPlan_SearchPlan", param, logger).ToList();
        }

        public List<ShipmentPlanOutInv> OutInv(DateTime admitDateFrom, DateTime admitDateTo, int option, Logger logger = null)
        {
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@AdmitDateFrom", admitDateFrom);
            param.Add("@AdmitDateTo", admitDateTo);
            param.Add("@option", option);

            return QuerySP<ShipmentPlanOutInv>("SP_ShipmentPlan_OutInv", param, logger).ToList();
        }

        public int OutstandProcessDelete(Logger logger = null)
        {
            return ExecuteScalar<int>("DELETE FROM sxtShipmentPlanOutstandProcess", null, logger);
        }

        public List<sxtShipmentPlanOutstandProcess> OutstandProcessSave(ShipmentPlanOutInv d, int option, Logger logger = null, SqlTransaction transac = null)
        {
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@customerCode", d.CUSCOD);
            param.Add("@currencyCode", d.CURRENCYCODE);
            param.Add("@outstandQuantity", d.B_QUANTITY);
            param.Add("@outstandWeight", d.B_WEIGHT);
            param.Add("@outstandBale", d.B_PACK);
            param.Add("@outstandVolume", d.B_VOLUME);
            param.Add("@outstandValue", d.B_VALUE);
            param.Add("@invQuantity", d.INV_QUANTITY);
            param.Add("@invWeight", d.INV_WEIGHT);
            param.Add("@invBale", d.INV_PACK);
            param.Add("@invVolume", d.INV_VOLUME);
            param.Add("@invValue", d.INV_VALUE);
            param.Add("@option", option);

            return QuerySP<sxtShipmentPlanOutstandProcess>(transac, "SP_ShipmentPlan_OutstandProcessSave", param, logger).ToList();
        }

        public List<sxtShipmentPlanOutstandProcess> GetOutstandProcess(List<int> customerIDs, int option, Logger logger = null)
        {
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@customerIDs", StringUtil.Join(",", customerIDs));
            param.Add("@option", option);

            return QuerySP<sxtShipmentPlanOutstandProcess>("SP_ShipmentPlan_GetOutstandProcess", param, logger).ToList();
        }

        public List<ShipmentPlanGetData> GetData(ShipmentPlanGetReportRequest d, Logger logger = null)
        {
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@planType", d.planType);
            param.Add("@planMonth", d.planMonth);
            param.Add("@planYear", d.planYear);
            param.Add("@saleEmployeeID", d.saleEmployeeID);
            param.Add("@zoneAccountIDs", StringUtil.Join(",", d.zoneAccountIDs));
            param.Add("@option", d.option);

            return QuerySP<ShipmentPlanGetData>("SP_ShipmentPlan_GetData", param, logger).ToList();
        }

        public int SaveRemark(int? planHID, string ciCode, int? remarkID, int empID, Logger logger = null)
        {
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@planHID", planHID);
            param.Add("@ciCode", ciCode);
            param.Add("@remarkID", remarkID);
            param.Add("@empID", empID);

            return ExecuteNonQuerySP("SP_ShipmentPlan_SaveRemark", param, logger);
        }

        public List<ShipmentPlanGetReport2> GetReport2(ShipmentPlanGetReport2Req d, Logger logger = null)
        {
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@year", d.year);
            param.Add("@monthFrom", d.monthFrom);
            param.Add("@monthTo", d.monthTo);
            param.Add("@type", d.type);
            param.Add("@regionalZoneIDs", StringUtil.Join(",", d.regionalZoneIDs));
            param.Add("@zoneAccountIDs", StringUtil.Join(",", d.zoneAccountIDs));
            param.Add("@saleEmployeeIDs", StringUtil.Join(",", d.saleEmployeeIDs));
            param.Add("@option", d.option);

            return QuerySP<ShipmentPlanGetReport2>("SP_ShipmentPlan_GetReport2", param, logger).ToList();
        }

        public List<ShipmentPlanForecastReport2> GetReportForcast(ShipmentPlanForecastReport2Req d, Logger logger = null)
        {
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@dateFrom", d.dateFrom);
            param.Add("@dateTo", d.dateTo);
            param.Add("@costID", d.costID);
            param.Add("@customerNull", ListUtil.ListNull(d.customerCodes));

            string cmd = "SELECT " +
                "'F' 'CodeType', " +
                "fcy.YR 'Year', " +
                "fcy.MN 'Month', " +
                "RTRIM(fcy.CUSCOD) 'CustomerCode', " +
                "CAST(fcy.WEIGHTGRW AS DEC(14,2)) 'Weightkg', " +
                "IIF(gp.PRODUCTTYPECODE IN ('H','P'), " +
                    "IIF(STD_WEI IS NULL OR STD_WEI = 0, 0, ROUND((GROUPPRICE + (GROUPPRICE * ISNULL(PERCENADJ,0)/100.00)) * EXCHRT *  FLOOR((WEIGHTGRW * 1000.00 / STD_WEI)), 2)), " +
                    "ROUND((KGPRICE + (KGPRICE * ISNULL(PERCENADJ,0)/100.00)) * EXCHRT * WEIGHTGRW, 2) " +
                ") 'Value', " +
                (d.ProductTypeCode ? "gp.PRODUCTTYPECODE" : "NULL") + " 'ProductTypeCode', " +
                (d.Diameter ? "RTRIM(gp.TWINESIZE)" : "NULL") + " 'Diameter', " +
                (d.DiameterLB ? "RTRIM(gp.TWINESIZELB)" : "NULL") + " 'DiameterLB', " +
                (d.MeshSizeLB ? "RTRIM(gp.EYESIZELB)" : "NULL") + " 'MeshSizeLB', " +
                (d.MeshDepthLB ? "RTRIM(gp.EYEAMOUNTLB)" : "NULL") + " 'MeshDepthLB', " +
                (d.LengthLB ? "RTRIM(gp.LENGTHLB)" : "NULL") + " 'LengthLB', " +
                (d.KnotTypeCode ? "RTRIM(gp.KNOTTYPECODE)" : "NULL") + " 'KnotTypeCode', " +
                (d.StretchingCode ? "RTRIM(gp.STRETCHINGTYPECODE)" : "NULL") + " 'StretchingCode', " +
                (d.QualityCode ? "RTRIM(fcy.PQGRADECD)" : "NULL") + " 'QualityCode', " +
                "NULL 'LabelCode', " +
                "NULL 'shippingMark', " +
                "NULL 'dynamictext2', " +
                (d.ColorCode ? "RTRIM(gp.COLORSTD)" : "NULL") + " 'ColorCode' " +
                "FROM saleex.dbo.VFORCASTYEAR fcy " +
                "INNER JOIN saleex.dbo.FORCASTEXCH fce ON fce.YR=fcy.YR AND fce.CURRENCYCODE = fcy.CURRENCYCODE AND fce.CONDTYPE='1' " +
                "INNER JOIN saleex.dbo.VGENPROD gp ON gp.PRODCODE=fcy.PRODCODE " +
                "INNER JOIN saleex.dbo.CUSTOMER c ON c.CUSCOD = fcy.CUSCOD " +
                (!d.dstkflag ? " AND c.DSTKFLAG <> 'Y' " : "") +
                "LEFT JOIN saleex.dbo.FORCASTPERCENADJH fcah ON fcah.YR=fcy.YR AND fcah.CUSCOD=fcy.CUSCOD AND fcah.CONDTYPE='1' " +
                "LEFT JOIN saleex.dbo.FORCASTPERCENADJD fcad ON fcah.SEQD=fcad.SEQD AND fcad.PQGRADECD = fcy.PQGRADECD AND fcad.TWINESIZE = gp.TWINESIZE " +
                    "AND fcad.KNOTTYPECODE = gp.KNOTDAI AND fcad.PRODUCTTYPECODE = gp.PRODUCTTYPECODE " +
                "LEFT JOIN saleex.dbo.FORCASTSTDCOST fsc ON fsc.YR=fcy.YR AND fsc.COSTID=@costID " +
                    "AND fsc.SOFTQUALCD = fcy.SOFTQUALCD  AND fcy.PRODCODE = fsc.PRODCODE " +
                    "AND fcy.PQGRADECD = fsc.PQGRADECD AND fcy.PRBLMID = fsc.PRBLMID AND fcy.SOURCE = fsc.SOURCE " +
                "WHERE " +
                "( " +
                    "YEAR(@dateFrom) <> YEAR(@dateTo) " +
                    "AND " +
                    "( " +
                        "( " +
                            "fcy.YR BETWEEN YEAR(@dateFrom) AND YEAR(@dateTo) " +
                            "AND ( fcy.MN BETWEEN MONTH(@dateFrom) AND MONTH(@dateTo) ) " +
                        ") " +
                        "OR " +
                        "( " +
                            "MONTH(@dateFrom) > MONTH(@dateTo) " +
                            "AND dbo.FN_DateRange( CONVERT(date, CONCAT(fcy.YR, '-', fcy.MN, '-', '1')), CONVERT(date, CONCAT(fcy.YR, '-', fcy.MN, '-', '1')), @dateFrom, @dateTo) = 1 " +
                        ") " +
                    ") " +
                    "OR YEAR(@dateFrom) = YEAR(@dateTo) " +
                ") " +
                "AND CONVERT(date, CONCAT(fcy.YR, '-', fcy.MN, '-', '1')) BETWEEN @dateFrom AND @dateTo " +
                $"AND ( @customerNull IS NULL OR fcy.CUSCOD IN ('{d.customerCodes.Join("','")}') )";

            return Query<ShipmentPlanForecastReport2>(cmd, param, logger).ToList();
        }

        public List<ShipmentPlanForecastReport2> GetReportActual(ShipmentPlanForecastReport2Req d, string CodeType = "A", Logger logger = null)
        {

            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            if (CodeType == "A")
            {
                param.Add("@dateFrom", d.dateFrom);
                param.Add("@dateTo", d.dateTo);
            }
            else
            {
                var dateFrom = DateTimeUtil.GetDate(d.dateFrom).Value.AddYears(-1);
                var dateTo = DateTimeUtil.GetDate(d.dateTo).Value.AddYears(-1);
                param.Add("@dateFrom", dateFrom);
                param.Add("@dateTo", dateTo);
            }
            param.Add("@customerNull", ListUtil.ListNull(d.customerCodes));

            string cmd = "SELECT " +
                $"'{CodeType}' 'CodeType', " +
                "YEAR(cim.CIDT) 'Year', " +
                "MONTH(cim.CIDT) 'Month', " +
                "RTRIM(ci.CUSCOD) 'CustomerCode', " +
                "ci.NETWEIGHT 'Weightkg', " +
                "ci.RECVQTY 'amountpc', " +
                "(ci.NETPRC - ci.DISCSP - ci.DISCSAMT - ci.DISCPROG + ci.ADDAMT) * ISNULL(exc.EXCHRT, 0) 'Value', " +
                (d.ProductTypeCode ? "SUBSTRING(ci.PRODCODE, 1, 1)" : "NULL") + " 'ProductTypeCode', " +
                (d.Diameter ? "RTRIM(gp.TWINESIZE)" : "NULL") + " 'Diameter', " +
                (d.DiameterLB ? "RTRIM(IIF(od.TWINESIZELB IS NOT NULL, od.TWINESIZELB, gp.TWINESIZELB))" : "NULL") + " 'DiameterLB', " +
                (d.MeshSizeLB ? "RTRIM(IIF(od.EYESIZELB IS NOT NULL, od.EYESIZELB, gp.EYESIZELB))" : "NULL") + " 'MeshSizeLB', " +
                (d.MeshDepthLB ? "RTRIM(IIF(od.EYEAMOUNTLB IS NOT NULL, od.EYEAMOUNTLB, gp.EYEAMOUNTLB))" : "NULL") + " 'MeshDepthLB', " +
                (d.LengthLB ? "RTRIM(IIF(od.LENGTHLB IS NOT NULL, od.LENGTHLB, gp.LENGTHLB))" : "NULL") + " 'LengthLB', " +
                (d.KnotTypeCode ? "RTRIM(gp.KNOTTYPECODE)" : "NULL") + " 'KnotTypeCode', " +
                (d.StretchingCode ? "RTRIM(gp.STRETCHINGTYPECODE)" : "NULL") + " 'StretchingCode', " +
                (d.QualityCode ? "RTRIM(od.PQGRADECD)" : "NULL") + " 'QualityCode', " +
                (d.LabelCode ? "RTRIM(od.LABEL1)" : "NULL") + " 'LabelCode', " +
                (d.shippingMark ? "RTRIM(od.shippingMark)" : "NULL") + " 'shippingMark', " +
                (d.shippingMark ? "RTRIM(od.dynamictext2)" : "NULL") + " 'dynamictext2', " +
                (d.ColorCode ? "RTRIM(gp.COLORSTD)" : "NULL") + " 'ColorCode' " +
                "FROM saleex.dbo.COMMERCIAL1MST cim " +
                "INNER JOIN saleex.dbo.COMMERCIAL1TRN ci ON cim.CINO=ci.CINO AND RTRIM(ci.PRODCODE) <> '' " +
                "OUTER APPLY ( " +
                    "SELECT TOP 1 exc.EXCHRT " +
                    "FROM saleex.dbo.V_ACCEXCH exc WHERE YEAR(exc.FRMDATE) >= YEAR(@dateFrom) AND exc.CURRENCYCODE = ci.CURRENCYCODE AND cim.CIDT BETWEEN exc.FRMDATE AND exc.TODATE " +
                ") exc " +
                "OUTER APPLY ( " +
                    "SELECT TOP 1 " +
                    "od.PINO, " +
                    "od.PRODCODE, " +
                    "od.ITEMNO, " +
                    (d.Diameter ? "od.TWINESIZELB" : "NULL") + " 'TWINESIZELB', " +
                    (d.MeshSizeLB ? "od.EYESIZELB" : "NULL") + " 'EYESIZELB', " +
                    (d.MeshDepthLB ? "od.EYEAMOUNTLB" : "NULL") + " 'EYEAMOUNTLB', " +
                    (d.LengthLB ? "od.LENGTHLB" : "NULL") + " 'LENGTHLB', " +
                    (d.QualityCode ? "od.PQGRADECD" : "NULL") + " 'PQGRADECD', " +
                    (d.LabelCode ? "od.LABEL1" : "NULL") + " 'LABEL1', " +
                    (d.shippingMark ? "RTRIM(od.SHIP7HCODE) + ':'+ (REPLACE(REPLACE(sh.SHIP7HDESC,(ISNULL((select VALUE from saleex.dbo.[sxsShippingMark7DigitD] shd where shd.SHIP7HCODE = sh.SHIP7HCODE and TYPE = '1' ),'')+'{DYNAMIC}'),RTRIM(od.REMARK01)),(ISNULL((select VALUE from saleex.dbo.[sxsShippingMark7DigitD] shd where shd.SHIP7HCODE = sh.SHIP7HCODE and TYPE = '2' ),''))+'{DYNAMIC2}',RTRIM(od.REMARK02)))" : "NULL") + " 'shippingMark', " +
                    (d.shippingMark ? "RTRIM(od.dynamictext2)" : "NULL") + " 'dynamictext2' " +
                    "FROM saleex.dbo.ORDERTRN od " +
                    " left outer join saleex.dbo.[sxsShippingMark7DigitH] sh on sh.SHIP7HCODE = od.SHIP7HCODE "+
                    "WHERE RTRIM(od.PRODCODE) <> '' AND od.PINO = ci.PINO AND od.ITEMNO = ci.PIITEMNO AND od.PRODCODE = ci.PRODCODE " +
                ") od " +
                "INNER JOIN saleex.dbo.GENPROD gp ON gp.PRODCODE = ci.PRODCODE " +
                "INNER JOIN saleex.dbo.CUSTOMER c ON c.CUSCOD = cim.CUSCOD " +
                (!d.dstkflag ? " AND c.DSTKFLAG <> 'Y' " : "") +
                "WHERE ( cim.CANID = '' OR cim.CANID IS NULL ) " +
                "AND " +
                "( " +
                    "YEAR(@dateFrom) <> YEAR(@dateTo) " +
                    "AND " +
                    "( " +
                        "( " +
                            "YEAR(cim.CIDT) BETWEEN YEAR(@dateFrom) AND YEAR(@dateTo) " +
                            "AND ( MONTH(cim.CIDT) BETWEEN MONTH(@dateFrom) AND MONTH(@dateTo) ) " +
                        ") " +
                        "OR " +
                        "( " +
                            "MONTH(@dateFrom) > MONTH(@dateTo) " +
                            "AND dbo.FN_DateRange(cim.CIDT, cim.CIDT, @dateFrom, @dateTo) = 1 " +
                        ") " +
                    ") " +
                    "OR YEAR(@dateFrom) = YEAR(@dateTo) " +
                ") " +
                "AND ( cim.CIDT BETWEEN @dateFrom AND @dateTo ) " +
                $"AND ( @customerNull IS NULL OR cim.CUSCOD IN ('{d.customerCodes.Join("','")}') )";

            return Query<ShipmentPlanForecastReport2>(cmd, param, logger).ToList();
        }

        public List<ShipmentPlanForecastReport2> GetReportActualOther(ShipmentPlanForecastReport2Req d, string CodeType = "A", Logger logger = null)
        {

            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            if (CodeType == "A")
            {
                param.Add("@dateFrom", d.dateFrom);
                param.Add("@dateTo", d.dateTo);
            }
            else
            {
                var dateFrom = DateTimeUtil.GetDate(d.dateFrom).Value.AddYears(-1);
                var dateTo = DateTimeUtil.GetDate(d.dateTo).Value.AddYears(-1);
                param.Add("@dateFrom", dateFrom);
                param.Add("@dateTo", dateTo);
            }
            param.Add("@customerNull", ListUtil.ListNull(d.customerCodes));

            string cmd = "SELECT " +
                $"'{CodeType}' 'CodeType', " +
                "YEAR(cim.CIDT) 'Year', " +
                "MONTH(cim.CIDT) 'Month', " +
                "RTRIM(cim.CUSCOD) 'CustomerCode', " +
                "cma.NETWEIGHT 'Weightkg', " +
                "IIF(cma.SALEUNIT = 'PC', cma.QTY, 0) 'amountpc', " +
                "cma.TOTDIS * ISNULL(exc.EXCHRT, 0) 'Value', " +
                (d.ProductTypeCode ? "0" : "NULL") + " 'ProductTypeCode' " +
                // (d.Diameter ? "RTRIM(gp.TWINESIZE)" : "NULL") + " 'Diameter', " +
                // (d.DiameterLB ? "RTRIM(IIF(od.TWINESIZELB IS NOT NULL, od.TWINESIZELB, gp.TWINESIZELB))" : "NULL") + " 'DiameterLB', " +
                // (d.MeshSizeLB ? "RTRIM(IIF(od.EYESIZELB IS NOT NULL, od.EYESIZELB, gp.EYESIZELB))" : "NULL") + " 'MeshSizeLB', " +
                // (d.MeshDepthLB ? "RTRIM(IIF(od.EYEAMOUNTLB IS NOT NULL, od.EYEAMOUNTLB, gp.EYEAMOUNTLB))" : "NULL") + " 'MeshDepthLB', " +
                // (d.LengthLB ? "RTRIM(IIF(od.LENGTHLB IS NOT NULL, od.LENGTHLB, gp.LENGTHLB))" : "NULL") + " 'LengthLB', " +
                // (d.KnotTypeCode ? "RTRIM(gp.KNOTTYPECODE)" : "NULL") + " 'KnotTypeCode', " +
                // (d.StretchingCode ? "RTRIM(gp.STRETCHINGTYPECODE)" : "NULL") + " 'StretchingCode', " +
                // (d.QualityCode ? "RTRIM(od.PQGRADECD)" : "NULL") + " 'QualityCode', " +
                // (d.LabelCode ? "RTRIM(od.LABEL1)" : "NULL") + " 'LabelCode', " +
                // (d.ColorCode ? "RTRIM(gp.COLORSTD)" : "NULL") + " 'ColorCode' " +
                "FROM saleex.dbo.COMMERCIAL1MST cim " +
                "INNER JOIN saleex.dbo.COMMERCIAL1ADD1 cma ON cma.CINO = cim.CINO " +


                // "FROM ( " +
                //     "SELECT cim.CINO, cim.CIDT, cim.CUSCOD, cim.NETWEIGHT, cim.ADDAMT, cim.CURRENCYCODE FROM saleex.dbo.COMMERCIAL1MST cim " +
                //     "INNER JOIN saleex.dbo.CUSTOMER c ON c.CUSCOD = cim.CUSCOD AND c.DSTKFLAG <> 'Y' " +
                //     "WHERE ( cim.CANID = '' OR cim.CANID IS NULL ) " +
                //     "AND cim.ADDAMT > 0 " +
                //     "AND " +
                //     "( " +
                //         "YEAR(@dateFrom) <> YEAR(@dateTo) " +
                //         "AND " +
                //         "( " +
                //             "( " +
                //                 "YEAR(cim.CIDT) BETWEEN YEAR(@dateFrom) AND YEAR(@dateTo) " +
                //                 "AND ( MONTH(cim.CIDT) BETWEEN MONTH(@dateFrom) AND MONTH(@dateTo) ) " +
                //             ") " +
                //             "OR " +
                //             "( " +
                //                 "MONTH(@dateFrom) > MONTH(@dateTo) " +
                //                 "AND dbo.FN_DateRange(cim.CIDT, cim.CIDT, @dateFrom, @dateTo) = 1 " +
                //             ") " +
                //         ") " +
                //         "OR YEAR(@dateFrom) = YEAR(@dateTo) " +
                //     ") " +
                //     "AND ( cim.CIDT BETWEEN @dateFrom AND @dateTo ) " +
                //     $"AND ( @customerNull IS NULL OR cim.CUSCOD IN ('{d.customerCodes.Join("','")}') ) " +
                // ") cim " +
                // "OUTER APPLY ( " +
                //     "SELECT " +
                //     "ci.CINO, " +
                //     "SUM(CAST(ci.NETWEIGHT AS DEC(14,2))) 'NETWEIGHT' " +
                //     "FROM saleex.dbo.COMMERCIAL1TRN ci " +
                //     "WHERE ci.CINO = cim.CINO AND RTRIM(ci.PRODCODE) <> '' " +
                //     "GROUP BY ci.CINO " +
                // ") ci " +

                "OUTER APPLY ( " +
                    "SELECT TOP 1 exc.EXCHRT " +
                    "FROM saleex.dbo.V_ACCEXCH exc WHERE YEAR(exc.FRMDATE) >= YEAR(@dateFrom) AND exc.CURRENCYCODE = cim.CURRENCYCODE AND cim.CIDT BETWEEN exc.FRMDATE AND exc.TODATE " +
                ") exc " +
                "WHERE ( cim.CANID = '' OR cim.CANID IS NULL ) " +
                "AND " +
                "( " +
                    "YEAR(@dateFrom) <> YEAR(@dateTo) " +
                    "AND " +
                    "( " +
                        "( " +
                            "YEAR(cim.CIDT) BETWEEN YEAR(@dateFrom) AND YEAR(@dateTo) " +
                            "AND ( MONTH(cim.CIDT) BETWEEN MONTH(@dateFrom) AND MONTH(@dateTo) ) " +
                        ") " +
                        "OR " +
                        "( " +
                            "MONTH(@dateFrom) > MONTH(@dateTo) " +
                            "AND dbo.FN_DateRange(cim.CIDT, cim.CIDT, @dateFrom, @dateTo) = 1 " +
                        ") " +
                    ") " +
                    "OR YEAR(@dateFrom) = YEAR(@dateTo) " +
                ") " +
                "AND ( cim.CIDT BETWEEN @dateFrom AND @dateTo ) " +
                $"AND ( @customerNull IS NULL OR cim.CUSCOD IN ('{d.customerCodes.Join("','")}') ) ";

            return Query<ShipmentPlanForecastReport2>(cmd, param, logger).ToList();
        }

        public List<ShipmentPlanForecastReport2> GetReportPlan(ShipmentPlanForecastReport2Req d, Logger logger = null)
        {
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@dateFrom", d.dateFrom);
            param.Add("@dateTo", d.dateTo);
            param.Add("@customerNull", ListUtil.ListNull(d.customerCodes));

            string cmd = "SELECT " +
                "'P' 'CodeType', " +
                "m.PlanYear 'Year', " +
                "m.PlanMonth 'Month', " +
                "cm.Code 'CustomerCode', " +
                "spd.PlanWeightKG 'Weightkg', " +
                "CEILING(IIF(spos.QPW = 0, 0, spd.PlanWeightKG / spos.QPW)) 'amountpc', " +
                "ROUND(spd.PlanValue * ISNULL(exc.EXCHRT, spos.CPB), 2) 'Value', " +
                (d.ProductTypeCode ? "SUBSTRING(spos.Product_Code, 1, 1)" : "NULL") + " 'ProductTypeCode', " +
                (d.Diameter ? "RTRIM(gp.TWINESIZE)" : "NULL") + " 'Diameter', " +
                (d.DiameterLB ? "RTRIM(IIF(spos.TwineSizeLB IS NOT NULL, spos.TwineSizeLB, gp.TWINESIZELB))" : "NULL") + " 'DiameterLB', " +
                (d.MeshSizeLB ? "RTRIM(IIF(spos.MeshSizeLB IS NOT NULL, spos.MeshSizeLB, gp.EYESIZELB))" : "NULL") + " 'MeshSizeLB', " +
                (d.MeshDepthLB ? "RTRIM(IIF(spos.MeshDepthLB IS NOT NULL, spos.MeshDepthLB, gp.EYEAMOUNTLB))" : "NULL") + " 'MeshDepthLB', " +
                (d.LengthLB ? "RTRIM(IIF(spos.LengthLB IS NOT NULL, spos.LengthLB, gp.LENGTHLB))" : "NULL") + " 'LengthLB', " +
                (d.KnotTypeCode ? "RTRIM(gp.KNOTTYPECODE)" : "NULL") + " 'KnotTypeCode', " +
                (d.StretchingCode ? "RTRIM(gp.STRETCHINGTYPECODE)" : "NULL") + " 'StretchingCode', " +
                (d.QualityCode ? "spos.ProductGrade_Code" : "NULL") + " 'QualityCode', " +
                (d.LabelCode ? "spos.Label_Code" : "NULL") + " 'LabelCode', " +
                (d.shippingMark ? "RTRIM(od.shippingMark)" : "NULL") + " 'shippingMark', " +
                (d.shippingMark ? "RTRIM(od.dynamictext2)" : "NULL") + " 'dynamictext2', " +
                (d.ColorCode ? "RTRIM(gp.COLORSTD)" : "NULL") + " 'ColorCode' " +
                "FROM sxtShipmentPlanMain m  " +
                "INNER JOIN sxtShipmentPlanD spd ON spd.ShipmentPlanMain_ID = m.ID AND spd.Status='A' " +
                "INNER JOIN sxtShipmentPlanH sph ON sph.ID=spd.ShipmentPlanH_ID AND sph.LastRevisionFlag = 'Y' AND sph.Status='A' " +
                "INNER JOIN sxsCustomer cm ON cm.ID = spd.Customer_ID AND cm.Status = 'A' " +
                "INNER JOIN saleex.dbo.CUSTOMER c ON c.CUSCOD = cm.Code " + "" +
                (!d.dstkflag ? " AND c.DSTKFLAG <> 'Y' " : "") +
                "INNER JOIN sxtShipmentPlanOrderStand spos ON spos.ID = spd.ShipmentPlanOrderStand_ID AND spos.Status='A' " +
                "OUTER APPLY ( " +
                    "SELECT TOP 1 exc.EXCHRT " +
                    "FROM saleex.dbo.V_ACCEXCH exc WHERE YEAR(exc.FRMDATE) >= YEAR(@dateFrom) AND exc.CURRENCYCODE = spos.Currency_Code AND sph.PlanDate BETWEEN exc.FRMDATE AND exc.TODATE " +
                ") exc " +
                "OUTER APPLY ( " +
                    "SELECT TOP 1 " +
                    "od.PINO, " +
                    "od.PRODCODE, " +
                    "od.ITEMNO, " +
                    (d.Diameter ? "od.TWINESIZELB" : "NULL") + " 'TWINESIZELB', " +
                    (d.MeshSizeLB ? "od.EYESIZELB" : "NULL") + " 'EYESIZELB', " +
                    (d.MeshDepthLB ? "od.EYEAMOUNTLB" : "NULL") + " 'EYEAMOUNTLB', " +
                    (d.LengthLB ? "od.LENGTHLB" : "NULL") + " 'LENGTHLB', " +
                    (d.QualityCode ? "od.PQGRADECD" : "NULL") + " 'PQGRADECD', " +
                    (d.LabelCode ? "od.LABEL1" : "NULL") + " 'LABEL1', " +
                    (d.shippingMark ? "RTRIM(od.SHIP7HCODE) + ':'+ (REPLACE(REPLACE(sh.SHIP7HDESC,(ISNULL((select VALUE from saleex.dbo.[sxsShippingMark7DigitD] shd where shd.SHIP7HCODE = sh.SHIP7HCODE and TYPE = '1' ),'')+'{DYNAMIC}'),RTRIM(od.REMARK01)),(ISNULL((select VALUE from saleex.dbo.[sxsShippingMark7DigitD] shd where shd.SHIP7HCODE = sh.SHIP7HCODE and TYPE = '2' ),''))+'{DYNAMIC2}',RTRIM(od.REMARK02)))" : "NULL") + " 'shippingMark', " +
                    (d.shippingMark ? "RTRIM(od.dynamictext2)" : "NULL") + " 'dynamictext2' " +
                    "FROM saleex.dbo.ORDERTRN od " +
                    " left outer join saleex.dbo.[sxsShippingMark7DigitH] sh on sh.SHIP7HCODE = od.SHIP7HCODE " +
                    " WHERE RTRIM(od.PRODCODE) <> '' AND od.PINO = spos.PI_CODE AND od.ITEMNO = spos.ITEMNO AND od.PRODCODE = spos.PRODUCT_CODE  and od.ORDERNO = spos.Order_Code " +
                ") od " +
                "INNER JOIN saleex.dbo.GENPROD gp ON gp.PRODCODE = spos.Product_Code " +
                "WHERE m.PlanType = 'M' " +
                "AND " +
                "( " +
                    "YEAR(@dateFrom) <> YEAR(@dateTo) " +
                    "AND " +
                    "( " +
                        "( " +
                            "m.PlanYear BETWEEN YEAR(@dateFrom) AND YEAR(@dateTo) " +
                            "AND ( m.PlanMonth BETWEEN MONTH(@dateFrom) AND MONTH(@dateTo) ) " +
                        ") " +
                        "OR " +
                        "( " +
                            "MONTH(@dateFrom) > MONTH(@dateTo) " +
                            "AND dbo.FN_DateRange(sph.PlanDate, sph.PlanDate, @dateFrom, @dateTo) = 1 " +
                        ") " +
                    ") " +
                    "OR YEAR(@dateFrom) = YEAR(@dateTo) " +
                ") " +
                "AND sph.PlanDate BETWEEN @dateFrom AND @dateTo " +
                $"AND ( @customerNull IS NULL OR cm.Code IN ('{d.customerCodes.Join("','")}') ) " +
                "AND m.Status = 'A'";

            return Query<ShipmentPlanForecastReport2>(cmd, param, logger).ToList();
        }

    }
}
