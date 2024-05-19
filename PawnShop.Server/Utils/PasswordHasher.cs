using System;
using System.Security.Cryptography;
using System.Text;

namespace PawnShop.Server.Utils
{
    public static class PasswordHasher
    {
        public static string HashPassword(string password, out string salt)
        {
            // Generate a salt
            salt = GenerateSalt();

            // Combine password and salt
            var saltedPassword = password + salt;

            // Hash the salted password using SHA-256
            using (var sha256 = SHA256.Create())
            {
                var hashBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(saltedPassword));
                return Convert.ToHexString(hashBytes);
            }
        }

        public static bool VerifyPassword(string password, string salt, string hash)
        {
            // Combine password and salt
            var saltedPassword = password + salt;

            // Hash the salted password using SHA-256
            using (var sha256 = SHA256.Create())
            {
                var hashBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(saltedPassword));
                var computedHash = Convert.ToHexString(hashBytes);
                return computedHash == hash;
            }
        }

        private static string GenerateSalt()
        {
            // Generate a cryptographic random number
            var saltBytes = new byte[16];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(saltBytes);
            }
            return Convert.ToHexString(saltBytes);
        }
    }
}
