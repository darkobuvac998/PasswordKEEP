using Contracts;
using Serilog;
using System;
using System.Collections.Generic;
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
            byte[] toEncryptedArray = Encoding.UTF8.GetBytes(plainText);

            MD5CryptoServiceProvider provider = new MD5CryptoServiceProvider();
            byte[] securityKeyArray = provider.ComputeHash(Encoding.UTF8.GetBytes(_secretKey));
            provider.Clear();

            var objTripleDESCryptoService = new TripleDESCryptoServiceProvider();
            objTripleDESCryptoService.Key = securityKeyArray;
            objTripleDESCryptoService.Mode = CipherMode.ECB;
            objTripleDESCryptoService.Padding = PaddingMode.PKCS7;

            var objCryptoTransform = objTripleDESCryptoService.CreateEncryptor();

            byte[] resultArray = objCryptoTransform.TransformFinalBlock(toEncryptedArray, 0, toEncryptedArray.Length);
            objTripleDESCryptoService.Clear();

            return Convert.ToBase64String(resultArray, 0, resultArray.Length)?.Trim();
        }

        public string Decrypt(string hashedText)
        {
            byte[] toEncryptedArray = Encoding.UTF8.GetBytes(hashedText?.Trim());

            MD5CryptoServiceProvider provider = new MD5CryptoServiceProvider();
            byte[] securityKeyArray = provider.ComputeHash(Encoding.UTF8.GetBytes(_secretKey));
            provider.Clear();

            var objTripleDESCryptoService = new TripleDESCryptoServiceProvider();
            objTripleDESCryptoService.Key = securityKeyArray;
            objTripleDESCryptoService.Mode = CipherMode.ECB;
            objTripleDESCryptoService.Padding = PaddingMode.PKCS7;

            var objCryptoTransform = objTripleDESCryptoService.CreateDecryptor();

            byte[] resultArray = objCryptoTransform.TransformFinalBlock(toEncryptedArray, 0, toEncryptedArray.Length);
            objTripleDESCryptoService.Clear();

            return Encoding.UTF8.GetString(resultArray);
        }
    }
}
