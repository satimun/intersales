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
    public class CommercialInvoiceADO : BaseADO
    {
        private static CommercialInvoiceADO instant;
        public static CommercialInvoiceADO GetInstant()
        {
            if (instant == null)
                instant = new CommercialInvoiceADO();
            return instant;
        }

        public List<CommercialInvoiceRes> Search(CommercialInvoiceItemsReportReq d, Logger logger = null)
        {
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@dateFrom", d.DateFrom);
            param.Add("@dateTo", d.DateTo);

            param.Add("@ProductTypeCode", ListUtil.ListNull(d.ProductTypeCode));
            param.Add("@QualityCode", ListUtil.ListNull(d.QualityCode));
            param.Add("@ProductTwineNo", ListUtil.ListNull(d.ProductTwineNo));
            param.Add("@DiameterLabel", d.DiameterLabel);
            param.Add("@DiameterLabel", $"%{d.DiameterLabel.GetValue()}%");
            param.Add("@DiameterLabelIsNull", d.DiameterLabel.GetStringValue());

            param.Add("@MeshSizeProd", d.MeshSizeProd);
            param.Add("@MeshDepthProd", d.MeshDepthProd);
            param.Add("@LengthProd", d.LengthProd);


            param.Add("@KnotType", ListUtil.ListNull(d.KnotType));
            param.Add("@Stretching", ListUtil.ListNull(d.Stretching));
            param.Add("@Color", ListUtil.ListNull(d.Color));
            param.Add("@Label", ListUtil.ListNull(d.Label));

            param.Add("@customerNull", ListUtil.ListNull(d.customerCodes));

            string cmd = "SELECT " +
                "YEAR(cim.CIDT) 'Year',  " +
                "MONTH(cim.CIDT) 'Month', " +
                "RTRIM(ci.CUSCOD) 'CustomerCode', " +
                "ci.NETWEIGHT 'WeightKG', " +
                "ci.RECVQTY 'AmountPC', " +
                "ci.NETPRC - ci.DISCSP - ci.DISCSAMT + ci.ADDAMT - ci.DISCPROG 'Value', " +
                "(ci.NETPRC - ci.DISCSP - ci.DISCSAMT + ci.ADDAMT - ci.DISCPROG) * ISNULL(exc.EXCHRT, 0) 'ValueTHB', " +
                "ci.PRODCODE 'ProductCode', " +
                (d.ShowDes ? "ci.PRODDESC" : "NULL") + " 'ProductDes', " +
                (d.ShowOrder ? "od.ORDERNO" : "NULL") + " 'OrderNo', " +
                (d.ShowCI ? "ci.CINO" : "NULL") + " 'CINO', " +
                (d.ShowSpec ? "SUBSTRING(ci.PRODCODE, 1, 1)" : "NULL") + " 'ProductTypeCode', " +
                (d.ShowSpec ? "od.PQGRADECD" : "NULL") + " 'QualityCode', " +
                (d.ShowSpec ? "RTRIM(gp.TWINESIZE)" : "NULL") + " 'ProductTwineNo', " +
                (d.ShowSpec ? "RTRIM(IIF(od.TWINESIZELB IS NOT NULL, od.TWINESIZELB, gp.TWINESIZELB))" : "NULL") + " 'DiameterLabel', " +
                (d.ShowSpec ? "gp.EYESIZE" : "NULL") + " 'MeshSizeProd', " +
                (d.ShowSpec ? "gp.EYEAMOUNT" : "NULL") + " 'MeshDepthProd', " +
                (d.ShowSpec ? "IIF(gp.LENGTH = 0, gp.LENCAL, gp.LENGTH)" : "NULL") + " 'LengthProd', " +
                (d.ShowSpec ? "RTRIM(gp.KNOTTYPECODE)" : "NULL") + " 'KnotTypeCode', " +
                (d.ShowSpec ? "RTRIM(gp.STRETCHINGTYPECODE)" : "NULL") + " 'StretchingCode', " +
                (d.ShowDes ? "RTRIM(od.LABEL1)" : "NULL") + " 'LabelCode', " +
                (d.ShowSpec ? "RTRIM(gp.COLORSTD)" : "NULL") + " 'ColorCode', " +
                (d.ShowSelvage ? "gp.HU_TYPE" : "NULL") + " 'SelvageCode', " +
                (d.ShowSelvage ? "gp.SELVAGEMKDESC" : "NULL") + " 'SelvageDes', " +
                (d.ShowDes ? "ci.SALEUNIT" : "NULL") +" 'SalesUnitCode' " +
                "FROM saleex.dbo.COMMERCIAL1MST cim " +
                "INNER JOIN saleex.dbo.COMMERCIAL1TRN ci ON cim.CINO = ci.CINO AND RTRIM(ci.PRODCODE) <> '' " +
                "OUTER APPLY ( " +
                    "SELECT TOP 1 exc.EXCHRT " +
                    "FROM saleex.dbo.V_ACCEXCH exc WHERE exc.CURRENCYCODE = ci.CURRENCYCODE AND cim.CIDT BETWEEN exc.FRMDATE AND exc.TODATE " +
                ") exc " +
                "OUTER APPLY ( " +
                    "SELECT TOP 1 " +
                    "od.PINO, " +
                    "od.ORDERNO, " +
                    "od.PRODCODE, " +
                    "od.ITEMNO, " +
                    "RTRIM(od.TWINESIZELB) 'TWINESIZELB', " +
                    "RTRIM(od.PQGRADECD) 'PQGRADECD', " +
                    "RTRIM(od.LABEL1) 'LABEL1' " +
                    "FROM saleex.dbo.ORDERTRN od WHERE RTRIM(od.PRODCODE) <> '' AND od.PINO = ci.PINO AND od.ITEMNO = ci.PIITEMNO AND od.PRODCODE = ci.PRODCODE " +
                ") od " +
                "INNER JOIN saleex.dbo.GENPROD gp ON gp.PRODCODE = ci.PRODCODE " +
                "INNER JOIN saleex.dbo.CUSTOMER c ON c.CUSCOD = cim.CUSCOD AND c.DSTKFLAG <> 'Y' " +
                "WHERE(cim.CANID = '' OR cim.CANID IS NULL) " +
                //"AND " +
                //"( " +
                //    "YEAR(@dateFrom) <> YEAR(@dateTo) " +
                //    "AND " +
                //    "( " +
                //        "( " +
                //            "YEAR(cim.CIDT) BETWEEN YEAR(@dateFrom) AND YEAR(@dateTo) " +
                //            "AND(MONTH(cim.CIDT) BETWEEN MONTH(@dateFrom) AND MONTH(@dateTo)) " +
                //        ") " +
                //        "OR " +
                //        "( " +
                //            "MONTH(@dateFrom) > MONTH(@dateTo) " +
                //            "AND dbo.FN_DateRange(cim.CIDT, cim.CIDT, @dateFrom, @dateTo) = 1 " +
                //        ") " +
                //    ") " +
                //    "OR YEAR(@dateFrom) = YEAR(@dateTo) " +
                //") " +
                "AND(cim.CIDT BETWEEN @dateFrom AND @dateTo) " +
                $"AND(@ProductTypeCode IS NULL OR SUBSTRING(ci.PRODCODE, 1, 1) IN ('{d.ProductTypeCode.Join("', '")}')) " +
                $"AND(@QualityCode IS NULL OR od.PQGRADECD IN ('{d.QualityCode.Join("', '")}')) " +
                $"AND(@ProductTwineNo IS NULL OR RTRIM(gp.TWINESIZE) IN ('{d.ProductTwineNo.Join("', '")}')) " +

                "AND ((@DiameterLabelIsNull IS NULL AND od.TWINESIZELB IS NULL) OR od.TWINESIZELB LIKE @DiameterLabel) " +
                "AND (@MeshSizeProd IS NULL OR gp.EYESIZE = @MeshSizeProd) " +
                "AND (@MeshDepthProd IS NULL OR gp.EYEAMOUNT = @MeshDepthProd) " +
                "AND (@LengthProd IS NULL OR gp.LENGTH = @LengthProd OR gp.LENCAL = @LengthProd) " +

                $"AND(@KnotType IS NULL OR RTRIM(gp.KNOTTYPECODE) IN ('{d.KnotType.Join("', '")}')) " +
                $"AND(@Stretching IS NULL OR RTRIM(gp.STRETCHINGTYPECODE) IN ('{d.Stretching.Join("', '")}')) " +
                $"AND(@Color IS NULL OR RTRIM(gp.COLORSTD) IN ('{d.Color.Join("', '")}')) " +
                $"AND(@Label IS NULL OR od.LABEL1 IN ('{d.Label.Join("', '")}')) " +

                $"AND(@customerNull IS NULL OR cim.CUSCOD IN('{d.customerCodes.Join("', '")}'))";

            return Query<CommercialInvoiceRes>(cmd, param, logger).ToList();
        }
    }
}
