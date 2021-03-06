using Entities.DataTransferObjects;
using Entities.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Contracts
{
    public interface IAuthenticationManager
    {
        Task<bool> ValidateUser(UserForAuthenticationDto user);
        Task<string> CreateToken();
        Task<UserDto> GetUser(string userName);
        Task<UserDto> UpdateUser(string userName, UserForRegistrationDto user);
    }
}
