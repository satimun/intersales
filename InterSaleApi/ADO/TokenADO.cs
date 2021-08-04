using Dapper;
using InterSaleModel.Model.Entity;
using KKFCoreEngine.KKFLogger;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;

namespace InterSaleApi.ADO
{
    public class TokenADO : BaseADO
    {
        private static TokenADO instant;
        public static TokenADO GetInstant()
        {
            if (instant == null)
                instant = new TokenADO();
            return instant;
        }
        private TokenADO() { }

        public List<sxtToken> RequestToken(string username, string password, Logger logger = null)
        {
            string cmd = "exec SP_Token_RequestToken @username, @password";
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@username", username);
            param.Add("@password", password);
            
            return Query<sxtToken>(cmd, param, logger).ToList();
        }

        public List<sxtToken> DestroyToken(string token, Logger logger = null)
        {
            string cmd = "exec SP_Token_DestroyToken @token";
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@token", token);

            return Query<sxtToken>(cmd, param, logger).ToList();
        }

        public List<sxtToken> RenewToken(string token, string password, Logger logger = null)
        {
            string cmd = "exec SP_Token_RenewToken @token, @password";
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@token", token);
            param.Add("@password", password);

            return Query<sxtToken>(cmd, param, logger).ToList();
        }

        public List<sxtToken> GetTokenStatus(string token, Logger logger = null)
        {
            string cmd = "exec SP_Token_GetTokenStatus @token";
            Dapper.DynamicParameters param = new Dapper.DynamicParameters();
            param.Add("@token", token);

            return Query<sxtToken>(cmd, param, logger).ToList();
        }

        public sxtToken Get(string Code, SqlTransaction transac = null)
        {
            DynamicParameters param = new DynamicParameters();
            param.Add("@Code", Code);

            string cmd = "SELECT * FROM sxtToken " +
                "WHERE Code=@Code;";
            return Query<sxtToken>(transac, cmd, param).FirstOrDefault();
        }

        public int Save(sxtToken d, SqlTransaction transac = null)
        {
            var token = Get(d.Code, transac);
            if (token != null)
            {
                return Update(d);
            }
            return Insert(d, transac);
        }

        private int Update(sxtToken d, SqlTransaction transac = null)
        {
            DynamicParameters param = new DynamicParameters();
            param.Add("@Code", d.Code);
            param.Add("@ExpiryDate", d.ExpiryDate);
            param.Add("@Status", d.Status);
            param.Add("@ModifyBy", d.ModifyBy);

            string cmd = $"UPDATE sxtToken SET " +
                "ExpiryDate=@ExpiryDate, " +
                "Status=@Status, " +
                "ModifyBy=@ModifyBy, " +
                "ModifyDate=GETDATE() " +
                "WHERE Code=@Code" +
                ";";

            return ExecuteNonQuery(transac, cmd, param);
        }

        private int Insert(sxtToken d, SqlTransaction transac = null)
        {
            DynamicParameters param = new DynamicParameters();
            param.Add("@Code", d.Code);
            param.Add("@Employee_ID", d.Employee_ID);
            param.Add("@ExpiryDate", d.ExpiryDate);
            param.Add("@CreateBy", d.CreateBy);

            string cmd = "INSERT INTO sxtToken (Code, Employee_ID, ExpiryDate, Status, CreateBy, CreateDate) " +
                "VALUES (@Code, @Employee_ID, @ExpiryDate, 'A', @CreateBy, GETDATE());";

            return ExecuteNonQuery(transac, cmd, param);
        }

    }
}
