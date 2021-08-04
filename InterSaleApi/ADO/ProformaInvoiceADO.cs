using InterSaleModel.Model.API.Request;
using InterSaleModel.Model.Entity.Response;
using KKFCoreEngine.KKFLogger;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using KKFCoreEngine.Util;

namespace InterSaleApi.ADO
{
    public class ProformaInvoiceADO : BaseADO
    {
        private static ProformaInvoiceADO instant;
        public static ProformaInvoiceADO GetInstant()
        {
            if (instant == null)
                instant = new ProformaInvoiceADO();
            return instant;
        }
        private ProformaInvoiceADO() { }

        public List<ProformaInvoiceCopareForecast> CompareForecast(ProformaInvoiceCompareForecastReportReq d, Logger logger = null)
        {
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            //param.Add("@year", d.year);
            param.Add("@dateFrom", DateTimeUtil.GetDate(d.dateFrom));
            param.Add("@dateTo", DateTimeUtil.GetDate(d.dateTo));
            param.Add("@customerIDs", d.customerIDs.Join(","));
            param.Add("@zoneAccountIDs", d.zoneAccountIDs.Join(","));
            param.Add("@regionalZoneIDs", d.regionalZoneIDs.Join(","));
            param.Add("@costID", d.costID);

            return QuerySP<ProformaInvoiceCopareForecast>("SP_ProformaInvoice_CompareForecast3", param, logger).ToList();
        }

        public List<ProformaInvoiceGetActual> GetActual(DateTime dateFrom, DateTime dateTo, int? zoneID, int? customerID, string productType, string diameter, Logger logger = null)
        {
            var param = new Dapper.DynamicParameters();
            param.Add("@dateFrom", dateFrom);
            param.Add("@dateTo", dateTo);
            param.Add("@zoneID", zoneID);
            param.Add("@customerID", customerID);
            param.Add("@productType", productType);
            param.Add("@diameter", diameter);

            var res = this.QuerySP<ProformaInvoiceGetActual>("SP_ProformaInvoice_GetActual", param, logger).ToList();
            return res;
        }


        public List<ProformaInvoiceForecastReport> GetReportForcast(ProformaInvoiceForecastReport2Req d, Logger logger = null)
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
                "LTRIM(RTRIM(fcy.CUSCOD)) 'CustomerCode', " +
                "fcy.WEIGHTGRW 'Weightkg', " +
                "IIF(gp.PRODUCTTYPECODE IN('H', 'P'), " +
                    "IIF(STD_WEI IS NULL OR STD_WEI = 0, 0, ROUND((GROUPPRICE + (GROUPPRICE * ISNULL(PERCENADJ, 0) / 100)) * EXCHRT * FLOOR((WEIGHTGRW * 1000) / STD_WEI), 2)), " +
                    "ROUND((KGPRICE + ROUND((KGPRICE * ISNULL(PERCENADJ, 0) / 100), 2)) * EXCHRT * WEIGHTGRW, 2) " +
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
                (d.ColorCode ? "RTRIM(gp.COLORSTD)" : "NULL") + " 'ColorCode' " +
                "FROM saleex.dbo.VFORCASTYEARPI fcy " +
                "INNER JOIN saleex.dbo.FORCASTEXCH fce ON IIF((fcy.MN = 11 OR fcy.MN = 12) AND fcy.YR = YEAR(@dateFrom), fcy.YR + 1, fcy.YR) = fce.YR AND fce.CURRENCYCODE = fcy.CURRENCYCODE AND fce.CONDTYPE = '1' " +
                "INNER JOIN saleex.dbo.VGENPROD gp ON gp.PRODCODE=fcy.PRODCODE " +
                "INNER JOIN saleex.dbo.CUSTOMER c ON c.CUSCOD = fcy.CUSCOD AND c.DSTKFLAG <> 'Y' " +
                "LEFT JOIN saleex.dbo.FORCASTPERCENADJH fcah ON fcah.YR=YEAR(@dateTo) AND fcah.CUSCOD=fcy.CUSCOD AND fcah.CONDTYPE='1' " +
                "LEFT JOIN saleex.dbo.FORCASTPERCENADJD fcad ON fcah.SEQD=fcad.SEQD AND fcad.PQGRADECD = fcy.PQGRADECD AND fcad.TWINESIZE = gp.TWINESIZE " +
                    "AND fcad.KNOTTYPECODE = gp.KNOTDAI AND fcad.PRODUCTTYPECODE = gp.PRODUCTTYPECODE " +
                "LEFT JOIN saleex.dbo.FORCASTSTDCOST fsc ON fsc.YR=YEAR(@dateTo) AND fsc.COSTID=@CostID " +
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

            return Query<ProformaInvoiceForecastReport>(cmd, param, logger).ToList();
        }

