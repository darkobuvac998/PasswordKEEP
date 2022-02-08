using AutoMapper;
using Contracts;
using Entities.DataTransferObjects;
using Entities.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using PasswordKEEP.Filters;
using Serilog;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PasswordKEEP.Controllers
{
    [Route("api/authentication")]
    [ApiController]
    [Authorize]
    public class AuthenticationController : ControllerBase
    {
        private readonly ILogger _logger;
        private readonly UserManager<User> _userManager;
        private readonly IMapper _mapper;
        private readonly IAuthenticationManager _authManager;

        public AuthenticationController(ILogger logger, UserManager<User> userManager, IMapper mapper, IAuthenticationManager authenticationManager)
        {
            _logger = logger;
            _userManager = userManager;
            _mapper = mapper;
            _authManager = authenticationManager;
        }

        [AllowAnonymous]
        [HttpPost("register-user")]
        public async Task<IActionResult> RegisterUser([FromBody] UserForRegistrationDto userDto)
        {
            var user = _mapper.Map<User>(userDto);

            var result = await _userManager.CreateAsync(user, userDto.Password);

            if (!result.Succeeded)
            {
                foreach (var err in result.Errors)
                {
                    ModelState.TryAddModelError(err.Code, err.Description);
                }
                return BadRequest(modelState: ModelState);
            }

            await _userManager.AddToRolesAsync(user, userDto.Roles);

            return StatusCode(201);
        }
        
        [AllowAnonymous]
        [HttpPost("log-in")]
        [DtoValidation]
        public async Task<IActionResult> Authenticate([FromBody] UserForAuthenticationDto user)
        {
            if(!await _authManager.ValidateUser(user))
            {
                return Unauthorized();
            }

            return Ok(new { Token = await _authManager.CreateToken() });
        }

        [HttpGet("user/{userName}")]
        public async Task<IActionResult> GetLoggedInUser(string userName)
        {
            var user = await _authManager.GetUser(userName);
            if(user != null)
            {
                return Ok(user);
            }
            else
            {
                return NoContent();
            }
        }

        [HttpPut("user/{userName}")]
        [DtoValidation]
        public async Task<IActionResult> UpdateUser(string userName,[FromBody] UserForRegistrationDto userDto)
        {
            var result = await _authManager.UpdateUser(userName, userDto);
            if(result != null)
            {
                return Ok(result);
            }
            return BadRequest();
        }
    }
}
