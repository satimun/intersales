using InterSaleModel.Model.API.Request;
using InterSaleModel.Model.API.Response.PublicModel;
using InterSaleModel.Model.Entity;
using InterSaleModel.Model.Views;
using KKFCoreEngine.KKFLogger;
using KKFCoreEngine.Util;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;

namespace InterSaleApi.ADO
{
    public class DiscountStdValueADO : BaseADO
    {
        private static DiscountStdValueADO instant;
        public static DiscountStdValueADO GetInstant()
        {
            if (instant == null)
                instant = new DiscountStdValueADO();
            return instant;
        }
        private DiscountStdValueADO() { }

        public List<sxvDiscountStdSearchDiscountProd> SearchDiscountStdProd(int discountEffectiveDateID, string search = "", string discountStdValueStatus = null, Logger logger = null)
        {
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@discountEffectiveDateID", discountEffectiveDateID);
            param.Add("@search", search);
            param.Add("@discountStdValueStatus", discountStdValueStatus);

            return QuerySP<sxvDiscountStdSearchDiscountProd>("SP_DiscountStd_SearchDiscountProd", param, logger).ToList();
        }

        public List<sxvDiscountStdSearchDiscountRangeValue> SearchDiscountStdRangeValue(int discountEffectiveDateID, int discountRangeHID, string search = "", string discountStdValueStatus = null, Logger logger = null)
        {
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@discountEffectiveDateID", discountEffectiveDateID);
            param.Add("@discountRangeHID", discountRangeHID);
            param.Add("@search", search);
            param.Add("@discountStdValueStatus", discountStdValueStatus);

            return QuerySP<sxvDiscountStdSearchDiscountRangeValue>("SP_DiscountStd_SearchDiscountRangeValue", param, logger).ToList();
        }

        public int Import(SqlTransaction transac, sxsDiscountStdValue d, int empID, string updateFlag = "I", Logger logger = null)
        {
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@ID", d.ID);
            param.Add("@discountStdRangeDID", d.DiscountStdRangeD_ID);
            param.Add("@discountStdProdID", d.DiscountStdProd_ID);
            param.Add("@discountStdEffectiveDateID", d.DiscountStdEffectiveDate_ID);
            param.Add("@discountPercent", d.DiscountPercent);
            param.Add("@discountAmount", d.DiscountAmount);
            param.Add("@increaseAmount", d.IncreaseAmount);
            param.Add("@createBy", d.CreateBy);
            param.Add("@empID", empID);
            param.Add("@updateFlag", updateFlag);
            param.Add("@cloneFlag", d.cloneFlag);

            return ExecuteScalarSP<int>(transac, "SP_DiscountStdValue_Import", param, logger);
        }

        //public string UpdateStatus(SqlTransaction transac, int discountStdValueID, string status, int empID = 0, Logger logger = null)
        //{
        //    string cmd = "exec SP_DiscountStdValue_UpdateStatus @discountStdValueID, @status, @empID";
        //    Dapper.DynamicParameters param = new Dapper.DynamicParameters();
        //    param.Add("@discountStdValueID", discountStdValueID);
        //    param.Add("@status", status);
        //    param.Add("@empID", empID);

        //    return ExecuteScalar<string>(transac, cmd, param, logger);
        //}

        public List<UpdateStatusRes.idStatus> UpdateStatus(SqlTransaction transac, UpdateStatusReq d, int empID = 0, Logger logger = null)
        {
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@ids", StringUtil.Join(",", d.ids));
            param.Add("@status", StringUtil.GetStringValue(d.status));
            param.Add("@tableName", "sxsDiscountStdValue");
            param.Add("@empID", empID);

            return QuerySP<UpdateStatusRes.idStatus>(transac, "SP_Update_Status", param, logger).ToList();
        }

        public List<sxsDiscountStdValue> GetByRangeDID(List<int> ids, List<string> status, Logger logger = null, SqlTransaction transac = null)
        {
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@vals", StringUtil.Join(",", ids));
            param.Add("@tableName", "sxsDiscountStdValue");
            param.Add("@colIDName", "DiscountStdRangeD_ID");
            param.Add("@status", StringUtil.Join(",", status));

            return QuerySP<sxsDiscountStdValue>(transac, "SP_SearchData_BySelectCol", param, logger).ToList();
        }

        public int ReApproval(int effectiveID, int rangeHID, int empID = 0, Logger logger = null, SqlTransaction transac = null)
        {
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@discountEffectiveDateID", effectiveID);
            param.Add("@discountRangeHID", rangeHID);
            param.Add("@empID", empID);

            return ExecuteScalarSP<int>(transac, "SP_DiscountStdValue_ReApproval", param, logger);
        }
    }
}
