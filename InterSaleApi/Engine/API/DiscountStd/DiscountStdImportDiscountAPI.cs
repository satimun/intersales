using InterSaleApi.ADO;
using InterSaleApi.Engine.Validate;
using InterSaleModel.Model.API.Request;
using InterSaleModel.Model.API.Request.PublicRequest;
using InterSaleModel.Model.API.Response;
using InterSaleModel.Model.Entity;
using InterSaleModel.Model.Entity.Request;
using KKFCoreEngine.Constant;
using KKFCoreEngine.KKFException;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace InterSaleApi.Engine.API
{
    public class DiscountStdImportDiscountAPI : BaseAPIEngine<DiscountStdImportDiscountRequest, DiscountStdImportDiscountResponse>
    {
        protected override string PermissionKey { get { return "PRIVATE_API"; } }

        private bool isSuccessMain { get; set; }
        private bool isSuccess { get; set; }

        const string PRODUCT1 = "MTNLIKU"; //อวน
        const string PRODUCT2 = "XVYWJ"; //เอ็น และเส้นด้าย
        const string PRODUCT3 = "PH"; // อวนสำเร็จรูป

        protected override void ExecuteChild(DiscountStdImportDiscountRequest dataReq, DiscountStdImportDiscountResponse dataRes)
        {
            var conn = BaseADO.OpenConnection();
            conn.Open();
            SqlTransaction transac = conn.BeginTransaction();

            isSuccessMain = true;
            isSuccess = true;

            dataReq.discountStdMains.ForEach(
                x =>
                {
                    DiscountStdMainsRS rsDiscountStdMains = new DiscountStdMainsRS();
                    try
                    {
                        // set result rs 
                        rsDiscountStdMains.customerCode = x.customerCode;
                        rsDiscountStdMains.type = x.type;
                        rsDiscountStdMains.productTypeCode = x.productTypeCode;
                        rsDiscountStdMains.productGradeCode = x.productGradeCode;
                        rsDiscountStdMains.currencyCode = x.currencyCode;

                        // getEmpID
                        int empID = EmployeeADO.GetInstant().GetByCode(x.saleCode).Select(s => s.ID).FirstOrDefault();
                        if(empID == 0) {
                            isSuccess = false; isSuccessMain = false; 
                        }

                        // get id and validate
                        var dataDiscountStdMain = new sxsDiscountStdMain();
                        dataDiscountStdMain.Customer_ID = CustomerADO.GetInstant().GetByCode(x.customerCode, this.Logger).Select(s=>s.ID).FirstOrDefault();

                        var productGroupID = 0;
                        ProductTypeADO.GetInstant().Search(new SearchRequest() { codes = new List<string>() { x.productTypeCode } }, this.Logger).ForEach( s => { dataDiscountStdMain.ProductType_ID = s.ID; productGroupID = s.ProductGroup_ID; });

                        dataDiscountStdMain.ProductGrade_ID = BaseValidate.GetId(ProductGradeADO.GetInstant().GetByCode(x.productGradeCode, this.Logger).Select(s => s.ID).FirstOrDefault());
                        dataDiscountStdMain.Currency_ID = CurrencyADO.GetInstant().GetByCode(x.currencyCode, this.Logger).Select(s => s.ID).FirstOrDefault();
                        dataDiscountStdMain.Type = x.type;
                        dataDiscountStdMain.CreateBy = empID;

                        if (dataDiscountStdMain.Customer_ID == 0) {
                            isSuccess = false; isSuccessMain = false; 
                            rsDiscountStdMains._result._message.Add(new KKFException(this.Logger, KKFExceptionCode.V0002, "Customer Code").Message);
                        }
                        if (dataDiscountStdMain.ProductType_ID == 0) {
                            isSuccess = false; isSuccessMain = false; 
                            rsDiscountStdMains._result._message.Add(new KKFException(this.Logger, KKFExceptionCode.V0002, "Product Type Code").Message);
                        }
                        if (!dataDiscountStdMain.ProductGrade_ID.HasValue && x.productGradeCode != null) {
                            isSuccess = false; isSuccessMain = false; 
                            rsDiscountStdMains._result._message.Add(new KKFException(this.Logger, KKFExceptionCode.V0002, "Grade Code").Message);
                        }
                        if (dataDiscountStdMain.Currency_ID == 0) {
                            isSuccess = false; isSuccessMain = false; 
                            rsDiscountStdMains._result._message.Add(new KKFException(this.Logger, KKFExceptionCode.V0002, "Currency Code").Message);
                        }

                        if (!(x.type == "C" || x.type == "R")) {
                            isSuccess = false; isSuccessMain = false; 
                            rsDiscountStdMains._result._message.Add(new KKFException(this.Logger, KKFExceptionCode.V0002, "Table Type Code").Message);
                        }

                        if (PRODUCT3.IndexOf(x.productTypeCode) > -1 && x.type == "R")
                        {
                            isSuccess = false; isSuccessMain = false;
                            rsDiscountStdMains._result._message.Add(new KKFException(this.Logger, KKFExceptionCode.V0000, "ประเภทสินค้า P หรือ H ไม่สามารถกำหนดส่วนลดแบบ R ได้").Message);
                        }

                        string codeDiscountStdMain = x.customerCode + x.type + x.productTypeCode + (x.productGradeCode==null ? "0" : x.productGradeCode) + x.currencyCode;

                        //-------------------------------------- import Discount Mains --------------------------------------//
                        if(isSuccess) rsDiscountStdMains.id = DiscountStdMainADO.GetInstant().Import(transac, dataDiscountStdMain, codeDiscountStdMain, this.Logger);

                        // loop EffectiveDate
                        x.discountStdEffectiveDate.ForEach(
                            y =>
                            {
                                var rsDiscountStdEffectiveDate = new DiscountStdEffectiveDateRS();
                                try
                                {
                                    // set result rs
                                    rsDiscountStdEffectiveDate.effectiveDateFrom = y.effectiveDateFrom;
                                    rsDiscountStdEffectiveDate.effectiveDateTo = y.effectiveDateTo;
                                    
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
                                        isSuccess = false; isSuccessMain = false; chk_dt = false;
                                        rsDiscountStdEffectiveDate._result._message.Add(new KKFException(this.Logger, KKFExceptionCode.V0001, "Effective Date From Format").Message);
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
                                        rsDiscountStdEffectiveDate._result._message.Add(new KKFException(this.Logger, KKFExceptionCode.V0001, "Effective Date To Format").Message);
                                    }

                                    var dataDiscountStdEffectiveDate = new sxsDiscountStdEffectiveDate();
                                    dataDiscountStdEffectiveDate.DiscountStdMain_ID = rsDiscountStdMains.id;
                                    dataDiscountStdEffectiveDate.EffectiveDateFrom = dfrom;
                                    dataDiscountStdEffectiveDate.EffectiveDateTo = dto;
                                    dataDiscountStdEffectiveDate.CreateBy = empID;

                                    if (dfrom.Year != dto.Year && chk_dt) {
                                        isSuccess = false; isSuccessMain = false; 
                                        rsDiscountStdEffectiveDate._result._message.Add(new KKFException(this.Logger, KKFExceptionCode.V0000, "วันที่เริ่มต้นและวันสิ้นสุดต้องอยู่ปีเดียวกัน").Message);
                                    }
                                    if (dfrom > dto && chk_dt) {
                                        isSuccess = false; isSuccessMain = false; 
                                        rsDiscountStdEffectiveDate._result._message.Add(new KKFException(this.Logger, KKFExceptionCode.V0000, "วันที่เริ่มต้นต้องน้อยกว่าวันสิ้นสุด").Message);
                                    }
                                    if (dto < DateTime.Today && chk_dt)
                                    {
                                        isSuccess = false; isSuccessMain = false;
                                        rsDiscountStdEffectiveDate._result._message.Add(new KKFException(this.Logger, KKFExceptionCode.V0000, "วันที่สิ้นสุดต้องไม่น้อยกว่าวันที่ปัจจุบัน").Message);
                                    }

                                    if (PriceStdEffectiveDateADO.GetInstant().GetPriceEffectiveDate(dataDiscountStdMain, dataDiscountStdEffectiveDate, this.Logger).Count == 0)
                                    {
                                        isSuccess = false; isSuccessMain = false;
                                        rsDiscountStdEffectiveDate._result._message.Add(new KKFException(this.Logger, KKFExceptionCode.V0000, "ไม่พบตารางราคากลาง ในช่วงเวลาดังกล่าว").Message);
                                    }

                                    if (empID == 0)
                                    {
                                        isSuccess = false; isSuccessMain = false;
                                        rsDiscountStdEffectiveDate._result._message.Add(new KKFException(this.Logger, KKFExceptionCode.V0002, "Persent").Message);
                                    }

                                    

                                    //-------------------------------------- import Discount EffectiveDate --------------------------------------//
                                    if(isSuccess) rsDiscountStdEffectiveDate.id = DiscountStdEffectiveDateADO.GetInstant().Import(transac, dataDiscountStdEffectiveDate, codeDiscountStdMain, this.Logger);

                                    //----- type = C
                                    if (x.type == "C")
                                    {
                                        // loop DiscountStdProdCode Values
                                        y.discountStdProdCode.discountStdValues.ForEach(
                                            z =>
                                            {
                                                var rsDiscountStdValues = new DiscountStdValuesProdCodeRS();

                                                // isSuccess
                                                if (rsDiscountStdEffectiveDate.id != 0) isSuccess = true;

                                                try
                                                {
                                                    // set result rs
                                                    rsDiscountStdValues.productCode = z.productCode;
                                                    rsDiscountStdValues.unitTypeCode = z.unitTypeCode;
                                                    rsDiscountStdValues.discountPercent = z.discountPercent.Value;
                                                    rsDiscountStdValues.discountAmount = z.discountAmount.Value;
                                                    rsDiscountStdValues.increaseAmount = z.increaseAmount.Value;

                                                    //get id and validate
                                                    var dataDiscountStdProd = new sxsDiscountStdProd();
                                                    dataDiscountStdProd.Product_ID = ProductADO.GetInstant().GetByCode(z.productCode, dataDiscountStdMain.ProductType_ID, dataDiscountStdMain.ProductGrade_ID, this.Logger).Select(s => s.ID).FirstOrDefault();
                                                    dataDiscountStdProd.UnitType_ID = UnitTypeADO.GetInstant().GetByCode(z.unitTypeCode, this.Logger).Select(s => s.ID).FirstOrDefault();
                                                    dataDiscountStdProd.DiscountStdMain_ID = rsDiscountStdMains.id;
                                                    dataDiscountStdProd.CreateBy = empID;

                                                    if (dataDiscountStdProd.Product_ID == 0) {
                                                        isSuccess = false; isSuccessMain = false; 
                                                        rsDiscountStdValues._result._message.Add(new KKFException(this.Logger, KKFExceptionCode.V0002, "Product Code").Message);
                                                    }
                                                    if (dataDiscountStdProd.UnitType_ID == 0) {
                                                        isSuccess = false; isSuccessMain = false; 
                                                        rsDiscountStdValues._result._message.Add(new KKFException(this.Logger, KKFExceptionCode.V0002, "Sale Unit").Message);
                                                    }

                                                    if (! z.discountPercent.HasValue ||  z.discountPercent.Value < 0)
                                                    {
                                                        isSuccess = false; isSuccessMain = false; 
                                                        rsDiscountStdValues._result._message.Add(new KKFException(this.Logger, KKFExceptionCode.V0001, "Discount %").Message);
                                                    }
                                                    if (!z.discountAmount.HasValue || z.discountAmount.Value < 0)
                                                    {
                                                        isSuccess = false; isSuccessMain = false; 
                                                        rsDiscountStdValues._result._message.Add(new KKFException(this.Logger, KKFExceptionCode.V0001, "Discount Fix").Message);
                                                    }
                                                    if (!z.increaseAmount.HasValue || z.increaseAmount.Value < 0)
                                                    {
                                                        isSuccess = false; isSuccessMain = false; 
                                                        rsDiscountStdValues._result._message.Add(new KKFException(this.Logger, KKFExceptionCode.V0001, "increaseAmount").Message);
                                                    }

                                                    //if ( z.discountPercent.Value == 0 && z.discountAmount.Value == 0 && z.increaseAmount.Value == 0)
                                                    //{
                                                    //    isSuccess = false; isSuccessMain = false; 
                                                    //    rsDiscountStdValues._result._message.Add(new KKFException(this.Logger, KKFExceptionCode.V0000, "ค่า Discount %, Discount ต้องมีค่าใดค่าหนึ่งไม่เป็น 0").Message);
                                                    //}


                                                    //------------ validate price spec ------------//
                                                    if(PriceStdProdADO.GetInstant().GetForDiscount(transac, dataDiscountStdMain, dataDiscountStdEffectiveDate, dataDiscountStdProd, this.Logger).Count == 0)
                                                    {
                                                        isSuccess = false; isSuccessMain = false;
                                                        rsDiscountStdValues._result._message.Add(new KKFException(this.Logger, KKFExceptionCode.V0002, "ราคากลาง").Message);
                                                    }

                                                    //-------------------------------------- import DiscountStdProdCode --------------------------------------//
                                                    var dataDiscountStdValue = new sxsDiscountStdValue();

                                                    if(isSuccess) dataDiscountStdValue.DiscountStdProd_ID = DiscountStdProdADO.GetInstant().Import(transac, dataDiscountStdProd, this.Logger);

                                                    // set id and values
                                                    dataDiscountStdValue.DiscountStdEffectiveDate_ID = rsDiscountStdEffectiveDate.id;
                                                    dataDiscountStdValue.DiscountPercent =  z.discountPercent??0;
                                                    dataDiscountStdValue.DiscountAmount = z.discountAmount??0;
                                                    dataDiscountStdValue.IncreaseAmount = z.increaseAmount??0;
                                                    dataDiscountStdValue.CreateBy = empID;

                                                    //-------------------------------------- import DiscountStdValue_ProdCode --------------------------------------//
                                                    if(isSuccess) rsDiscountStdValues.id = DiscountStdValueADO.GetInstant().Import(transac, dataDiscountStdValue, this.employeeID, "I", this.Logger);

                                                }
                                                catch (Exception ex)
                                                {
                                                    rsDiscountStdValues._result._message.Add(ex.Message);
                                                    isSuccess = false; isSuccessMain = false; 
                                                }
                                                finally
                                                {
                                                    if(isSuccess) {
                                                        rsDiscountStdValues._result._status = "S";
                                                        rsDiscountStdValues._result._message.Add("SUCCESS");
                                                    }
                                                    else
                                                    {
                                                        rsDiscountStdValues._result._status = "F";
                                                    }
                                                    rsDiscountStdEffectiveDate.discountStdProdCode.discountStdValues.Add(rsDiscountStdValues);
                                                }
                                            }
                                        ); // end loop DiscountStdProdCode Values
                                    }
                                    //----- type = R
                                    else if (x.type == "R")
                                    {
                                        // loop DiscountStdRangeH
                                        y.discountStdRange.discountStdRangeH.ForEach(
                                            z =>
                                            {
                                                var rsDiscountStdRangeH = new DiscountStdRangeHRS();

                                                // isSuccess
                                                if (rsDiscountStdEffectiveDate.id != 0) isSuccess = true;

                                                try
                                                {
                                                    // set result rs
                                                    rsDiscountStdRangeH.colorCode = z.colorCode;
                                                    rsDiscountStdRangeH.unitTypeCode = z.unitTypeCode;
                                                    rsDiscountStdRangeH.minTwineSizeCode = z.minTwineSizeCode;
                                                    rsDiscountStdRangeH.maxTwineSizeCode = z.maxTwineSizeCode;
                                                    rsDiscountStdRangeH.knotCode = z.knotCode;
                                                    rsDiscountStdRangeH.stretchingCode = z.stretchingCode;
                                                    rsDiscountStdRangeH.selvageWovenTypeCode = z.selvageWovenTypeCode;
                                                    
                                                    //// get id and validate
                                                    var dataDiscountStdRangeH = new sxsDiscountStdRangeH();
                                                    dataDiscountStdRangeH.DiscountStdMain_ID = rsDiscountStdMains.id;
                                                    
                                                    var minTwineSize = ProductTwineSizeADO.GetInstant().GetByCode(z.minTwineSizeCode, productGroupID, this.Logger)
                                                    .Select(s => new { id = s.ID,  code = s.Code2, amount = s.FilamentAmount, size = s.FilamentSize, word = s.FilamentWord }).FirstOrDefault();
                                                    if (minTwineSize == null) {
                                                        isSuccess = false; isSuccessMain = false; 
                                                        rsDiscountStdRangeH._result._message.Add(new KKFException(this.Logger, KKFExceptionCode.V0002, "Dia Form").Message);
                                                    } else {
                                                        dataDiscountStdRangeH.MinProductTwineSizeCode = minTwineSize.code;
                                                        dataDiscountStdRangeH.MinFilamentAmount = minTwineSize.amount;
                                                        dataDiscountStdRangeH.MinFilamentSize = minTwineSize.size;
                                                        dataDiscountStdRangeH.MinFilamentWord = minTwineSize.word;
                                                    }
                                                    
                                                    
                                                    var maxTwineSize = ProductTwineSizeADO.GetInstant().GetByCode(z.maxTwineSizeCode, productGroupID, this.Logger)
                                                    .Select(s => new { id = s.ID, code = s.Code2, amount = s.FilamentAmount, size = s.FilamentSize, word = s.FilamentWord }).FirstOrDefault();
                                                    if (maxTwineSize == null) {
                                                        isSuccess = false; isSuccessMain = false; 
                                                        rsDiscountStdRangeH._result._message.Add(new KKFException(this.Logger, KKFExceptionCode.V0002, "Dia To").Message);
                                                    } else {
                                                        dataDiscountStdRangeH.MaxProductTwineSizeCode = maxTwineSize.code;
                                                        dataDiscountStdRangeH.MaxFilamentAmount = maxTwineSize.amount;
                                                        dataDiscountStdRangeH.MaxFilamentSize = maxTwineSize.size;
                                                        dataDiscountStdRangeH.MaxFilamentWord = maxTwineSize.word;

                                                    }
                                                    
                                                    if (dataDiscountStdRangeH.MinFilamentWord != dataDiscountStdRangeH.MaxFilamentWord)
                                                    {
                                                        isSuccess = false; isSuccessMain = false;
                                                        rsDiscountStdRangeH._result._message.Add(new KKFException(this.Logger, KKFExceptionCode.V0001, "Dia").Message);
                                                    }

                                                    if (BaseValidate.StringToDouble(z.minTwineSizeCode) > BaseValidate.StringToDouble(z.maxTwineSizeCode))
                                                    {
                                                        isSuccess = false; isSuccessMain = false; 
                                                        rsDiscountStdRangeH._result._message.Add(new KKFException(this.Logger, KKFExceptionCode.V0000, "Dia From ต้องมีค่า <= Dia To").Message);
                                                    }


                                                    dataDiscountStdRangeH.UnitType_ID = UnitTypeADO.GetInstant().GetByCode(z.unitTypeCode, this.Logger).Select(s => s.ID).FirstOrDefault();
                                                    if (dataDiscountStdRangeH.UnitType_ID == 0) {
                                                        isSuccess = false; isSuccessMain = false; 
                                                        rsDiscountStdRangeH._result._message.Add(new KKFException(this.Logger, KKFExceptionCode.V0002, "Sale Unit").Message);
                                                    }

                                                    // product type = อวน
                                                    if (PRODUCT1.IndexOf(x.productTypeCode) > -1)
                                                    {
                                                        // get id and validate
                                                        dataDiscountStdRangeH.ProductKnot_ID = BaseValidate.GetId(ProductKnotADO.GetInstant().GetByCode(z.knotCode, this.Logger).Select(s => s.ID).FirstOrDefault());
                                                        dataDiscountStdRangeH.ProductStretching_ID = BaseValidate.GetId(ProductStretchingADO.GetInstant().GetByCode(z.stretchingCode, this.Logger).Select(s => s.ID).FirstOrDefault());
                                                        dataDiscountStdRangeH.ProductSelvageWovenType_ID = BaseValidate.GetId(ProductSelvageWovenTypeADO.GetInstant().GetByCode(z.selvageWovenTypeCode, this.Logger).Select(s => s.ID).FirstOrDefault());

                                                        if (!dataDiscountStdRangeH.ProductKnot_ID.HasValue) {
                                                            isSuccess = false; isSuccessMain = false; 
                                                            rsDiscountStdRangeH._result._message.Add(new KKFException(this.Logger, KKFExceptionCode.V0002, "Knot").Message);
                                                        }
                                                        if (!dataDiscountStdRangeH.ProductStretching_ID.HasValue) {
                                                            isSuccess = false; isSuccessMain = false; 
                                                            rsDiscountStdRangeH._result._message.Add(new KKFException(this.Logger, KKFExceptionCode.V0002, "Strt").Message);
                                                        }

                                                        if (!dataDiscountStdRangeH.ProductSelvageWovenType_ID.HasValue && z.selvageWovenTypeCode != null) {
                                                            isSuccess = false; isSuccessMain = false; 
                                                            rsDiscountStdRangeH._result._message.Add(new KKFException(this.Logger, KKFExceptionCode.V0002, "หูทอ").Message);
                                                        }

                                                    }

                                                    dataDiscountStdRangeH.ProductColorGroup_ID = BaseValidate.GetId(ProductColorGroupADO.GetInstant().GetByColorCode(z.colorCode).Select(s => s.ID).FirstOrDefault());
                                                    if (!dataDiscountStdRangeH.ProductColorGroup_ID.HasValue && z.colorCode != null) {
                                                        isSuccess = false; isSuccessMain = false; 
                                                        rsDiscountStdRangeH._result._message.Add(new KKFException(this.Logger, KKFExceptionCode.V0002, "Color").Message);
                                                    }
                                                    dataDiscountStdRangeH.CreateBy = empID;

                                                    //----------------------------- validate Twine Size final -------------------------------------///
                                                    var dataPriceStdRangeH = PriceStdRangeHADO.GetInstant().GetForDiscount(transac, dataDiscountStdMain, dataDiscountStdEffectiveDate, dataDiscountStdRangeH, this.Logger);

                                                    if (dataPriceStdRangeH.Count != 0 )
                                                    {
                                                        // min
                                                        if(!dataPriceStdRangeH.Any( 
                                                            s => s.MinFilamentSize <= dataDiscountStdRangeH.MinFilamentSize
                                                                 && s.MinFilamentAmount <= dataDiscountStdRangeH.MinFilamentAmount
                                                                 && (s.MinFilamentWord != null ? Encoding.ASCII.GetBytes(s.MinFilamentWord).Length != 0 ? Encoding.ASCII.GetBytes(s.MinFilamentWord)[0] : 0 : 0) 
                                                                 <= (dataDiscountStdRangeH.MinFilamentWord != null ? Encoding.ASCII.GetBytes(dataDiscountStdRangeH.MinFilamentWord).Length != 0 ? Encoding.ASCII.GetBytes(dataDiscountStdRangeH.MinFilamentWord)[0] : 0 : 0)))
                                                        {
                                                            isSuccess = false; isSuccessMain = false;
                                                            rsDiscountStdRangeH._result._message.Add(new KKFException(this.Logger, KKFExceptionCode.V0002, "ราคากลาง").Message);
                                                        }

                                                        // max
                                                        if (!dataPriceStdRangeH.Any(
                                                            s => s.MaxFilamentSize >= dataDiscountStdRangeH.MaxFilamentSize
                                                                 && s.MaxFilamentAmount >= dataDiscountStdRangeH.MaxFilamentAmount
                                                                 && (s.MaxFilamentWord != null ? Encoding.ASCII.GetBytes(s.MaxFilamentWord).Length != 0 ? Encoding.ASCII.GetBytes(s.MaxFilamentWord)[0] : 0 : 0)
                                                                 >= (dataDiscountStdRangeH.MaxFilamentWord != null ? Encoding.ASCII.GetBytes(dataDiscountStdRangeH.MaxFilamentWord).Length != 0 ? Encoding.ASCII.GetBytes(dataDiscountStdRangeH.MaxFilamentWord)[0] : 0 : 0)))
                                                        {
                                                            isSuccess = false; isSuccessMain = false;
                                                            rsDiscountStdRangeH._result._message.Add(new KKFException(this.Logger, KKFExceptionCode.V0002, "ราคากลาง").Message);
                                                        }
                                                    }
                                                    else
                                                    {
                                                        isSuccess = false; isSuccessMain = false;
                                                        rsDiscountStdRangeH._result._message.Add(new KKFException(this.Logger, KKFExceptionCode.V0002, "ราคากลาง").Message);
                                                    }

                                                    //-------------------------------------- import DiscountStdRangeH --------------------------------------//
                                                    if (isSuccess) rsDiscountStdRangeH.id = DiscountStdRangeHADO.GetInstant().Import(transac, dataDiscountStdRangeH, this.Logger);


                                                    // loop DiscountStdValues
                                                    z.discountStdValues.ForEach(
                                                        v =>
                                                        {
                                                            var rsDiscountStdValues = new DiscountStdValuesRangeRS();
                                                            // set result rs
                                                            rsDiscountStdValues.discountPercent = v.discountPercent.Value;
                                                            rsDiscountStdValues.discountAmount = v.discountAmount.Value;
                                                            rsDiscountStdValues.increaseAmount = v.increaseAmount.Value;

                                                            var dataDiscountStdRangeD = new sxsDiscountStdRangeD();
                                                            dataDiscountStdRangeD.DiscountStdRangeH_ID = rsDiscountStdRangeH.id;

                                                            // product type = อวน
                                                            if (PRODUCT1.IndexOf(x.productTypeCode) > -1)
                                                            {
                                                                //set result
                                                                rsDiscountStdValues.minEyeSizeCM = v.minEyeSizeCM;
                                                                rsDiscountStdValues.maxEyeSizeCM = v.maxEyeSizeCM;
                                                                rsDiscountStdValues.minEyeAmountMD = v.minEyeAmountMD;
                                                                rsDiscountStdValues.maxEyeAmountMD = v.maxEyeAmountMD;
                                                                rsDiscountStdValues.minLengthM = v.minLengthM;
                                                                rsDiscountStdValues.maxLengthM = v.maxLengthM;

                                                                if (v.minEyeSizeCM.HasValue || v.maxEyeSizeCM.HasValue) {
                                                                    if(v.minEyeSizeCM.Value < 0 || v.maxEyeSizeCM.Value < 0)
                                                                    {
                                                                        isSuccess = false; isSuccessMain = false;
                                                                        rsDiscountStdRangeH._result._message.Add(new KKFException(this.Logger, KKFExceptionCode.V0001, "Mesh").Message);
                                                                    }
                                                                }

                                                                if (v.minEyeAmountMD.HasValue || v.maxEyeAmountMD.HasValue) {
                                                                    if(v.minEyeAmountMD.Value < 0 || v.maxEyeAmountMD.Value < 0)
                                                                    {
                                                                        isSuccess = false; isSuccessMain = false;
                                                                        rsDiscountStdRangeH._result._message.Add(new KKFException(this.Logger, KKFExceptionCode.V0001, "MD").Message);
                                                                    }
                                                                }

                                                                if (v.minLengthM.HasValue || v.maxLengthM.HasValue) {
                                                                    if (v.minLengthM.Value < 0 || v.maxLengthM.Value < 0)
                                                                    {
                                                                        isSuccess = false; isSuccessMain = false;
                                                                        rsDiscountStdRangeH._result._message.Add(new KKFException(this.Logger, KKFExceptionCode.V0001, "MTRS").Message);
                                                                    }
                                                                }
                                                                
                                                                if (v.minEyeSizeCM.HasValue && v.maxEyeSizeCM.HasValue) {
                                                                    if (v.minEyeSizeCM.Value > v.maxEyeSizeCM.Value)
                                                                    {
                                                                        isSuccess = false; isSuccessMain = false;
                                                                        rsDiscountStdRangeH._result._message.Add(new KKFException(this.Logger, KKFExceptionCode.V0000, "Mesh From ต้องมีค่า <= Mesh To").Message);
                                                                    }
                                                                }
                                                                if (v.minEyeAmountMD.HasValue &&  v.maxEyeAmountMD.HasValue) {
                                                                    if (v.minEyeAmountMD.Value > v.maxEyeAmountMD.Value)
                                                                    {
                                                                        isSuccess = false; isSuccessMain = false;
                                                                        rsDiscountStdRangeH._result._message.Add(new KKFException(this.Logger, KKFExceptionCode.V0000, "MD From ต้องมีค่า <= MD To").Message);
                                                                    }
                                                                }
                                                                if (v.minLengthM.HasValue && v.maxLengthM.HasValue) {
                                                                    if (v.minLengthM.Value > v.maxLengthM.Value)
                                                                    {
                                                                        isSuccess = false; isSuccessMain = false;
                                                                        rsDiscountStdRangeH._result._message.Add(new KKFException(this.Logger, KKFExceptionCode.V0000, "MTRS From ต้องมีค่า <= MTRS To").Message);
                                                                    }
                                                                }

                                                                dataDiscountStdRangeD.MinMeshSize = v.minEyeSizeCM;
                                                                dataDiscountStdRangeD.MaxMeshSize = v.maxEyeSizeCM;
                                                                dataDiscountStdRangeD.MinMeshDepth = v.minEyeAmountMD;
                                                                dataDiscountStdRangeD.MaxMeshDepth = v.maxEyeAmountMD;
                                                                dataDiscountStdRangeD.MinLength = v.minLengthM;
                                                                dataDiscountStdRangeD.MaxLength = v.maxLengthM;

                                                                dataDiscountStdRangeD.TagDescription = BaseValidate.GetTagDescription(v.minEyeSizeCM, v.maxEyeSizeCM, v.minEyeAmountMD, v.maxEyeAmountMD, v.minLengthM, v.maxLengthM);

                                                                /////////////////////---------------------------- add new Sales Description ------------------------------///////////////////////
                                                                dataDiscountStdRangeD.SalesDescription = "";
                                                                rsDiscountStdRangeH._result._message.Add(new KKFException(this.Logger, KKFExceptionCode.V0001, "Sales Description is null.").Message);
                                                            }

                                                            // product type = เอ็น และเส้นด้าย
                                                            else if (PRODUCT2.IndexOf(x.productTypeCode) > -1)
                                                            {
                                                                //get id and validate
                                                                var TwineSeries = ProductTwineSeriesADO.GetInstant().GetByCode(v.productTwineSeriesCode, dataDiscountStdMain.ProductType_ID, this.Logger)
                                                                .Select(s => new { ID = s.ID, Description = s.Description }).FirstOrDefault();

                                                                if (TwineSeries != null)
                                                                {
                                                                    dataDiscountStdRangeD.ProductTwineSeries_ID = TwineSeries.ID;
                                                                    dataDiscountStdRangeD.TagDescription = TwineSeries.Description;
                                                                }
                                                                else {
                                                                    isSuccess = false; isSuccessMain = false;
                                                                    rsDiscountStdRangeH._result._message.Add(new KKFException(this.Logger, KKFExceptionCode.V0002, "Series Code").Message);
                                                                }
                                                                
                                                                rsDiscountStdValues.productTwineSeriesCode = v.productTwineSeriesCode;

                                                            }

                                                            // chk fob, caf, cif
                                                            if (!v.discountPercent.HasValue || v.discountPercent.Value < 0) {
                                                                isSuccess = false; isSuccessMain = false; 
                                                                rsDiscountStdRangeH._result._message.Add(new KKFException(this.Logger, KKFExceptionCode.V0001, "Discount %").Message);
                                                            }
                                                            if (!v.discountAmount.HasValue || v.discountAmount.Value < 0) {
                                                                isSuccess = false; isSuccessMain = false; 
                                                                rsDiscountStdRangeH._result._message.Add(new KKFException(this.Logger, KKFExceptionCode.V0001, "Discount Fix").Message);
                                                            }
                                                            if (!v.increaseAmount.HasValue || v.increaseAmount.Value < 0) {
                                                                isSuccess = false; isSuccessMain = false; 
                                                                rsDiscountStdRangeH._result._message.Add(new KKFException(this.Logger, KKFExceptionCode.V0001, "increaseAmount").Message);
                                                            }

                                                            //if (v.discountPercent.Value == 0 && v.discountAmount.Value == 0 && v.increaseAmount.Value == 0) {
                                                            //    isSuccess = false; isSuccessMain = false; 
                                                            //    rsDiscountStdRangeH._result._message.Add(new KKFException(this.Logger, KKFExceptionCode.V0000, "ค่า Discount %, Discount Fix  ต้องมีค่าใดค่าหนึ่งไม่เป็น 0").Message);
                                                            //}

                                                            dataDiscountStdRangeD.CreateBy = empID;

                                                            var dataDiscountStdValue = new sxsDiscountStdValue();

                                                            //-------------------------------------- import DiscountStdRangeD --------------------------------------//
                                                            if(isSuccess) dataDiscountStdValue.DiscountStdRangeD_ID = DiscountStdRangeDADO.GetInstant().Import(transac, dataDiscountStdRangeD, this.Logger);

                                                            //set values id
                                                            dataDiscountStdValue.DiscountStdEffectiveDate_ID = rsDiscountStdEffectiveDate.id;
                                                            dataDiscountStdValue.DiscountPercent = v.discountPercent??0;
                                                            dataDiscountStdValue.DiscountAmount = v.discountAmount??0;
                                                            dataDiscountStdValue.IncreaseAmount = v.increaseAmount??0;
                                                            dataDiscountStdValue.CreateBy = empID;

                                                            //-------------------------------------- import DiscountStdValue_Range --------------------------------------//
                                                            if(isSuccess) rsDiscountStdValues.id = DiscountStdValueADO.GetInstant().Import(transac, dataDiscountStdValue, this.employeeID, "I", this.Logger);
                                                            if (rsDiscountStdValues.id != 0)
                                                            {
                                                                //----------- validate chk RangeD between -------------//
                                                                GetRangeBetweenRequest rqRangeBetween = new GetRangeBetweenRequest();
                                                                rqRangeBetween.MainID = rsDiscountStdMains.id;
                                                                rqRangeBetween.RangDID = dataDiscountStdValue.DiscountStdRangeD_ID.Value;
                                                                rqRangeBetween.effectiveDateFrom = dataDiscountStdEffectiveDate.EffectiveDateFrom;
                                                                rqRangeBetween.effectiveDateTo = dataDiscountStdEffectiveDate.EffectiveDateTo;

                                                                rqRangeBetween.ProductKnot_ID = dataDiscountStdRangeH.ProductKnot_ID;
                                                                rqRangeBetween.ProductStretching_ID = dataDiscountStdRangeH.ProductStretching_ID;
                                                                rqRangeBetween.UnitType_ID = dataDiscountStdRangeH.UnitType_ID;
                                                                rqRangeBetween.ProductSelvageWovenType_ID = dataDiscountStdRangeH.ProductSelvageWovenType_ID;
                                                                rqRangeBetween.ProductColorGroup_ID = dataDiscountStdRangeH.ProductColorGroup_ID;

                                                                rqRangeBetween.MinFilamentSize = dataDiscountStdRangeH.MinFilamentSize;
                                                                rqRangeBetween.MinFilamentAmount = dataDiscountStdRangeH.MinFilamentAmount;
                                                                rqRangeBetween.MinFilamentWord = dataDiscountStdRangeH.MinFilamentWord;

                                                                rqRangeBetween.MaxFilamentSize = dataDiscountStdRangeH.MaxFilamentSize;
                                                                rqRangeBetween.MaxFilamentAmount = dataDiscountStdRangeH.MaxFilamentAmount;
                                                                rqRangeBetween.MaxFilamentWord = dataDiscountStdRangeH.MaxFilamentWord;

                                                                rqRangeBetween.MinMeshSize = dataDiscountStdRangeD.MinMeshSize;
                                                                rqRangeBetween.MaxMeshSize = dataDiscountStdRangeD.MaxMeshSize;
                                                                rqRangeBetween.MinMeshDepth = dataDiscountStdRangeD.MinMeshDepth;
                                                                rqRangeBetween.MaxMeshDepth = dataDiscountStdRangeD.MaxMeshDepth;
                                                                rqRangeBetween.MinLength = dataDiscountStdRangeD.MinLength;
                                                                rqRangeBetween.MaxLength = dataDiscountStdRangeD.MaxLength;

                                                                DiscountStdRangeDADO.GetInstant().GetRangeBetween(transac, rqRangeBetween, this.Logger).ForEach(
                                                                   s =>
                                                                   {
                                                                       isSuccess = false; isSuccessMain = false;
                                                                       string str = "Data Overlap {} " + s.MinProductTwineSizeCode + " - " + s.MaxProductTwineSizeCode + ", "
                                                                           + BaseValidate.DecimalToString(s.MinEyeSizeCM) + " - " + BaseValidate.DecimalToString(s.MaxEyeSizeCM) + ", "
                                                                           + BaseValidate.DecimalToString(s.MinEyeAmountMD) + " - " + BaseValidate.DecimalToString(s.MaxEyeAmountMD) + ", "
                                                                           + BaseValidate.DecimalToString(s.MinLengthM) + " - " + BaseValidate.DecimalToString(s.MaxLengthM);

                                                                       var ex = new KKFException(this.Logger, KKFExceptionCode.V0000, str);
                                                                       rsDiscountStdRangeH._result._message.Add(ex.Message);
                                                                    }
                                                               );
                                                            }

                                                            rsDiscountStdRangeH.discountStdValues.Add(rsDiscountStdValues);

                                                        }
                                                    ); // end loop DiscountStdValues

                                                }
                                                catch (Exception ex)
                                                {
                                                    rsDiscountStdRangeH._result._message.Add(ex.Message);
                                                    isSuccess = false; isSuccessMain = false; 
                                                }
                                                finally
                                                {
                                                    if (isSuccess)
                                                    {
                                                        rsDiscountStdRangeH._result._message.Add("SUCCESS");
                                                        rsDiscountStdRangeH._result._status = "S";
                                                    }
                                                    else rsDiscountStdRangeH._result._status = "F";

                                                    rsDiscountStdEffectiveDate.discountStdRange.discountStdRangeH.Add(rsDiscountStdRangeH);
                                                }   
                                            }
                                        ); // end loop DiscountStdRangeH
                                    }
                                }
                                catch (Exception ex)
                                {
                                    rsDiscountStdEffectiveDate._result._message.Add(ex.Message);
                                    isSuccess = false; isSuccessMain = false; 
                                }
                                finally
                                {
                                    if(isSuccess)
                                    {
                                        rsDiscountStdEffectiveDate._result._message.Add("SUCCESS");
                                        rsDiscountStdEffectiveDate._result._status = "S";
                                    }
                                    else rsDiscountStdEffectiveDate._result._status = "F";

                                    rsDiscountStdMains.discountStdEffectiveDate.Add(rsDiscountStdEffectiveDate);
                                }
                            }
                        ); // end loop EffectiveDate


                    }
                    catch (Exception ex)
                    {
                        rsDiscountStdMains._result._message.Add(ex.Message);
                        isSuccess = false; isSuccessMain = false; 
                    }
                    finally
                    {
                        if (isSuccess)
                        {
                            rsDiscountStdMains._result._message.Add("SUCCESS");
                            rsDiscountStdMains._result._status = "S";
                        }
                        else rsDiscountStdMains._result._status = "F";

                        dataRes.discountStdMains.Add(rsDiscountStdMains);
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
