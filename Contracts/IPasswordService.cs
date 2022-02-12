using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Contracts
{
    public interface IPasswordService
    {
        public string Encrypt(string plainText);
        public string Decrypt(string hashedText);
        public string GeneratePassword(int length = 8);
    }
}
