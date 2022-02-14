using AutoMapper;
using Contracts;
using Entities.DataTransferObjects;
using Entities.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using PasswordKEEP.Filters;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace PasswordKEEP
{
    public class AuthenticationManager : IAuthenticationManager
    {

        private readonly UserManager<User> _userManager;
        private readonly IConfiguration _configuration;
        private readonly IMapper _mapper;

        private User _user;

        public AuthenticationManager(UserManager<User> userManager, IConfiguration configuration, IMapper mapper)
        {
            _userManager = userManager;
            _configuration = configuration;
            _mapper = mapper;
        }
        public async Task<bool> ValidateUser(UserForAuthenticationDto user)
        {
            _user = await _userManager.FindByNameAsync(user.Username);

            return (_user != null && await _userManager.CheckPasswordAsync(_user, user.Password));
        }

        public async Task<UserDto> GetUser(string userName)
        {
            var user = await _userManager.FindByNameAsync(userName);
            var userDto = _mapper.Map<UserDto>(user);
            return userDto;
        }

        public async Task<string> CreateToken()
        {
            var signingCredentials = GetSigningCredentials();
            var claims = await GetClaims();
            var tokenOptions = GenerateTokenOptions(signingCredentials, claims);

            return new JwtSecurityTokenHandler().WriteToken(token: tokenOptions);
        }

        private SigningCredentials GetSigningCredentials()
        {
            var key = Encoding.UTF8.GetBytes(Environment.GetEnvironmentVariable("PasswordKEEPSecret"));
            var secret = new SymmetricSecurityKey(key);

            return new SigningCredentials(secret, SecurityAlgorithms.HmacSha256);
        }

        private async Task<List<Claim>> GetClaims()
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, _user.UserName),
                new Claim(ClaimTypes.NameIdentifier, _user.Id),
                new Claim(ClaimTypes.Email, _user.Email)
            };

            var roles = await _userManager.GetRolesAsync(_user);
            foreach (var role in roles)
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
            }

            return claims;
        }

        private JwtSecurityToken GenerateTokenOptions(SigningCredentials signingCredentials, List<Claim> claims)
        {
            var jwtSettings = _configuration.GetSection("JwtSettings");

            var tokenOptions = new JwtSecurityToken(
                issuer: jwtSettings.GetSection("validIssuer").Value,
                audience: jwtSettings.GetSection("validAudience").Value,
                claims: claims,
                signingCredentials: signingCredentials,
                expires: DateTime.Now.AddMinutes(Convert.ToDouble(jwtSettings.GetSection("expires").Value)));

            return tokenOptions;
        }

        public async Task<UserDto> UpdateUser(string userName, UserForRegistrationDto userDto)
        {
            var user = await _userManager.FindByNameAsync(userName);
            if (user != null && await _userManager.CheckPasswordAsync(user, userDto.Password))
            {

                _mapper.Map(userDto, user);
                var result = await _userManager.UpdateAsync(user);
                if (result.Succeeded)
                {
                    var userResult = _mapper.Map<UserDto>(user);
                    return userResult;
                }
            }
            return null;
        }

        public async Task<bool> DeleteUser(string userName)
        {
            var user = await _userManager.FindByNameAsync(userName);
            if(user != null)
            {
                var result = await _userManager.DeleteAsync(user);
                if (result.Succeeded)
                {
                    return true;
                }
                else
                {
                    return false;
                }
            }
            return false;
        }

        public async Task<IdentityResult> ChangePasswordAsync(PasswordChangeDto passwordChangeDto)
        {
            var user = await _userManager.FindByNameAsync(passwordChangeDto.UserName);
            
            if(user != null && await _userManager.CheckPasswordAsync(user, passwordChangeDto.CurrentPassword))
            {
                var result = await _userManager.ChangePasswordAsync(user, passwordChangeDto.CurrentPassword, passwordChangeDto.NewPassword);
                return result;
            }
            else
            {
                return null;
            }
        }

        public async Task<IEnumerable<UserDto>> GetUsers()
        {
            var users = await _userManager.GetUsersInRoleAsync("User");
            var usersDto = _mapper.Map<IEnumerable<UserDto>>(users);
            return usersDto;
        }
    }
}
