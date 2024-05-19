using Microsoft.Extensions.Configuration;
using MongoDB.Driver;

namespace PawnShop.Server.Data
{
    public class MongoDBService
    {
        public IMongoDatabase Database { get; }
        public string UsersCollectionName { get; }
        public string ItemsCollectionName { get; }

        public MongoDBService(IConfiguration configuration)
        {
            var connectionString = configuration.GetSection("DatabaseSettings:ConnectionString").Value;
            var databaseName = configuration.GetSection("DatabaseSettings:DatabaseName").Value;
            UsersCollectionName = configuration.GetSection("DatabaseSettings:Collections:Users").Value;
            ItemsCollectionName = configuration.GetSection("DatabaseSettings:Collections:Items").Value;

            var client = new MongoClient(connectionString);
            Database = client.GetDatabase(databaseName);
        }
    }
}