        public List<ProformaInvoiceForecastReport> GetReportActual(ProformaInvoiceForecastReport2Req d, string CodeType = "A", Logger logger = null)
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
                "YEAR(pim.PIDT) 'Year', " +
                "MONTH(pim.PIDT) 'Month', " +
                "RTRIM(pi.CUSCOD) 'CustomerCode', " +
                "pi.TWEIGHT 'Weightkg', " +
                "CEILING(IIF(pi.SALEUNIT = 'KG', IIF(pi.WEIGHT = 0, 0, pi.QTY / pi.WEIGHT * 1000), IIF(pi.SALEUNIT = 'PC', pi.QTY, IIF(pi.WEIGHT = 0, 0, pi.WEIGHTKG / pi.WEIGHT * 1000)))) 'Amountpc', " +
                "IIF(pi.QTY IS NULL OR pi.QTY = 0, 0, ROUND(((pi.UPRICE * pi.QTY) - DISCSP) / pi.QTY, 2) * pi.QTY * exc.EXCHRT) 'Value', " +
                (d.ProductTypeCode ? "SUBSTRING(pi.PRODCODE, 1, 1)" : "NULL") + " 'ProductTypeCode', " +
                (d.Diameter ? "RTRIM(gp.TWINESIZE)" : "NULL") + " 'Diameter', " +
                (d.DiameterLB ? "RTRIM(IIF(pi.TWINESIZELB IS NOT NULL, pi.TWINESIZELB, gp.TWINESIZELB))" : "NULL") + " 'DiameterLB', " +
                (d.MeshSizeLB ? "RTRIM(IIF(pi.EYESIZELB IS NOT NULL, pi.EYESIZELB, gp.EYESIZELB))" : "NULL") + " 'MeshSizeLB', " +
                (d.MeshDepthLB ? "RTRIM(IIF(pi.EYEAMOUNTLB IS NOT NULL, pi.EYEAMOUNTLB, gp.EYEAMOUNTLB))" : "NULL") + " 'MeshDepthLB', " +
                (d.LengthLB ? "RTRIM(IIF(pi.LENGTHLB IS NOT NULL, pi.LENGTHLB, gp.LENGTHLB))" : "NULL") + " 'LengthLB', " +
                (d.KnotTypeCode ? "RTRIM(gp.KNOTTYPECODE)" : "NULL") + " 'KnotTypeCode', " +
                (d.StretchingCode ? "RTRIM(gp.STRETCHINGTYPECODE)" : "NULL") + " 'StretchingCode', " +
                (d.QualityCode ? "RTRIM(pi.PQGRADECD)" : "NULL") + " 'QualityCode', " +
                (d.LabelCode ? "RTRIM(pi.LABEL1)" : "NULL") + " 'LabelCode', " +
                (d.ColorCode ? "RTRIM(gp.COLORSTD)" : "NULL") + " 'ColorCode' " +
                "FROM saleex.dbo.PERFORMAMST pim " +
                "INNER JOIN saleex.dbo.PERFORMATRN pi ON pim.PINO = pi.PINO AND RTRIM(pi.PRODCODE) <> '' " +
                "OUTER APPLY( " +
                    "SELECT TOP 1 exc.EXCHRT FROM saleex.dbo.V_ACCEXCH exc WHERE pi.CURRENCYCODE = exc.CURRENCYCODE AND pim.PIDT BETWEEN exc.FRMDATE AND exc.TODATE " +
                ") exc " +
                "INNER JOIN saleex.dbo.GENPROD gp ON gp.PRODCODE = pi.PRODCODE " +
                "INNER JOIN saleex.dbo.CUSTOMER c ON c.CUSCOD = pim.CUSCOD AND c.DSTKFLAG <> 'Y' " +
                "WHERE (pim.CANID = '' OR pim.CANID IS NULL) " +
                "AND " +
                "( " +
                    "YEAR(@dateFrom) <> YEAR(@dateTo) " +
                    "AND " +
                    "( " +
                        "( " +
                            "YEAR(pim.PIDT) BETWEEN YEAR(@dateFrom) AND YEAR(@dateTo) " +
                            "AND ( MONTH(pim.PIDT) BETWEEN MONTH(@dateFrom) AND MONTH(@dateTo) ) " +
                        ") " +
                        "OR " +
                        "( " +
                            "MONTH(@dateFrom) > MONTH(@dateTo) " +
                            "AND dbo.FN_DateRange(pim.PIDT, pim.PIDT, @dateFrom, @dateTo) = 1 " +
                        ") " +
                    ") " +
                    "OR YEAR(@dateFrom) = YEAR(@dateTo) " +
                ") " +
                "AND ( pim.PIDT BETWEEN @dateFrom AND @dateTo ) " +
                $"AND ( @customerNull IS NULL OR pim.CUSCOD IN ('{d.customerCodes.Join("','")}') )";

            return Query<ProformaInvoiceForecastReport>(cmd, param, logger).ToList();
        }
    }
}
