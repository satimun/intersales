using Dapper;
using KKFCoreEngine.KKFLogger;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;

namespace InterSaleApi.ADO
{
    public abstract class BaseADO
    {

        //private const string CONNECTIONSTRING = "Server=191.20.2.3;Uid=sa;PASSWORD=abc123;database=smartsales_dev;Max Pool Size=400;Connect Timeout=1200;";
        public static string CONNECTIONSTRING { get; set; }
        private string DynamicParametersToString(DynamicParameters parameter)
        {
            if (parameter == null) return string.Empty;
            return string.Join(" , ", parameter.ParameterNames.ToList().Select(x => string.Format("@{0}='{1}'", x, parameter.Get<object>(x))));
        }
        protected T ExecuteScalar<T>(string cmdTxt, DynamicParameters parameter = null, Logger logger = null)
        {
            using(SqlConnection conn = new SqlConnection(CONNECTIONSTRING))
            {
                if (logger != null) logger.LogInfo("ExecuteScalar = " + cmdTxt + " | " + this.DynamicParametersToString(parameter));
                var res = SqlMapper.ExecuteScalar<T>(conn, cmdTxt, parameter, null, 180);
                if (logger != null) logger.LogInfo("ExecuteScalar OK");
                return res;
            }
        }
        protected T ExecuteScalarSP<T>(string cmdTxt, DynamicParameters parameter = null, Logger logger = null)
        {
            using (SqlConnection conn = new SqlConnection(CONNECTIONSTRING))
            {
                if (logger != null) logger.LogInfo("ExecuteScalarSP = " + cmdTxt + " | " + this.DynamicParametersToString(parameter));
                var res = SqlMapper.ExecuteScalar<T>(conn, cmdTxt, parameter, null, 180, System.Data.CommandType.StoredProcedure);
                if (logger != null) logger.LogInfo("ExecuteScalarSP OK");
                return res;
            }
        }

        protected int ExecuteNonQuery(string cmdTxt, DynamicParameters parameter = null, Logger logger = null)
        {
            using (SqlConnection conn = new SqlConnection(CONNECTIONSTRING))
            {
                if (logger != null) logger.LogInfo("ExecuteNonQuery = " + cmdTxt + " | " + this.DynamicParametersToString(parameter));
                var res = SqlMapper.Execute(conn, cmdTxt, parameter, null, 180);
                if (logger != null) logger.LogInfo("ExecuteNonQuery OK");
                return res;
            }
        }
        protected int ExecuteNonQuerySP(string cmdTxt, DynamicParameters parameter = null, Logger logger = null)
        {
            using (SqlConnection conn = new SqlConnection(CONNECTIONSTRING))
            {
                if (logger != null) logger.LogInfo("ExecuteNonQuerySP = " + cmdTxt + " | " + this.DynamicParametersToString(parameter));
                var res = SqlMapper.Execute(conn, cmdTxt, parameter, null, 180, System.Data.CommandType.StoredProcedure);
                if (logger != null) logger.LogInfo("ExecuteNonQuerySP OK");
                return res;
            }
        }

