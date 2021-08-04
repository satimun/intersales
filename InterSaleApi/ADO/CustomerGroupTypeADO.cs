using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using InterSaleModel.Model.Entity;

namespace InterSaleApi.ADO
{
    public class CustomerGroupTypeADO : BaseADO
    {
        private static CustomerGroupTypeADO instant;
        public static CustomerGroupTypeADO GetInstant()
        {
            if (instant == null)
                instant = new CustomerGroupTypeADO();
            return instant;
        }
        private CustomerGroupTypeADO() { }

        public List<sxsCustomerGroup> List()
        {
            string cmd = "exec SP_CustomerGroupType_List";
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();

            return Query<sxsCustomerGroup>(cmd, param).ToList();
        }
    }
}
