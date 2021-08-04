using InterSaleApi.ADO;
using InterSaleApi.Engine.Validate;
using InterSaleApi.Model.StaticValue;
using InterSaleModel.Model.API.Request.PublicRequest;
using InterSaleModel.Model.API.Response;
using InterSaleModel.Model.API.Response.PublicModel;
using InterSaleModel.Model.Entity;
using InterSaleModel.Model.Jobs.Request;
using InterSaleModel.Model.Jobs.Response;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace InterSaleApi.Engine.Jobs
{
    public class PriceStdImportDataFromSaleExJobs : BaseJobsEngine<PriceStdImportReq, JobEmplyRes>
    {
        protected override void ExecuteChild(PriceStdImportReq dataReq, JobEmplyRes datRes)
        {
            if (StaticValueManager.GetInstant().PriceStdImportActive)
            {
                throw new Exception("ระบบกำลังทำงานอยู่...");
            }

            StaticValueManager.GetInstant().PriceStdImportActive_Set(false);
            var Issucces = true;
            var msg = "";

            var priceDatas = PriceSaleExADO.GetInstant().GetPrice(dataReq.countryGroupCode);

            // change effective date
            priceDatas.GroupBy(x => new { countryGroupID = x.CountryGroupID, productTypeID = x.ProductTypeID, productGradeID = x.ProductGradeID, currencyID = x.CurrencyID }).ToList().ForEach(x =>
            {
                x.ToList().ForEach(d =>
                {
                    d.EffectiveDateFrom = x.First().EffectiveDateFrom;
                    d.EffectiveDateTo = x.Last().EffectiveDateTo;

                });
            });

            var priceColorGroups = PriceSaleExADO.GetInstant().ColorGroup();

            //var unitType = UnitTypeADO.GetInstant().Search(new SearchRequest() { groupTypes = new List<string>() { "M", "D", "L" } });

            SqlTransaction transac = BaseADO.BeginTransaction();
            try
            {
                priceDatas.ForEach(x =>
                {
                    try
                    {

                    // PriceStdMain
                    var dataMain = new sxsPriceStdMain()
                    {
                        CountryGroup_ID = x.CountryGroupID
                        , ProductType_ID = x.ProductTypeID
                        , ProductGrade_ID = x.ProductGradeID
                        , Currency_ID = x.CurrencyID
                    };
                    dataMain.Type = x.productID != null ? "C" : "R";
                    dataMain.Code = x.CountryGroupCode + dataMain.Type + x.ProductTypeCode + (x.ProductGradeCode == null ? "0" : x.ProductGradeCode) + x.CurrencyCode;
                    dataMain.ID = PriceStdMainADO.GetInstant().Import(transac, dataMain, dataMain.Code);

                    //if (dataMain.ID == 0) throw new Exception(Newtonsoft.Json.JsonConvert.SerializeObject(dataMain));

                    // PriceEffectiveDate
                    var dataEffectiveDate = new sxsPriceStdEffectiveDate()
                    {
                        PriceStdMain_ID = dataMain.ID
                        , EffectiveDateFrom = x.EffectiveDateFrom
                        , EffectiveDateTo = x.EffectiveDateTo.Year > 2018 ? new DateTime(2018,12,31) : x.EffectiveDateTo
                    };
                    dataEffectiveDate.ID = PriceStdEffectiveDateADO.GetInstant().Import(transac, dataEffectiveDate, dataMain.Code);

                    // ralation ID pricestdvalue
                    int? relationValueID = 0;

                    if (dataMain.Type == "C")
                    {
                        // PriceProd
                        var dataProd = new sxsPriceStdProd()
                        {
                            PriceStdMain_ID = dataMain.ID
                            , Product_ID = x.productID ?? 0
                            , UnitType_ID = x.UnitTypeID
                        };
                        relationValueID = PriceStdProdADO.GetInstant().Import(transac, dataProd);
                    }
                    else
                    {
                        // PriceStdRangeH
                        var dataRangH = new sxsPriceStdRangeH()
                        {
                            PriceStdMain_ID = dataMain.ID
                            , MinProductTwineSizeCode = x.MinProductTwineSizeCode
                            , MinFilamentSize = x.MinFilamentSize ?? 0
                            , MinFilamentAmount = x.MinFilamentAmount ?? 0
                            , MinFilamentWord = x.MinFilamentWord
                            , MaxProductTwineSizeCode = x.MaxProductTwineSizeCode
                            , MaxFilamentSize = x.MaxFilamentSize ?? 0
                            , MaxFilamentAmount = x.MaxFilamentAmount ?? 0
                            , MaxFilamentWord = x.MaxFilamentWord
                            , ProductKnot_ID = x.ProductKnotID
                            , ProductSelvageWovenType_ID = x.ProductSelvageWovenTypeID
                            , ProductStretching_ID = x.ProductStretchingID
                            , UnitType_ID = x.UnitTypeID
                        };

                        // Get Color Group
                        if(x.ColorGroupCode != null)
                        {
                            var tmpColors = priceColorGroups.Where(y => y.priceNo == x.priceNo && y.colorGroup == x.ColorGroupCode).Select(y => new INTIdCodeDescriptionModel() { code = y.colorCode }).ToList();
                            ProductColorGroupSearchRes.ColorGroup colorGroup = new ProductColorGroupSearchRes.ColorGroup()
                            {
                                countryGroup = new INTIdCodeDescriptionModel() { id = x.CountryGroupID }
                                , productType = new INTIdCodeDescriptionModel() { id = x.ProductTypeID }
                                , productGrade = new INTIdCodeDescriptionModel() { id = x.ProductGradeID }
                                , colors = tmpColors
                            };
                            if (tmpColors.Count != 0) dataRangH.ProductColorGroup_ID = ProductColorGroupADO.GetInstant().Import(transac ,colorGroup).Select(y => y.ID).FirstOrDefault();
                        }

                        dataRangH.ID = PriceStdRangeHADO.GetInstant().Import(transac, dataRangH);

                        // PriceStdRangeD
                        var dataRangD = new sxsPriceStdRangeD()
                        {
                            PriceStdRangeH_ID = dataRangH.ID
                            , ProductTwineSeries_ID = x.ProductTwineSeriesID
                            , MinMeshSize = x.MinEyeSizeCM
                            , MinMeshDepth = x.MinEyeAmountMD
                            , MinLength = x.MinLengthM
                            , MaxMeshSize = x.MaxEyeSizeCM
                            , MaxMeshDepth = x.MaxEyeAmountMD
                            , MaxLength = x.MaxLengthM
                        };

                        if(x.GroupType == "T")
                        {
                            dataRangD.TagDescription = x.ProductTwineSeriesDes;
                        }
                        else
                        {
                            //gen salesDescription
                            var minMeshSize = GetNumberAndUnit(x.MinMeshSize);
                            var maxMeshSize = GetNumberAndUnit(x.MaxMeshSize);
                            var minMeshDepth = GetNumberAndUnit(x.MinMeshDepth);
                            var maxMeshDepth = GetNumberAndUnit(x.MaxMeshDepth);
                            var minLength = GetNumberAndUnit(x.MinLength);
                            var maxLength = GetNumberAndUnit(x.MaxLength);

                            string meshSizeUnit = null;
                            if(x.ProductTypeCode == "K" || x.ProductTypeCode == "U") { meshSizeUnit = ""; }

                            dataRangD.TagDescription = BaseValidate.GetTagDescription(dataRangD.MinMeshSize, dataRangD.MaxMeshSize, dataRangD.MinMeshDepth, dataRangD.MaxMeshDepth, dataRangD.MinLength, dataRangD.MaxLength, meshSizeUnit);
                            dataRangD.SalesDescription = $"{GenDes(minMeshSize, maxMeshSize)} , {GenDes(minMeshDepth, maxMeshDepth)} , {GenDes(minLength, maxLength)}";
                        }
                        relationValueID = PriceStdRangeDADO.GetInstant().Import(transac, dataRangD);
                    }

                    // PriceStdValue
                    var dataValue = new sxsPriceStdValue()
                    {
                        PriceStdEffectiveDate_ID = dataEffectiveDate.ID
                        , PriceStdProd_ID = (dataMain.Type == "C" ? relationValueID : null)
                        , PriceStdRangeD_ID = (dataMain.Type == "R" ? relationValueID : null)
                        , PriceFOB = x.FOB
                        , PriceCAF = x.CAF
                        , PriceCIF = x.CIF
                    };
                    PriceStdValueADO.GetInstant().Import(transac, dataValue, 6002866, "I");

                    }
                    catch (Exception ex)
                    {
                        Issucces = false;
                        throw new Exception(ex + " - " + Newtonsoft.Json.JsonConvert.SerializeObject(x));
                    }
                    finally
                    {

                    }

                });
            }
            catch (Exception ex)
            {
                transac.Rollback();
                Issucces = false;
                msg = ex.Message;
            } 
            finally
            {
                if (Issucces) transac.Commit();
                if (transac != null && transac.Connection != null && transac.Connection.State == System.Data.ConnectionState.Open) transac.Connection.Close();
                StaticValueManager.GetInstant().PriceStdImportActive_Set(false);
            }

            if (!Issucces) throw new Exception(msg);
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
                if (num.Equals(tmp)) { num = ""; }
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

            return new numUnit(){ num = num, unit = unit };
        }

        public class numUnit {
            public string num { get; set; }
            public string unit { get; set; }
        }

        private string GenDes(numUnit min, numUnit max)
        {
            if(!ChkNull(min) && !ChkNull(max)) {
                if(min.unit == max.unit)
                {
                    if (min.num == max.num) { return $"{min.num} {min.unit}"; }
                    else { return $"{min.num} - {max.num} {min.unit}"; }
                }
            }
            else if(!ChkNull(min)) {
                return $"{min.num} {min.unit}";
            }
            else if(!ChkNull(max))
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
