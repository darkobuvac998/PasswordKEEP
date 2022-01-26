using AutoMapper;
using Entities.DataTransferObjects;
using Entities.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PasswordKEEP.AutoMapperMappings
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Application, ApplicationDto>();
            CreateMap<UserForRegistrationDto, User>();
            CreateMap<ApplicationForCreationDto, Application>();
            CreateMap<Account, AccountDto>().ReverseMap();
        }
    }
}
