using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;

namespace PawnShop.Server.Entities
{
    public class Item
    {
        [BsonId]
        [BsonElement("_id"), BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }

        [BsonElement("description"), BsonRepresentation(BsonType.String)]
        public required string ItemDescription { get; set; }

        [BsonElement("price"), BsonRepresentation(BsonType.Double)]
        public required double price { get; set; }

        [BsonElement("category"), BsonRepresentation(BsonType.String)]
        public required string Category { get; set; }

        [BsonElement("image")]
        public byte[]? Image { get; set; }
    }
}
