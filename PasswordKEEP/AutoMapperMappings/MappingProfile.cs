using AutoMapper;
using Entities.DataTransferObjects;
using Entities.Models;

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
            CreateMap<AccountForCreationDto, Account>();
            CreateMap<User, UserDto>();

        }
    }
}
