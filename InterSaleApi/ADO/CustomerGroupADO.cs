using InterSaleModel.Model.Entity;
using InterSaleModel.Model.Entity.Response;
using KKFCoreEngine.KKFLogger;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;

namespace InterSaleApi.ADO
{
    
    public class CustomerGroupADO:BaseADO
    {
        private static CustomerGroupADO instant;
        public static CustomerGroupADO GetInstant()
        {
            if (instant == null)
                instant = new CustomerGroupADO();
            return instant;
        }
        private CustomerGroupADO() { }

        public List<sxsCustomerGroup> Search(string search, string grouptype, List<string> status, Logger logger = null)
        {
            string cmd = "exec SP_CustomerGroup_Search @Code,  @Description, @GroupType, @status";
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@Code", search);
            param.Add("@Description", search);
            param.Add("@GroupType", grouptype);
            param.Add("@status", string.Join(',', status));

            return Query<sxsCustomerGroup>(cmd, param, logger).ToList();
        }

        public List<GetCustomerGroupSearchCustomer> SearchCustomer(string search, string customerGroupID, Logger logger = null)
        {
            string cmd = "exec SP_CustomerGroup_SearchCustomer @search,   @customerGroupIDs";
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@search", search);         
            param.Add("@customerGroupIDs",  customerGroupID);

            return Query<GetCustomerGroupSearchCustomer>(cmd, param, logger).ToList();
        }

        public List<sxsCustomerGroup> UpdateStatus(SqlTransaction transac, int  ID, string status, int empID = 0, Logger logger = null)
        {
            string cmd = "exec SP_CustomerGroup_UpdateStatus @ID, @status, @empID";
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@ID",  ID);
            param.Add("@status", status);
            param.Add("@empID", empID);
             
            return Query<sxsCustomerGroup>(transac, cmd, param, logger).ToList();
        }

        public List<sxsCustomerGroup> SaveGroup(SqlTransaction transac,
            int  ID, string GroupType, string Code, string Description, string status, int empID = 0, Logger logger = null)
        {
            string cmd = "exec SP_CustomerGroup_SaveGroup @ID, @GroupType, @Code, @Description, @status, @empID";
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@ID", ID);
            param.Add("@GroupType", GroupType);
            param.Add("@Code", Code);
            param.Add("@Description", Description);        
            param.Add("@status", status);
            param.Add("@empID", empID);

            return Query<sxsCustomerGroup>(transac, cmd, param, logger).ToList();
        }

        public List<sxsCustomerGroup> ListByType(string GroupType, Logger logger = null)
        {
            string cmd = "exec SP_CustomerGroup_ListByType  @GroupType";
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();        
            param.Add("@GroupType", GroupType);   

            return Query<sxsCustomerGroup>( cmd, param, logger).ToList();
        }

        public List<GetCustomerGroupMoveCustomerMapping> MoveCustomerMapping(SqlTransaction transac, int customerGroupID, int customerID, int empID = 0, Logger logger = null)
        {
            string cmd = "exec SP_CustomerGroup_MoveCustomerMapping   @customerGroupID, @customerID , @empID";
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@customerGroupID", customerGroupID);
            param.Add("@customerID", customerID);
            param.Add("@empID", empID);
            return Query<GetCustomerGroupMoveCustomerMapping>(cmd, param, logger).ToList();
        }

        public List<GetCustomerGroupMoveCustomerMapping> CancelCustomerMapping(SqlTransaction transac, int customerGroupID,   int customerID, int empID = 0, Logger logger = null)
        {
            string cmd = "exec [SP_CustomerGroup_CancelCustomerMapping]   @customerGroupID, @customerID ";
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@customerGroupID", customerGroupID);
            param.Add("@customerID", customerID);
            //param.Add("@empID", empID);
            return Query<GetCustomerGroupMoveCustomerMapping>(cmd, param, logger).ToList();
        }
    }
}