        protected IEnumerable<T> Query<T>(string cmdTxt, DynamicParameters parameter = null, Logger logger = null)
        {
            using (SqlConnection conn = new SqlConnection(CONNECTIONSTRING))
            {
                if (logger != null) logger.LogInfo("Query = " + cmdTxt + " | " + this.DynamicParametersToString(parameter));
                var res = SqlMapper.Query<T>(conn, cmdTxt, parameter, null, true, 180);
                if (logger != null) logger.LogInfo("Query OK");
                return res;
            }
        }
        protected IEnumerable<T> QuerySP<T>(string spName, DynamicParameters parameter = null, Logger logger = null)
        {
            using (SqlConnection conn = new SqlConnection(CONNECTIONSTRING))
            {
                if (logger != null) logger.LogInfo("QuerySP = " + spName + " | " + this.DynamicParametersToString(parameter));
                var res = SqlMapper.Query<T>(conn, spName, parameter, null, true, 180, System.Data.CommandType.StoredProcedure);
                if (logger != null) logger.LogInfo("QuerySP OK");
                return res;
            }
        }
        protected IEnumerable<T> QuerySP<T>(SqlTransaction transaction,string spName, DynamicParameters parameter = null, Logger logger = null)
        {
            if (transaction == null)
            {
                return QuerySP<T>(spName, parameter, logger);
            }
            if (logger != null) logger.LogInfo("QuerySP = " + spName + " | " + this.DynamicParametersToString(parameter));
            var res = transaction.Connection.Query<T>(spName, parameter, transaction, true, 180, System.Data.CommandType.StoredProcedure);
            if (logger != null) logger.LogInfo("QuerySP OK");
            return res;
        }

        // Transaction Rollback
        protected T ExecuteScalar<T>(SqlTransaction transaction, string cmdTxt, DynamicParameters parameter = null, Logger logger = null)
        {
            if(transaction == null)
            {
                return ExecuteScalar<T>(cmdTxt, parameter, logger);
            }
            if (logger != null) logger.LogInfo("ExecuteScalar = " + cmdTxt + " | " + this.DynamicParametersToString(parameter));
            //CommandDefinition comm = new CommandDefinition(cmdTxt, parameter, transaction);
            var res = SqlMapper.ExecuteScalar<T>(transaction.Connection, cmdTxt, parameter, transaction, 180);
            if (logger != null) logger.LogInfo("ExecuteScalar OK");
            return res;
        }
        protected T ExecuteScalarSP<T>(SqlTransaction transaction, string spName, DynamicParameters parameter = null, Logger logger = null)
        {
            if (transaction == null)
            {
                return ExecuteScalarSP<T>(spName, parameter, logger);
            }
            if (logger != null) logger.LogInfo("ExecuteScalarSP = " + spName + " | " + this.DynamicParametersToString(parameter));
            var res = transaction.Connection.ExecuteScalar<T>(spName, parameter, transaction, 100, System.Data.CommandType.StoredProcedure);
            if (logger != null) logger.LogInfo("ExecuteScalarSP OK");
            return res;
        }
        protected int ExecuteNonQuery(SqlTransaction transaction, string cmdTxt, DynamicParameters parameter = null, Logger logger = null)
        {
            if (transaction == null)
            {
                return ExecuteNonQuery(cmdTxt, parameter, logger);
            }
            if (logger != null) logger.LogInfo("ExecuteNonQuery = " + cmdTxt + " | " + this.DynamicParametersToString(parameter));
            //CommandDefinition comm = new CommandDefinition(cmdTxt, parameter, transaction);
            var res = SqlMapper.Execute(transaction.Connection, cmdTxt, parameter, transaction, 180);
            if (logger != null) logger.LogInfo("ExecuteNonQuery OK");
            return res;
        }
        protected IEnumerable<T> Query<T>(SqlTransaction transaction, string cmdTxt, DynamicParameters parameter = null, Logger logger = null)
        {
            if (transaction == null)
            {
                return Query<T>(cmdTxt, parameter, logger);
            }
            if (logger != null) logger.LogInfo("Query = " + cmdTxt + " | " + this.DynamicParametersToString(parameter));
            //CommandDefinition comm = new CommandDefinition(cmdTxt, parameter, transaction);
            var res = SqlMapper.Query<T>(transaction.Connection, cmdTxt, parameter, transaction, true, 180);
            if (logger != null) logger.LogInfo("Query OK");
            return res;
        }

        public static SqlConnection OpenConnection()
        {
            SqlConnection conn = new SqlConnection(CONNECTIONSTRING);
            return conn;
        }
        public static SqlTransaction BeginTransaction()
        {
            var conn = OpenConnection();
            conn.Open();
            return conn.BeginTransaction();
        }
    }
}
