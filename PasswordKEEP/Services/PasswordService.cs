using Contracts;
using Serilog;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace PasswordKEEP.Services
{
    public class PasswordService : IPasswordService
    {
        private string _secretKey;
        public PasswordService()
        {
            _secretKey = Environment.GetEnvironmentVariable("PasswordKEEPSecret").Trim().ToLower();
        }

        public string Encrypt(string plainText)
        {
            {
                byte[] initVectorBytes = Encoding.UTF8.GetBytes(_secretKey);
                byte[] plainTextBytes = Encoding.UTF8.GetBytes(plainText);
                PasswordDeriveBytes password = new PasswordDeriveBytes(_secretKey, null);
                byte[] keyBytes = password.GetBytes(256 / 8);
                RijndaelManaged symmetricKey = new RijndaelManaged();
                symmetricKey.Mode = CipherMode.CBC;
                symmetricKey.Padding = PaddingMode.PKCS7;
                ICryptoTransform encryptor = symmetricKey.CreateEncryptor(keyBytes, initVectorBytes);
                MemoryStream memoryStream = new MemoryStream();
                CryptoStream cryptoStream = new CryptoStream(memoryStream, encryptor, CryptoStreamMode.Write);
                cryptoStream.Write(plainTextBytes, 0, plainTextBytes.Length);
                cryptoStream.FlushFinalBlock();
                byte[] cipherTextBytes = memoryStream.ToArray();
                memoryStream.Close();
                cryptoStream.Close();
                string cipherText = Convert.ToBase64String(cipherTextBytes);
                return cipherText;
            }
        }

        public string Decrypt(string hashedText)
        {
            byte[] initVectorBytes = Encoding.UTF8.GetBytes(_secretKey);
            byte[] cipherTextBytes = Convert.FromBase64String(hashedText);
            PasswordDeriveBytes password = new PasswordDeriveBytes(_secretKey, null);
            byte[] keyBytes = password.GetBytes(256 / 8);
            RijndaelManaged symmetricKey = new RijndaelManaged();
            symmetricKey.Mode = CipherMode.CBC;
            symmetricKey.Padding = PaddingMode.PKCS7;
            ICryptoTransform decryptor = symmetricKey.CreateDecryptor(keyBytes, initVectorBytes);
            MemoryStream memoryStream = new MemoryStream(cipherTextBytes);
            CryptoStream cryptoStream = new CryptoStream(memoryStream, decryptor, CryptoStreamMode.Read);
            byte[] plainTextBytes = new byte[cipherTextBytes.Length];
            int decryptedByteCount = cryptoStream.Read(plainTextBytes, 0, plainTextBytes.Length);
            memoryStream.Close();
            cryptoStream.Close();
            string plainText = Encoding.UTF8.GetString(plainTextBytes, 0, decryptedByteCount);
            return plainText;
        }

        public string GeneratePassword(int length = 8)
        {
            var characters = "ABCDEFGHJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*?_-";

            Random random = new Random();

            char[] chars = new char[length];

            for(int i=0; i<length; i++)
            {
                chars[i] = characters[random.Next(0, characters.Length)];
            }

            return new string(chars);
        }
    }
}
