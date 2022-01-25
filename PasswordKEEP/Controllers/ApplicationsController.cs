using AutoMapper;
using Contracts;
using Entities.DataTransferObjects;
using Entities.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using PasswordKEEP.Filters;
using Serilog;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PasswordKEEP.Controllers
{
    [Route("api/{userId}/applications")]
    [ApiController]
    public class ApplicationsController : ControllerBase
    {
        private readonly IRepositoryManager _repositoryManager;
        private readonly ILogger _logger;
        private readonly IMapper _mapper;

        public ApplicationsController(IRepositoryManager repositoryManager, IMapper mapper, ILogger logger)
        {
            _repositoryManager = repositoryManager;
            _mapper = mapper;
            _logger = logger;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllApplications(string userId)
        {
            var applications = await _repositoryManager.Application.FindByConditionAsync(app => app.UserId == userId, false);
            _logger.Information(JsonConvert.SerializeObject(applications).ToString());

            if (applications == null)
            {
                return NotFound();
            }

            var applicationDto = _mapper.Map<IEnumerable<ApplicationDto>>(applications);

            return Ok(applicationDto);
        }
        [HttpGet("{id}", Name = "GetApplicationById")]
        [EnsureApplicationExists]
        public IActionResult GetApplicationById(Guid id)
        {
            var app = HttpContext.Items["Application"];
            var appDto = _mapper.Map<ApplicationDto>(app);
            return Ok(appDto);
        }

        [HttpPost]
        public async Task<IActionResult> AddApplication(string userId, [FromBody] ApplicationForCreationDto appDto)
        {
            var app = _mapper.Map<Application>(appDto);

            _repositoryManager.Application.CreateApplication(userId, app);

            await _repositoryManager.SaveAsync();

            var appToReturn = _mapper.Map<ApplicationDto>(app);

            return CreatedAtRoute("GetApplicationById", new { id = app.Id }, appToReturn);
        }
    }
}
