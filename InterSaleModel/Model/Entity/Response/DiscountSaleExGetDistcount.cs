using System;
using System.Collections.Generic;
using System.Text;

namespace InterSaleModel.Model.Entity.Response
{
    public class DiscountSaleExGetDistcount
    {
        public string discountNo;
        public int CustomerID;
        public string CustomerCode;
        public int CountryGroupID;
        public int CurrencyID;
        public string CurrencyCode;
        public int ProductTypeID;
        public string ProductTypeCode;
        public string GroupType;
        public int? ProductGradeID;
        public string ProductGradeCode;
        public int? productID;
        public string ProductCode;
        public DateTime EffectiveDateFrom;
        public DateTime EffectiveDateTo;
        public int UnitTypeID;
        public string UnitTypeCode;
        public string MinProductTwineSizeCode;
        public string MaxProductTwineSizeCode;
        public decimal? MinFilamentSize;
        public decimal? MinFilamentAmount;
        public string MinFilamentWord;
        public decimal? MaxFilamentSize;
        public decimal? MaxFilamentAmount;
        public string MaxFilamentWord;
        public int? ProductKnotID;
        public string ProductKnotCode;
        public int? ProductTwineSeriesID;
        public string ProductTwineSeriesCode;
        public string ProductTwineSeriesDes;
        public int? ProductStretchingID;
        public string ProductStretchingCode;
        public int? ProductSelvageWovenTypeID;
        public string ProductSelvageWovenTypeCode;
        public string ColorGroupCode;
        public decimal? MinEyeSizeCM;
        public decimal? MaxEyeSizeCM;
        public decimal? MinEyeAmountMD;
        public decimal? MaxEyeAmountMD;
        public decimal? MinLengthM;
        public decimal? MaxLengthM;

        public string MinMeshSize;
        public string MaxMeshSize;
        public string MinMeshDepth;
        public string MaxMeshDepth;
        public string MinLength;
        public string MaxLength;

        public decimal DiscountPercent;
        public decimal DiscountAmount;
    }
}
