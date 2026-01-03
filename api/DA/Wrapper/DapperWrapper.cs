using Abstracciones.Interfaces.DA;
using Dapper;
using System.Data;
using System.Data.Common;
using System.Linq;

namespace DA.Wrappers
{
    public class DapperWrapper : IDapperWrapper
    {
        public async Task<IEnumerable<T>> QueryAsync<T>(
            IDbConnection connection,
            string sql,
            object? param = null,
            IDbTransaction? transaction = null,
            int? commandTimeout = null,
            CommandType? commandType = null)
        {
            await EnsureOpenAsync(connection);
            var result = await connection.QueryAsync<T>(sql, param, transaction, commandTimeout, commandType);
            return result.ToList();
        }

        public async Task<T?> QueryFirstOrDefaultAsync<T>(
            IDbConnection connection,
            string sql,
            object? param = null,
            IDbTransaction? transaction = null,
            int? commandTimeout = null,
            CommandType? commandType = null)
        {
            await EnsureOpenAsync(connection);
            return await connection.QueryFirstOrDefaultAsync<T>(sql, param, transaction, commandTimeout, commandType);
        }

        public async Task<T> ExecuteScalarAsync<T>(
            IDbConnection connection,
            string sql,
            object? param = null,
            IDbTransaction? transaction = null,
            int? commandTimeout = null,
            CommandType? commandType = null)
        {
            await EnsureOpenAsync(connection);
            var result = await connection.ExecuteScalarAsync<T>(sql, param, transaction, commandTimeout, commandType);
            return result ?? throw new InvalidOperationException("ExecuteScalarAsync returned null");
        }

        public async Task<int> ExecuteAsync(
            IDbConnection connection,
            string sql,
            object? param = null,
            IDbTransaction? transaction = null,
            int? commandTimeout = null,
            CommandType? commandType = null)
        {
            await EnsureOpenAsync(connection);
            return await connection.ExecuteAsync(sql, param, transaction, commandTimeout, commandType);
        }

        private static async Task EnsureOpenAsync(IDbConnection connection)
        {
            if (connection.State == ConnectionState.Open)
            {
                return;
            }

            if (connection is DbConnection dbConnection)
            {
                await dbConnection.OpenAsync();
            }
            else
            {
                connection.Open();
            }
        }
    }
}
