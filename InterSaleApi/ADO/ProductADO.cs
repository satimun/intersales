using InterSaleModel.Model.API.Request.PublicRequest;
using InterSaleModel.Model.Entity;
using InterSaleModel.Model.Entity.Request;
using InterSaleModel.Model.Views;
using KKFCoreEngine.KKFLogger;
using KKFCoreEngine.Util;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InterSaleApi.ADO
{
    public class ProductADO : BaseADO
    {
        private static ProductADO instant;
        public static ProductADO GetInstant()
        {
            if (instant == null)
                instant = new ProductADO();
            return instant;
        }
        private ProductADO() { }

        public List<sxvProductGet> Get(string productCode, string productGradeCode , Logger logger = null)
        {
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@productCode", productCode);
            param.Add("@productGradeCode", productGradeCode);

            return Query<sxvProductGet>("SP_Product_Get", param, logger).ToList();
        }

        //public List<sxvProductGet> SearchByRange(GetProductRangeRequest data, Logger logger = null)
        //{
        //    string cmd = "exec SP_Product_SearchByRange @productGradeID, @productTypeID, @knotID, @stretchingID, @twineseriesID, " +
        //                 "@selvageWovenTypeID, @colorgroupID, @mintwine, @maxtwine, @minEyeSize, " +
        //                 "@maxEyeSize, @minEyeAmt, @maxEyeAmt, @minLen, @maxLen";

        //    Dapper.DynamicParameters param = new Dapper.DynamicParameters();
        //    param.Add("@productGradeID", data.productGradeID);
        //    param.Add("@productTypeID", data.productTypeID);

        //    param.Add("@knotID", data.knotID);
        //    param.Add("@stretchingID", data.stretchingID);
        //    param.Add("@twineseriesID", data.twineseriesID);
        //    param.Add("@selvageWovenTypeID", data.selvageWovenTypeID);
        //    param.Add("@colorgroupID", data.colorGroupID);
        //    param.Add("@mintwine", data.mintwine);
        //    param.Add("@maxtwine", data.maxtwine);
        //    param.Add("@minEyeSize", data.minMeshSize);
        //    param.Add("@maxEyeSize", data.maxMeshSize);
        //    param.Add("@minEyeAmt", data.minMeshDepth);
        //    param.Add("@maxEyeAmt", data.maxMeshDepth);
        //    param.Add("@minLen", data.minLength);
        //    param.Add("@maxLen", data.maxLength);
        //    var res = Query<sxvProductGet>(cmd, param, logger).ToList();
        //    return Query<sxvProductGet>(cmd, param, logger).ToList();
        //}


        //public List<sxsProduct> Find(int ID, Logger logger = null)
        //{
        //    string cmd = "exec ST_Product_Find @id";
        //    Dapper.DynamicParameters param = new Dapper.DynamicParameters();
        //    param.Add("@id", ID);

        //    return Query<sxsProduct>(cmd, param, logger).ToList();
        //}

        public List<sxvProductGet> GetByID(int ID, Logger logger = null)
        {
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@id", ID);

            return QuerySP<sxvProductGet>("SP_Product_GetByID", param, logger).ToList();
        }
        
        public List<sxsProduct> GetByCode(string code, int productTypeID, int? productGradeID, Logger logger = null)
        {
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@code", code);
            param.Add("@productTypeID", productTypeID);
            param.Add("@productGradeID", productGradeID);

            return QuerySP<sxsProduct>("SP_Product_GetByCode", param, logger).ToList();
        }


        public List<sxvProductGet> SearchLayerByProductID(int productID, Logger logger = null)
        {
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@productID", productID);

            var res = QuerySP<sxvProductGet>("SP_ProductLayer_ListByProductID", param, logger).ToList();
            return res;

        }

        public List<sxvProductGet> Search(SearchRequest d, Logger logger = null)
        {
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@ids", StringUtil.Join(",", d.ids));
            param.Add("@productTypeIDs", StringUtil.Join(",", d.ids1));
            param.Add("@productGradeIDs", StringUtil.Join(",", d.ids2));
            param.Add("@codes", StringUtil.Join(",", d.codes));
            param.Add("@search", d.search);

            return QuerySP<sxvProductGet>("SP_Product_Search", param, logger).ToList();
        }

        public List<sxvProductGetLight> SearchLight(SearchRequest d, Logger logger = null)
        {
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@ids", StringUtil.Join(",", d.ids));
            param.Add("@productTypeIDs", StringUtil.Join(",", d.ids1));
            param.Add("@productGradeIDs", StringUtil.Join(",", d.ids2));
            param.Add("@codes", StringUtil.Join(",", d.codes));
            param.Add("@search", d.search);

            return QuerySP<sxvProductGetLight>("SP_Product_SearchLight", param, logger).ToList();
        }

    }

}
