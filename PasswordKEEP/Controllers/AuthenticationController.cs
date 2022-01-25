using AutoMapper;
using Entities.DataTransferObjects;
using Entities.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Serilog;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PasswordKEEP.Controllers
{
    [Route("api/authentication")]
    [ApiController]
    public class AuthenticationController : ControllerBase
    {
        private readonly ILogger _logger;
        private readonly UserManager<User> _userManager;
        private readonly IMapper _mapper;

        public AuthenticationController(ILogger logger, UserManager<User> userManager, IMapper mapper)
        {
            _logger = logger;
            _userManager = userManager;
            _mapper = mapper;
        }

        [HttpPost]
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
    }
}
