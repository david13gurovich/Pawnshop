using MongoDB.Driver;
using PawnShop.Server.Data;
using PawnShop.Server.Entities;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;

namespace PawnShop.Server.Services
{
    public class ItemService
    {
        private readonly IMongoCollection<Item> _items;

        public ItemService(MongoDBService mongoDBService)
        {
            _items = mongoDBService.Database.GetCollection<Item>(mongoDBService.ItemsCollectionName);
        }

        public async Task<IEnumerable<Item>> GetAsync() =>
            await _items.Find(FilterDefinition<Item>.Empty).ToListAsync();

        public async Task<Item?> GetByIdAsync(string id) =>
            await _items.Find(x => x.Id == id).FirstOrDefaultAsync();

        public async Task<IEnumerable<Item>> GetItemsByCategoriesAsync(List<string> categories) =>
            await _items.Find(Builders<Item>.Filter.In(x => x.Category, categories)).ToListAsync();

        public async Task<IEnumerable<string>> GetAllCategoriesAsync() =>
            await _items.Distinct<string>("category", FilterDefinition<Item>.Empty).ToListAsync();

        public async Task<bool> DeleteAsync(string id)
        {
            var result = await _items.DeleteOneAsync(x => x.Id == id);
            return result.DeletedCount > 0;
        }

        public async Task<Item> CreateAsync(string itemDescription, double price, string category, IFormFile? image)
        {
            byte[]? imageData = null;
            if (image != null && image.Length > 0)
            {
                using (var ms = new MemoryStream())
                {
                    await image.CopyToAsync(ms);
                    imageData = ms.ToArray();
                }
            }

            var item = new Item
            {
                ItemDescription = itemDescription,
                price = price * 1.15,
                Category = category,
                Image = imageData
            };

            await _items.InsertOneAsync(item);
            return item;
        }
    }
}
