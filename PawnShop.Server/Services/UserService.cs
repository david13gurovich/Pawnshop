using MongoDB.Driver;
using PawnShop.Server.Data;
using PawnShop.Server.Entities;
using PawnShop.Server.Utils;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace PawnShop.Server.Services
{
    public class UserService
    {
        private readonly IMongoCollection<User> _users;

        public UserService(MongoDBService mongoDBService)
        {
            _users = mongoDBService.Database.GetCollection<User>(mongoDBService.UsersCollectionName);
        }

        public async Task<IEnumerable<User>> GetAsync() =>
            await _users.Find(FilterDefinition<User>.Empty).ToListAsync();

        public async Task<User?> GetByIdAsync(string id) =>
            await _users.Find(x => x.Id == id).FirstOrDefaultAsync();

        public async Task CreateAsync(User user, string password)
        {
            user.PasswordHash = PasswordHasher.HashPassword(password, out string salt);
            user.Salt = salt;
            await _users.InsertOneAsync(user);
        }

        public async Task<bool> UpdateAsync(User user)
        {
            var result = await _users.ReplaceOneAsync(x => x.Id == user.Id, user);
            return result.ModifiedCount > 0;
        }

        public async Task<bool> DeleteAsync(string id)
        {
            var result = await _users.DeleteOneAsync(x => x.Id == id);
            return result.DeletedCount > 0;
        }

        public async Task<User?> LoginAsync(string email, string password)
        {
            var user = await _users.Find(u => u.Email == email).FirstOrDefaultAsync();
            if (user != null && PasswordHasher.VerifyPassword(password, user.Salt, user.PasswordHash))
            {
                return user;
            }
            return null;
        }
    }
}
