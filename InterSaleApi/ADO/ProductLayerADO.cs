using Dapper;
using InterSaleModel.Model.Entity;
using KKFCoreEngine.KKFLogger;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InterSaleApi.ADO
{
    public class ProductLayerADO : BaseADO
    {

        private static ProductLayerADO instant;
        public static ProductLayerADO GetInstant()
        {
            if (instant == null)
                instant = new ProductLayerADO();
            return instant;
        }
        private ProductLayerADO() { }

        public List<sxsProduct> ListByProductID(int productID, Logger logger = null)
        {
            string cmd = "exec SP_ProductLayer_ListByProductID @productID";
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@productID", productID);

            var res = this.Query<sxsProduct>(cmd, param, logger).ToList();
            return res;

        }

    }
}
