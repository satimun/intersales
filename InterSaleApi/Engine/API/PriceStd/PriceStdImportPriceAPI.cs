using InterSaleApi.ADO;
using InterSaleApi.Engine.Validate;
using InterSaleApi.Model.StaticValue;
using InterSaleModel.Model.API.Request;
using InterSaleModel.Model.API.Request.PublicRequest;
using InterSaleModel.Model.API.Response;
using InterSaleModel.Model.API.Response.PublicModel;
using InterSaleModel.Model.Entity;
using InterSaleModel.Model.Entity.Request;
using KKFCoreEngine.Constant;
using KKFCoreEngine.KKFException;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;

namespace InterSaleApi.Engine.API
{
    public class PriceStdImportPriceAPI : BaseAPIEngine<PriceStdImportPriceRequest, PriceStdImportPriceResponse>
    {
        protected override string PermissionKey { get { return "PRIVATE_API"; } }

        private bool isSuccessMain { get; set; }
        private bool isSuccess { get; set; }

        const string PRODUCT1 = "MTNLIKU"; //อวน
        const string PRODUCT2 = "XVYWJ"; //เอ็น และเส้นด้าย
        const string PRODUCT3 = "PH"; // อวนสำเร็จรูป

        protected override void ExecuteChild(PriceStdImportPriceRequest dataReq, PriceStdImportPriceResponse dataRes)
        {
            var conn = BaseADO.OpenConnection();
            conn.Open();
            SqlTransaction transac = conn.BeginTransaction();

            isSuccessMain = true;
            isSuccess = true;

            dataReq.priceStdMains.ForEach(
                x =>
                {
                    PriceStdMainsRS rsPriceStdMains = new PriceStdMainsRS();
                    try
                    {
                        // set result rs 
                        rsPriceStdMains.countryGroupCode = x.countryGroupCode;
                        rsPriceStdMains.type = x.type;
                        rsPriceStdMains.productTypeCode = x.productTypeCode;
                        rsPriceStdMains.productGradeCode = x.productGradeCode;
                        rsPriceStdMains.currencyCode = x.currencyCode;

                        // getEmpID
                        int empID = EmployeeADO.GetInstant().GetByCode(x.saleCode).Select(s => s.ID).FirstOrDefault();
                        if (empID == 0)
                        {
                            isSuccess = false; isSuccessMain = false;
                        }

                        // get id and validate
                        var dataPriceStdMain = new sxsPriceStdMain();
                        dataPriceStdMain.CountryGroup_ID = CountryGroupADO.GetInstant().GetByCode(x.countryGroupCode, this.Logger).Select(s=>s.ID).FirstOrDefault();

                        var productGroupID = 0;
                        ProductTypeADO.GetInstant().Search(new SearchRequest() { codes = new List<string>() { x.productTypeCode } }, this.Logger).ForEach( s => { dataPriceStdMain.ProductType_ID = s.ID; productGroupID = s.ProductGroup_ID; });

                        dataPriceStdMain.ProductGrade_ID = BaseValidate.GetId(ProductGradeADO.GetInstant().GetByCode(x.productGradeCode, this.Logger).Select(s => s.ID).FirstOrDefault());
                        dataPriceStdMain.Currency_ID = CurrencyADO.GetInstant().GetByCode(x.currencyCode, this.Logger).Select(s => s.ID).FirstOrDefault();
                        dataPriceStdMain.Type = x.type;
                        dataPriceStdMain.CreateBy = empID;

                        if (dataPriceStdMain.CountryGroup_ID == 0) {
                            isSuccess = false; isSuccessMain  = false;
                            rsPriceStdMains._result._message.Add(new KKFException(this.Logger, KKFExceptionCode.V0002, "Country Group Code").Message);
                        }
                        if (dataPriceStdMain.ProductType_ID == 0) {
                            isSuccess = false; isSuccessMain  = false;
                            rsPriceStdMains._result._message.Add(new KKFException(this.Logger, KKFExceptionCode.V0002, "Product Type Code").Message);
                        }
                        if (!dataPriceStdMain.ProductGrade_ID.HasValue && x.productGradeCode != null) {
                            isSuccess = false; isSuccessMain  = false;
                            rsPriceStdMains._result._message.Add(new KKFException(this.Logger, KKFExceptionCode.V0002, "Grade Code").Message);
                        }
                        if (dataPriceStdMain.Currency_ID == 0) {
                            isSuccess = false; isSuccessMain  = false;
                            rsPriceStdMains._result._message.Add(new KKFException(this.Logger, KKFExceptionCode.V0002, "Currency Code").Message);
                        }

                        if (!(x.type == "C" || x.type == "R")) {
                            isSuccess = false; isSuccessMain  = false;
                            rsPriceStdMains._result._message.Add(new KKFException(this.Logger, KKFExceptionCode.V0002, "Table Type Code").Message);
                        }

                        if(PRODUCT3.IndexOf(x.productTypeCode) > -1 && x.type == "R")
                        {
                            isSuccess = false; isSuccessMain = false;
                            rsPriceStdMains._result._message.Add(new KKFException(this.Logger, KKFExceptionCode.V0000, "ประเภทสินค้า P หรือ H ไม่สามารถกำหนดราคาแบบ R ได้").Message);
                        }

                        string codePriceStdMain = x.countryGroupCode + x.type + x.productTypeCode + (x.productGradeCode == null ? "0" : x.productGradeCode) + x.currencyCode;

                        //-------------------------------------- import Price Mains --------------------------------------//
                        if(isSuccess) rsPriceStdMains.id = PriceStdMainADO.GetInstant().Import(transac, dataPriceStdMain, codePriceStdMain, this.Logger);
                        
                        // loop EffectiveDate
                        x.priceStdEffectiveDate.ForEach(
                            y =>
                            {
                                var rsPriceStdEffectiveDate = new PriceStdEffectiveDateRS();
                                try
                                {
                                    // set result rs
                                    rsPriceStdEffectiveDate.effectiveDateFrom = y.effectiveDateFrom;
                                    rsPriceStdEffectiveDate.effectiveDateTo = y.effectiveDateTo;
                                    
                                    DateTime dfrom = DateTime.Today;
                                    DateTime dto = DateTime.Today;
                                    bool chk_dt = true;
                                    try
                                    {
                                        dfrom = BaseValidate.GetDate(y.effectiveDateFrom);
                                        if (dfrom.Year < 999) throw new Exception();
                                    } catch(Exception ex)
                                    {
                                        Logger.LogError(ex.StackTrace);
                                        isSuccess = false; isSuccessMain  = false; chk_dt = false;
                                        rsPriceStdEffectiveDate._result._message.Add(new KKFException(this.Logger, KKFExceptionCode.V0001, "Effective Date From Format").Message);
                                    }
                                    try
                                    {
                                        dto = BaseValidate.GetDate(y.effectiveDateTo);
                                        if (dto.Year < 999) throw new Exception();
                                    }
                                    catch (Exception ex)
                                    {
                                        Logger.LogError(ex.StackTrace);
                                        isSuccess = false; isSuccessMain = false; chk_dt = false;
                                        rsPriceStdEffectiveDate._result._message.Add(new KKFException(this.Logger, KKFExceptionCode.V0001, "Effective Date To Format").Message);
                                    }

                                    if (dfrom.Year != dto.Year && chk_dt) {
                                        isSuccess = false; isSuccessMain  = false;
                                        rsPriceStdEffectiveDate._result._message.Add(new KKFException(this.Logger, KKFExceptionCode.V0000, "วันที่เริ่มต้นและวันสิ้นสุดต้องอยู่ปีเดียวกัน").Message);
                                    }
                                    if (dfrom > dto && chk_dt) {
                                        isSuccess = false; isSuccessMain  = false;
                                        rsPriceStdEffectiveDate._result._message.Add(new KKFException(this.Logger, KKFExceptionCode.V0000, "วันที่เริ่มต้นต้องน้อยกว่าวันสิ้นสุด").Message);
                                    }

                                    if (dto < DateTime.Today && chk_dt)
                                    {
                                        isSuccess = false; isSuccessMain = false;
                                        rsPriceStdEffectiveDate._result._message.Add(new KKFException(this.Logger, KKFExceptionCode.V0000, "วันที่สิ้นสุดต้องไม่น้อยกว่าวันที่ปัจจุบัน").Message);
                                    }
                                    
                                    // validate empID
                                    if (empID == 0)
                                    {
                                        isSuccess = false; isSuccessMain = false;
                                        rsPriceStdEffectiveDate._result._message.Add(new KKFException(this.Logger, KKFExceptionCode.V0002, "Persent").Message);
                                    }
                                    
                                    var dataPriceStdEffectiveDate = new sxsPriceStdEffectiveDate();
                                    dataPriceStdEffectiveDate.PriceStdMain_ID = rsPriceStdMains.id;
                                    dataPriceStdEffectiveDate.EffectiveDateFrom = dfrom;
                                    dataPriceStdEffectiveDate.EffectiveDateTo = dto;
                                    dataPriceStdEffectiveDate.CreateBy = empID;

                                    //-------------------------------------- import Price EffectiveDate --------------------------------------//
                                    if(isSuccess) rsPriceStdEffectiveDate.id = PriceStdEffectiveDateADO.GetInstant().Import(transac, dataPriceStdEffectiveDate, codePriceStdMain, this.Logger);
                                    

                                    //----- type = C
                                    if (x.type == "C")
                                    {
                                        // loop priceStdProdCode Values
                                        y.priceStdProdCode.priceStdValues.ForEach(
                                            z =>
                                            {
                                                var rsPriceStdValues = new PriceStdValuesProdCodeRS();

                                                // isSuccess 
                                                if (rsPriceStdEffectiveDate.id != 0) isSuccess = true;

                                                try
                                                {
                                                    // set result rs
                                                    rsPriceStdValues.productCode = z.productCode;
                                                    rsPriceStdValues.unitTypeCode = z.unitTypeCode;
                                                    rsPriceStdValues.fob = z.fob.Value;
                                                    rsPriceStdValues.cif = z.cif.Value;
                                                    rsPriceStdValues.caf = z.caf.Value;

                                                    //get id and validate
                                                    var datePriceStdProd = new sxsPriceStdProd();
                                                    datePriceStdProd.Product_ID = ProductADO.GetInstant().GetByCode(z.productCode, dataPriceStdMain.ProductType_ID, dataPriceStdMain.ProductGrade_ID, this.Logger).Select(s => s.ID).FirstOrDefault();
                                                    datePriceStdProd.UnitType_ID = UnitTypeADO.GetInstant().GetByCode(z.unitTypeCode, this.Logger).Select(s => s.ID).FirstOrDefault();
                                                    datePriceStdProd.PriceStdMain_ID = rsPriceStdMains.id;
                                                    datePriceStdProd.CreateBy = empID;

                                                    if (datePriceStdProd.Product_ID == 0) {
                                                        isSuccess = false; isSuccessMain  = false;
                                                        rsPriceStdValues._result._message.Add(new KKFException(this.Logger, KKFExceptionCode.V0002, "Product Code").Message);
                                                    }
                                                    if (datePriceStdProd.UnitType_ID == 0) {
                                                        isSuccess = false; isSuccessMain  = false;
                                                        rsPriceStdValues._result._message.Add(new KKFException(this.Logger, KKFExceptionCode.V0002, "Sale Unit").Message);
                                                    }

                                                    if (!z.fob.HasValue || z.fob.Value < 0)
                                                    {
                                                        isSuccess = false; isSuccessMain  = false;
                                                        rsPriceStdValues._result._message.Add(new KKFException(this.Logger, KKFExceptionCode.V0001, "FOB").Message);
                                                    }
                                                    if (!z.caf.HasValue || z.caf.Value < 0)
                                                    {
                                                        isSuccess = false; isSuccessMain  = false;
                                                        rsPriceStdValues._result._message.Add(new KKFException(this.Logger, KKFExceptionCode.V0001, "C&F").Message);
                                                    }
                                                    if (!z.cif.HasValue || z.cif.Value < 0)
                                                    {
                                                        isSuccess = false; isSuccessMain  = false;
                                                        rsPriceStdValues._result._message.Add(new KKFException(this.Logger, KKFExceptionCode.V0001, "CIF").Message);
                                                    }

                                                    if (z.fob.Value == 0 && z.caf.Value == 0 && z.cif.Value == 0)
                                                    {
                                                        isSuccess = false; isSuccessMain  = false;
                                                        rsPriceStdValues._result._message.Add(new KKFException(this.Logger, KKFExceptionCode.V0000, "ค่า FOB, CIF ต้องมีค่าใดค่าหนึ่งไม่เป็น 0").Message);
                                                    }

                                                    //-------------------------------------- import priceStdProdCode --------------------------------------//
                                                    var dataPriceStdValue = new sxsPriceStdValue();

                                                    if(isSuccess) dataPriceStdValue.PriceStdProd_ID = PriceStdProdADO.GetInstant().Import(transac, datePriceStdProd, this.Logger);

                                                    // set id and values
                                                    dataPriceStdValue.PriceStdEffectiveDate_ID = rsPriceStdEffectiveDate.id;
                                                    dataPriceStdValue.PriceFOB = z.fob??0;
                                                    dataPriceStdValue.PriceCIF = z.cif??0;
                                                    dataPriceStdValue.PriceCAF = z.caf??0;
                                                    dataPriceStdValue.CreateBy = empID;

                                                    //-------------------------------------- import priceStdValue_ProdCode --------------------------------------//
                                                    if(isSuccess) rsPriceStdValues.id = PriceStdValueADO.GetInstant().Import(transac, dataPriceStdValue, this.employeeID, "I", this.Logger);

                                                }
                                                catch (Exception ex)
                                                {
                                                    rsPriceStdValues._result._message.Add(ex.Message);
                                                    isSuccess = false; isSuccessMain  = false;
                                                }
                                                finally
                                                {
                                                    if(isSuccess) {
                                                        rsPriceStdValues._result._status = "S";
                                                        rsPriceStdValues._result._message.Add("SUCCESS");
                                                    }
                                                    else
                                                    {
                                                        rsPriceStdValues._result._status = "F";
                                                    }
                                                    rsPriceStdEffectiveDate.priceStdProdCode.priceStdValues.Add(rsPriceStdValues);
                                                }
                                            }
                                        ); // end loop priceStdProdCode Values
                                    }
                                    //----- type = R
                                    else if (x.type == "R")
                                    {
                                        // loop priceStdRangeH
                                        y.priceStdRange.priceStdRangeH.ForEach(
                                            z =>
                                            {
                                                var rsPriceStdRangeH = new PriceStdRangeHRS();

                                                // isSuccess in priceStdRangeH
                                                if (rsPriceStdEffectiveDate.id != 0) isSuccess = true;

                                                try
                                                {
                                                    // set result rs
                                                    rsPriceStdRangeH.colorCode = z.colorCode;
                                                    rsPriceStdRangeH.unitTypeCode = z.unitTypeCode;
                                                    rsPriceStdRangeH.minTwineSizeCode = z.minTwineSizeCode;
                                                    rsPriceStdRangeH.maxTwineSizeCode = z.maxTwineSizeCode;
                                                    rsPriceStdRangeH.knotCode = z.knotCode;
                                                    rsPriceStdRangeH.stretchingCode = z.stretchingCode;
                                                    rsPriceStdRangeH.selvageWovenTypeCode = z.selvageWovenTypeCode;
                                                    
                                                    //// get id and validate
                                                    var dataPriceStdRangeH = new sxsPriceStdRangeH();
                                                    dataPriceStdRangeH.PriceStdMain_ID = rsPriceStdMains.id;
                                                    
                                                    var minTwineSize = ProductTwineSizeADO.GetInstant().GetByCode(z.minTwineSizeCode, productGroupID, this.Logger)
                                                    .Select(s => new { id = s.ID,  code = s.Code2, amount = s.FilamentAmount, size = s.FilamentSize, word = s.FilamentWord }).FirstOrDefault();
                                                    if (minTwineSize == null) {
                                                        isSuccess = false; isSuccessMain  = false;
                                                        rsPriceStdRangeH._result._message.Add(new KKFException(this.Logger, KKFExceptionCode.V0002, "Dai From").Message);
                                                    } else
                                                    {
                                                        dataPriceStdRangeH.MinProductTwineSizeCode = minTwineSize.code;
                                                        dataPriceStdRangeH.MinFilamentAmount = minTwineSize.amount;
                                                        dataPriceStdRangeH.MinFilamentSize = minTwineSize.size;
                                                        dataPriceStdRangeH.MinFilamentWord = minTwineSize.word;
                                                    }
                                                    
                                                    
                                                    var maxTwineSize = ProductTwineSizeADO.GetInstant().GetByCode(z.maxTwineSizeCode, productGroupID, this.Logger)
                                                    .Select(s => new { id = s.ID, code = s.Code2, amount = s.FilamentAmount, size = s.FilamentSize, word = s.FilamentWord }).FirstOrDefault();
                                                    if (maxTwineSize == null) {
                                                        isSuccess = false; isSuccessMain  = false;
                                                        rsPriceStdRangeH._result._message.Add(new KKFException(this.Logger, KKFExceptionCode.V0002, "Dai To").Message);
                                                    }
                                                    else
                                                    {
                                                        dataPriceStdRangeH.MaxProductTwineSizeCode = maxTwineSize.code;
                                                        dataPriceStdRangeH.MaxFilamentAmount = maxTwineSize.amount;
                                                        dataPriceStdRangeH.MaxFilamentSize = maxTwineSize.size;
                                                        dataPriceStdRangeH.MaxFilamentWord = maxTwineSize.word;
                                                    }

                                                    if (dataPriceStdRangeH.MinFilamentWord != dataPriceStdRangeH.MaxFilamentWord)
                                                    {
                                                        isSuccess = false; isSuccessMain = false;
                                                        rsPriceStdRangeH._result._message.Add(new KKFException(this.Logger, KKFExceptionCode.V0001, "Dia").Message);
                                                    }


                                                    if (BaseValidate.StringToDouble(z.minTwineSizeCode) > BaseValidate.StringToDouble(z.maxTwineSizeCode))
                                                    {
                                                        isSuccess = false; isSuccessMain  = false;
                                                        rsPriceStdRangeH._result._message.Add(new KKFException(this.Logger, KKFExceptionCode.V0000, "Dia From ต้องมีค่า <= Dia To").Message);
                                                    }


                                                    dataPriceStdRangeH.UnitType_ID = UnitTypeADO.GetInstant().GetByCode(z.unitTypeCode, this.Logger).Select(s => s.ID).FirstOrDefault();
                                                    if (dataPriceStdRangeH.UnitType_ID == 0) {
                                                        isSuccess = false; isSuccessMain  = false;
                                                        rsPriceStdRangeH._result._message.Add(new KKFException(this.Logger, KKFExceptionCode.V0002, "Sale Unit").Message);
                                                    }

                                                    // product type = อวน
                                                    if (PRODUCT1.IndexOf(x.productTypeCode) > -1)
                                                    {
                                                        // get id and validate
                                                        dataPriceStdRangeH.ProductKnot_ID = BaseValidate.GetId(ProductKnotADO.GetInstant().GetByCode(z.knotCode, this.Logger).Select(s => s.ID).FirstOrDefault());
                                                        dataPriceStdRangeH.ProductStretching_ID = BaseValidate.GetId(ProductStretchingADO.GetInstant().GetByCode(z.stretchingCode, this.Logger).Select(s => s.ID).FirstOrDefault());
                                                        dataPriceStdRangeH.ProductSelvageWovenType_ID = BaseValidate.GetId(ProductSelvageWovenTypeADO.GetInstant().GetByCode(z.selvageWovenTypeCode, this.Logger).Select(s => s.ID).FirstOrDefault());

                                                        if (!dataPriceStdRangeH.ProductKnot_ID.HasValue) {
                                                            isSuccess = false; isSuccessMain  = false;
                                                            rsPriceStdRangeH._result._message.Add(new KKFException(this.Logger, KKFExceptionCode.V0002, "Knot").Message);
                                                        }
                                                        if (!dataPriceStdRangeH.ProductStretching_ID.HasValue) {
                                                            isSuccess = false; isSuccessMain  = false;
                                                            rsPriceStdRangeH._result._message.Add(new KKFException(this.Logger, KKFExceptionCode.V0002, "Strt").Message);
                                                        }

                                                        if (!dataPriceStdRangeH.ProductSelvageWovenType_ID.HasValue && z.selvageWovenTypeCode != null) {
                                                            isSuccess = false; isSuccessMain  = false;
                                                            rsPriceStdRangeH._result._message.Add(new KKFException(this.Logger, KKFExceptionCode.V0002, "หูทอ").Message);
                                                        }

                                                    }

                                                    dataPriceStdRangeH.ProductColorGroup_ID = BaseValidate.GetId(ProductColorGroupADO.GetInstant().GetByColorCode(z.colorCode, this.Logger).Select(s => s.ID).FirstOrDefault());
                                                    if (!dataPriceStdRangeH.ProductColorGroup_ID.HasValue && z.colorCode != null) {
                                                        isSuccess = false; isSuccessMain  = false;
                                                        rsPriceStdRangeH._result._message.Add(new KKFException(this.Logger, KKFExceptionCode.V0002, "Color").Message);
                                                    }
                                                    dataPriceStdRangeH.CreateBy = empID;

                                                    //-------------------------------------- import priceStdRangeH --------------------------------------//
                                                    if(isSuccess) rsPriceStdRangeH.id = PriceStdRangeHADO.GetInstant().Import(transac, dataPriceStdRangeH, this.Logger);

                                                    // loop priceStdValues
                                                    z.priceStdValues.ForEach(
                                                        v =>
                                                        {
                                                            var rsPriceStdValues = new PriceStdValuesRangeRS();
                                                            // set result rs
                                                            rsPriceStdValues.caf = v.caf.Value;
                                                            rsPriceStdValues.fob = v.fob.Value;
                                                            rsPriceStdValues.cif = v.cif.Value;
                                                            
                                                            var dataPriceStdRangeD = new sxsPriceStdRangeD();
                                                            dataPriceStdRangeD.PriceStdRangeH_ID = rsPriceStdRangeH.id;

                                                            // product type = อวน
                                                            if (PRODUCT1.IndexOf(x.productTypeCode) > -1)
                                                            {
                                                                //set result
                                                                rsPriceStdValues.minEyeSizeCM = v.minEyeSizeCM;
                                                                rsPriceStdValues.maxEyeSizeCM = v.maxEyeSizeCM;
                                                                rsPriceStdValues.minEyeAmountMD = v.minEyeAmountMD;
                                                                rsPriceStdValues.maxEyeAmountMD = v.maxEyeAmountMD;
                                                                rsPriceStdValues.minLengthM = v.minLengthM;
                                                                rsPriceStdValues.maxLengthM = v.maxLengthM;

                                                                if (!v.minEyeSizeCM.HasValue || v.minEyeSizeCM.Value < 0 || !v.maxEyeSizeCM.HasValue || v.maxEyeSizeCM.Value < 0) {
                                                                    isSuccess = false; isSuccessMain  = false;
                                                                    rsPriceStdRangeH._result._message.Add(new KKFException(this.Logger, KKFExceptionCode.V0001, "Mesh").Message);
                                                                }

                                                                if (!v.minEyeAmountMD.HasValue || v.minEyeAmountMD.Value < 0 || !v.maxEyeAmountMD.HasValue || v.maxEyeAmountMD.Value < 0) {
                                                                    isSuccess = false; isSuccessMain  = false;
                                                                    rsPriceStdRangeH._result._message.Add(new KKFException(this.Logger, KKFExceptionCode.V0001, "MD").Message);
                                                                }

                                                                if (!v.minLengthM.HasValue || v.minLengthM.Value < 0 || !v.maxLengthM.HasValue || v.maxLengthM.Value < 0) {
                                                                    isSuccess = false; isSuccessMain  = false;
                                                                    rsPriceStdRangeH._result._message.Add(new KKFException(this.Logger, KKFExceptionCode.V0001, "MTRS").Message);
                                                                }
                                                                
                                                                if (v.minEyeSizeCM.Value > v.maxEyeSizeCM.Value) {
                                                                    isSuccess = false; isSuccessMain  = false;
                                                                    rsPriceStdRangeH._result._message.Add(new KKFException(this.Logger, KKFExceptionCode.V0000, "Mesh From ต้องมีค่า <= Mesh To").Message);
                                                                }
                                                                if (v.minEyeAmountMD.Value > v.maxEyeAmountMD.Value) {
                                                                    isSuccess = false; isSuccessMain  = false;
                                                                    rsPriceStdRangeH._result._message.Add(new KKFException(this.Logger, KKFExceptionCode.V0000, "MD From ต้องมีค่า <= MD To").Message);
                                                                }
                                                                if (v.minLengthM.Value > v.maxLengthM.Value) {
                                                                    isSuccess = false; isSuccessMain  = false;
                                                                    rsPriceStdRangeH._result._message.Add(new KKFException(this.Logger, KKFExceptionCode.V0000, "MTRS From ต้องมีค่า <= MTRS To").Message);
                                                                }

                                                                dataPriceStdRangeD.MinMeshSize = v.minEyeSizeCM;
                                                                dataPriceStdRangeD.MaxMeshSize = v.maxEyeSizeCM;
                                                                dataPriceStdRangeD.MinMeshDepth = v.minEyeAmountMD;
                                                                dataPriceStdRangeD.MaxMeshDepth = v.maxEyeAmountMD;
                                                                dataPriceStdRangeD.MinLength = v.minLengthM;
                                                                dataPriceStdRangeD.MaxLength = v.maxLengthM;

                                                                dataPriceStdRangeD.TagDescription = BaseValidate.GetTagDescription(v.minEyeSizeCM.Value, v.maxEyeSizeCM.Value, v.minEyeAmountMD.Value, v.maxEyeAmountMD.Value, v.minLengthM.Value, v.maxLengthM.Value);
                                                                ////////////////////////////////---------------- new add sales decription ----------------////////////////////////////////
                                                                dataPriceStdRangeD.SalesDescription = "";
                                                                rsPriceStdRangeH._result._message.Add(new KKFException(this.Logger, KKFExceptionCode.V0001, "Sales Description is null.").Message);
                                                            }

                                                            // product type = เอ็น และเส้นด้าย
                                                            else if (PRODUCT2.IndexOf(x.productTypeCode) > -1)
                                                            {
                                                                //get id and validate

                                                                var TwineSeries = ProductTwineSeriesADO.GetInstant().GetByCode(v.productTwineSeriesCode, dataPriceStdMain.ProductType_ID, this.Logger)
                                                                .Select( s => new {ID = s.ID, Description = s.Description }).FirstOrDefault();
                                                                if(TwineSeries != null)
                                                                {
                                                                    dataPriceStdRangeD.ProductTwineSeries_ID = TwineSeries.ID;
                                                                    dataPriceStdRangeD.TagDescription = TwineSeries.Description;
                                                                }
                                                                else {
                                                                    isSuccess = false; isSuccessMain = false;
                                                                    rsPriceStdRangeH._result._message.Add(new KKFException(this.Logger, KKFExceptionCode.V0002, "Series Code").Message);
                                                                }

                                                                rsPriceStdValues.productTwineSeriesCode = v.productTwineSeriesCode;
                                                            }

                                                            // chk fob, caf, cif
                                                            if (!v.fob.HasValue || v.fob.Value < 0) {
                                                                isSuccess = false; isSuccessMain  = false;
                                                                rsPriceStdRangeH._result._message.Add(new KKFException(this.Logger, KKFExceptionCode.V0001, "FOB").Message);
                                                            }
                                                            if (!v.caf.HasValue || v.caf.Value < 0) {
                                                                isSuccess = false; isSuccessMain  = false;
                                                                rsPriceStdRangeH._result._message.Add(new KKFException(this.Logger, KKFExceptionCode.V0001, "C&F").Message);
                                                            }
                                                            if (!v.cif.HasValue || v.cif.Value < 0) {
                                                                isSuccess = false; isSuccessMain  = false;
                                                                rsPriceStdRangeH._result._message.Add(new KKFException(this.Logger, KKFExceptionCode.V0001, "CIF").Message);
                                                            }

                                                            if (v.fob.Value == 0 && v.caf.Value == 0 && v.cif.Value == 0) {
                                                                isSuccess = false; isSuccessMain  = false;
                                                                rsPriceStdRangeH._result._message.Add(new KKFException(this.Logger, KKFExceptionCode.V0000, "ค่า FOB, CIF ต้องมีค่าใดค่าหนึ่งไม่เป็น 0").Message);
                                                            }

                                                            dataPriceStdRangeD.CreateBy = empID;

                                                            var dataPriceStdValue = new sxsPriceStdValue();

                                                            //-------------------------------------- import priceStdRangeD --------------------------------------//
                                                            if(isSuccess) dataPriceStdValue.PriceStdRangeD_ID = PriceStdRangeDADO.GetInstant().Import(transac, dataPriceStdRangeD, this.Logger);
                                                            
                                                            //set values id
                                                            dataPriceStdValue.PriceStdEffectiveDate_ID = rsPriceStdEffectiveDate.id;
                                                            dataPriceStdValue.PriceCAF = v.caf??0;
                                                            dataPriceStdValue.PriceFOB = v.fob??0;
                                                            dataPriceStdValue.PriceCIF = v.cif??0;
                                                            dataPriceStdValue.CreateBy = empID;

                                                            //-------------------------------------- import priceStdValue_Range --------------------------------------//
                                                            if(isSuccess) rsPriceStdValues.id = PriceStdValueADO.GetInstant().Import(transac, dataPriceStdValue, this.employeeID, "I" , this.Logger);
                                                            if(rsPriceStdValues.id != 0 && PRODUCT1.IndexOf(x.productTypeCode) > -1)
                                                            {
                                                                //----------- validate chk RangeD between -------------//
                                                                GetRangeBetweenRequest rqRangeBetween = new GetRangeBetweenRequest();
                                                                rqRangeBetween.MainID = rsPriceStdMains.id;
                                                                rqRangeBetween.RangDID = dataPriceStdValue.PriceStdRangeD_ID.Value;
                                                                rqRangeBetween.effectiveDateFrom = dataPriceStdEffectiveDate.EffectiveDateFrom;
                                                                rqRangeBetween.effectiveDateTo = dataPriceStdEffectiveDate.EffectiveDateTo;

                                                                rqRangeBetween.ProductKnot_ID = dataPriceStdRangeH.ProductKnot_ID;
                                                                rqRangeBetween.ProductStretching_ID = dataPriceStdRangeH.ProductStretching_ID;
                                                                rqRangeBetween.UnitType_ID = dataPriceStdRangeH.UnitType_ID;
                                                                rqRangeBetween.ProductSelvageWovenType_ID = dataPriceStdRangeH.ProductSelvageWovenType_ID;
                                                                rqRangeBetween.ProductColorGroup_ID = dataPriceStdRangeH.ProductColorGroup_ID;

                                                                rqRangeBetween.MinFilamentSize = dataPriceStdRangeH.MinFilamentSize;
                                                                rqRangeBetween.MinFilamentAmount = dataPriceStdRangeH.MinFilamentAmount;
                                                                rqRangeBetween.MinFilamentWord = dataPriceStdRangeH.MinFilamentWord;

                                                                rqRangeBetween.MaxFilamentSize = dataPriceStdRangeH.MaxFilamentSize;
                                                                rqRangeBetween.MaxFilamentAmount = dataPriceStdRangeH.MaxFilamentAmount;
                                                                rqRangeBetween.MaxFilamentWord = dataPriceStdRangeH.MaxFilamentWord;

                                                                rqRangeBetween.MinMeshSize = dataPriceStdRangeD.MinMeshSize;
                                                                rqRangeBetween.MaxMeshSize = dataPriceStdRangeD.MaxMeshSize;
                                                                rqRangeBetween.MinMeshDepth = dataPriceStdRangeD.MinMeshDepth;
                                                                rqRangeBetween.MaxMeshDepth = dataPriceStdRangeD.MaxMeshDepth;
                                                                rqRangeBetween.MinLength = dataPriceStdRangeD.MinLength;
                                                                rqRangeBetween.MaxLength = dataPriceStdRangeD.MaxLength;

                                                                PriceStdRangeDADO.GetInstant().GetRangeBetween(transac, rqRangeBetween, this.Logger).ForEach(
                                                                    s =>
                                                                    {
                                                                        isSuccess = false; isSuccessMain = false;
                                                                        string str = "Data Overlap {} " + s.MinProductTwineSizeCode + " - " + s.MaxProductTwineSizeCode + ", "
                                                                            + BaseValidate.DecimalToString(s.MinEyeSizeCM) + " - " + BaseValidate.DecimalToString(s.MaxEyeSizeCM) + ", "
                                                                            + BaseValidate.DecimalToString(s.MinEyeAmountMD) + " - " + BaseValidate.DecimalToString(s.MaxEyeAmountMD) + ", "
                                                                            + BaseValidate.DecimalToString(s.MinLengthM) + " - " + BaseValidate.DecimalToString(s.MaxLengthM);
                                                                        var ex = new KKFException(this.Logger, KKFExceptionCode.V0000, str);
                                                                        rsPriceStdRangeH._result._message.Add(ex.Message);
                                                                    }
                                                                );

                                                            }

                                                            rsPriceStdRangeH.priceStdValues.Add(rsPriceStdValues);

                                                        }
                                                    ); // end loop priceStdValues

                                                }
                                                catch (Exception ex)
                                                {
                                                    rsPriceStdRangeH._result._message.Add(ex.Message);
                                                    isSuccess = false; isSuccessMain  = false;
                                                }
                                                finally
                                                {
                                                    if (isSuccess)
                                                    {
                                                        rsPriceStdRangeH._result._message.Add("SUCCESS");
                                                        rsPriceStdRangeH._result._status = "S";
                                                    }
                                                    else rsPriceStdRangeH._result._status = "F";

                                                    rsPriceStdEffectiveDate.priceStdRange.priceStdRangeH.Add(rsPriceStdRangeH);
                                                }   
                                            }
                                        ); // end loop priceStdRangeH
                                    }
                                }
                                catch (Exception ex)
                                {
                                    rsPriceStdEffectiveDate._result._message.Add(ex.Message);
                                    isSuccess = false; isSuccessMain  = false;
                                }
                                finally
                                {
                                    if(isSuccess)
                                    {
                                        rsPriceStdEffectiveDate._result._message.Add("SUCCESS");
                                        rsPriceStdEffectiveDate._result._status = "S";
                                    }
                                    else rsPriceStdEffectiveDate._result._status = "F";

                                    rsPriceStdMains.priceStdEffectiveDate.Add(rsPriceStdEffectiveDate);
                                }
                            }
                        ); // end loop EffectiveDate


                    }
                    catch (Exception ex)
                    {
                        rsPriceStdMains._result._message.Add(ex.Message);
                        isSuccess = false; isSuccessMain  = false;
                    }
                    finally
                    {
                        if (isSuccess)
                        {
                            rsPriceStdMains._result._message.Add("SUCCESS");
                            rsPriceStdMains._result._status = "S";
                        }
                        else rsPriceStdMains._result._status = "F";

                        dataRes.priceStdMains.Add(rsPriceStdMains);
                        isSuccess = true;
                    }
                }                 
            );

            if (!isSuccessMain)
            {
                transac.Rollback();
                throw new KKFException(this.Logger, KKFExceptionCode.S0001,"");
            }
            else { transac.Commit(); }
            conn.Close();
        }

    }
}
