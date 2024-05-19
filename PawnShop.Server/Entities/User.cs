using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace PawnShop.Server.Entities
{
    public class User
    {
        [BsonId]
        [BsonElement("_id"), BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        [BsonElement("user_name"), BsonRepresentation(BsonType.String)]

        public string? UserName { get; set; }

        [BsonElement("email"), BsonRepresentation(BsonType.String)]

        public string? Email { get; set; }

        [BsonElement("password_hash"), BsonRepresentation(BsonType.String)]
        public string PasswordHash { get; set; }

        [BsonElement("salt"), BsonRepresentation(BsonType.String)]
        public string Salt { get; set; }

        [BsonElement("balance"), BsonRepresentation(BsonType.Double)]
        public required double Balance { get; set; }



    }
}
