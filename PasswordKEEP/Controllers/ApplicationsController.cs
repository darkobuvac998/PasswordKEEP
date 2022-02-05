using AutoMapper;
using Contracts;
using Entities.DataTransferObjects;
using Entities.Models;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PasswordKEEP.Filters;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace PasswordKEEP.Controllers
{
    [Route("api/{userId}/applications")]
    [ApiController]
    [EnableCors(PolicyName = "PasswordKEEPPolicy")]
    public class ApplicationsController : ControllerBase
    {
        private readonly IRepositoryManager _repositoryManager;
        private readonly IMapper _mapper;

        public ApplicationsController(IRepositoryManager repositoryManager, IMapper mapper)
        {
            _repositoryManager = repositoryManager;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllApplications(string userId)
        {
            var applications = await _repositoryManager.Application.FindByConditionAsync(app => app.UserId == userId, false);
            if (applications == null)
            {
                return NotFound();
            }

            var applicationDto = _mapper.Map<IEnumerable<ApplicationDto>>(applications);

            return Ok(applicationDto);
        }
        [HttpGet("{id}", Name = "GetApplicationById")]
        [EnsureApplicationExists]
        public IActionResult GetApplicationById(string userId, Guid id)
        {
            var app = HttpContext.Items["Application"];
            var appDto = _mapper.Map<ApplicationDto>(app);
            return Ok(appDto);
        }

        [HttpPost]
        [DtoValidation]
        public async Task<IActionResult> AddApplication(string userId, [FromBody] ApplicationForCreationDto appDto)
        {
            var app = _mapper.Map<Application>(appDto);

            _repositoryManager.Application.CreateApplication(userId, app);

            await _repositoryManager.SaveAsync();

            var appToReturn = _mapper.Map<ApplicationDto>(app);

            return CreatedAtRoute("GetApplicationById", new { userId, appToReturn.Id }, appToReturn);
        }

        [HttpPut("{id}")]
        [DtoValidation]
        [EnsureApplicationExists]
        public async Task<IActionResult> UpdateApplication(string userId, Guid id, [FromBody] ApplicationForCreationDto appDto)
        {
            var app = HttpContext.Items["app"] as Application;
            _mapper.Map(appDto, app);
            await _repositoryManager.SaveAsync();

            var appForReturn = _mapper.Map<ApplicationDto>(app);

            return Ok(appForReturn);
        }

        [HttpDelete("{id}")]
        [EnsureApplicationExists]
        public async Task<IActionResult> DeleteApplication(string userId, Guid id)
        {
            var appEntity = HttpContext.Items["Application"] as Application;
            _repositoryManager.Application.Delete(appEntity);
            await _repositoryManager.SaveAsync();

            return NoContent();
        }


    }
}
