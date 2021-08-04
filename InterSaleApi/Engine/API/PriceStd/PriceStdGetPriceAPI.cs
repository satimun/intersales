using InterSaleApi.ADO;
using InterSaleApi.Engine.Validate;
using InterSaleModel.Model.API.Request;
using InterSaleModel.Model.API.Response;
using InterSaleModel.Model.Entity.Request;
using KKFCoreEngine.Constant;
using KKFCoreEngine.KKFException;
using System;
using System.Linq;

namespace InterSaleApi.Engine.API
{
    public class PriceStdGetPriceAPI : BaseAPIEngine<PriceStdGetPriceRequest, PriceStdGetPriceResponse>
    {
        protected override string PermissionKey { get { return "PUBLIC_API"; } }

        protected override void ExecuteChild(PriceStdGetPriceRequest dataReq, PriceStdGetPriceResponse dataRes)
        {
            Boolean isSuccess = true;

            int currency_ID = CurrencyADO.GetInstant().GetByCode(dataReq.currencyCode, this.Logger).Select(s => s.ID).FirstOrDefault();
            if (currency_ID == 0) { throw new KKFException(this.Logger, KKFExceptionCode.V0002, "สกุลเงิน"); }

            int custormer_ID = CustomerADO.GetInstant().GetByCode(dataReq.customerCode, this.Logger).Select(s => s.ID).FirstOrDefault();
            if (custormer_ID == 0) { throw new KKFException(this.Logger, KKFExceptionCode.V0002, "ลูกค้า"); }

            int unitType_ID = UnitTypeADO.GetInstant().GetByCode(dataReq.unitTypeCode, this.Logger).Select(s => s.ID).FirstOrDefault();
            if (unitType_ID == 0) { throw new KKFException(this.Logger, KKFExceptionCode.V0002, "หน่วยขาย"); }

            DateTime dfrom, dto;
            try
            {
                dfrom = BaseValidate.GetDate(dataReq.effectiveDateFrom);
                dto = BaseValidate.GetDate(dataReq.effectiveDateTo);
            }
            catch (Exception ex)
            {
                Logger.LogError(ex.Message);
                throw new KKFException(this.Logger, KKFExceptionCode.V0001, "รูปแบบวันที่");
            }

            for (int i = 0; i < dataReq.productCodes.Length; i++)
            {
                PriceStds priceStd = new PriceStds();
                try
                {
                    GetPriceRequest dataPrice = new GetPriceRequest();

                    dataPrice.currencyID = currency_ID;
                    dataPrice.customerID = custormer_ID;
                    dataPrice.unitTypeID = unitType_ID;
                    dataPrice.effectiveDateFrom = dfrom;
                    dataPrice.effectiveDateTo = dto;


                    ProductADO.GetInstant().Get(dataReq.productCodes[i], dataReq.productGradeCodes[i], this.Logger).ForEach(
                        p => {

                            priceStd.productCode = p.Code;
                            priceStd.productDescription = p.Description;
                            priceStd.productGradeCode = p.ProductGrade_Code;
                            priceStd.customerCode = dataReq.customerCode;


                            dataPrice.productGradeID = p.ProductGrade_ID;
                            dataPrice.productTypeID = p.ProductType_ID;
                            dataPrice.productID = p.ID;

                            // productCodes
                            PriceStdADO.GetInstant().GetPriceTableC(dataPrice, this.Logger).ForEach(
                                x =>
                                {
                                    PriceValues tmp = new PriceValues();
                                    tmp.priceStdValueID = x.priceStdValueID;
                                    tmp.priceStdTableType = "C";
                                    tmp.priceStdTableCode = x.priceStdTableCode;
                                    tmp.priceFOB = x.priceFOB;
                                    tmp.priceCAF = x.priceCAF;
                                    tmp.priceCIF = x.priceCIF;
                                    tmp.effectiveStatus = x.effectiveStatus;
                                    tmp.priceStatus = x.priceStatus;
                                    priceStd.priceValues.Add(tmp);
                                }
                            );
                            
                            // productRanges
                            PriceStdADO.GetInstant().GetPriceTableR(dataPrice, this.Logger).ForEach(
                                x =>
                                {
                                    PriceValues tmp = new PriceValues();
                                    tmp.priceStdValueID = x.priceStdValueID;
                                    tmp.priceStdTableType = "R";
                                    tmp.priceStdTableCode = x.priceStdTableCode;
                                    tmp.priceFOB = x.priceFOB;
                                    tmp.priceCAF = x.priceCAF;
                                    tmp.priceCIF = x.priceCIF;
                                    tmp.effectiveStatus = x.effectiveStatus;
                                    tmp.priceStatus = x.priceStatus;
                                    priceStd.priceValues.Add(tmp);
                                }
                            );
                        }
                    );
                }
                catch (Exception ex)
                {
                    isSuccess = false;
                    priceStd._result._status = "F";
                    priceStd._result._message = ex.Message;
                }
                finally
                {
                    if (isSuccess)
                    {
                        priceStd._result._status = "S";
                        priceStd._result._message = "SUCCESS";
                    }
                    else
                    {
                        priceStd._result._status = "F";
                    }
                    //var tmpx = priceStd.priceValues.OrderBy((o => o.priceStdTableType)).ToList();
                    dataRes.priceStds.Add(priceStd);
                }

            }

            if (!isSuccess)
            {
                throw new KKFException(this.Logger, KKFExceptionCode.S0001, "");
            }
        }
    }
}
