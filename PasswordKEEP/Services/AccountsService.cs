using AutoMapper;
using Contracts;
using Entities.DataTransferObjects;
using Entities.Models;
using Serilog;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PasswordKEEP.Services
{
    public class AccountsService : IAccountsService
    {
        private readonly IPasswordService _passwordService;
        private readonly IRepositoryManager _repositoryManager;
        private readonly IMapper _mapper;
        private readonly ILogger _logger;

        public AccountsService(IRepositoryManager repositoryManager, IPasswordService passwordService, IMapper mapper, ILogger logger)
        {
            _repositoryManager = repositoryManager;
            _passwordService = passwordService;
            _mapper = mapper;
            _logger = logger;
        }

        public async Task<AccountDto> CreateAccountForApplication(Guid applicationId, AccountForCreationDto accountDto)
        {
            var app = await _repositoryManager.Application.FindApplicationAsync(applicationId, false);
            if (app != null)
            {
                var account = _mapper.Map<Account>(accountDto);
                account.ApplicationId = app.Id;
                account.LastModified = DateTime.Now;
                account.Password = _passwordService.Encrypt(account.Password);
                _repositoryManager.Account.Create(account);
                await _repositoryManager.SaveAsync();
                var appDto = _mapper.Map<AccountDto>(account);
                return appDto;
            }
            else
            {
                _logger.Error($"Application with id: {applicationId} doesn't exit in database.");
                return null;
            }
        }

        public async Task<AccountDto> GetAccountByIdForApplication(Guid applicationId, Guid accountId, bool trackChanges)
        {
            var account = await _repositoryManager.Account.FindByConditionAsync(acc => acc.ApplicationId == applicationId && acc.Id == accountId, trackChanges);
            var accEntity = account.FirstOrDefault();
            accEntity.Password = _passwordService.Decrypt(accEntity.Password);
            var accountDto = _mapper.Map<AccountDto>(accEntity);

            return accountDto;
        }

        public async Task<IEnumerable<AccountDto>> GetAccountsForApplicationAsync(Guid applicationId)
        {
            var accounts = await _repositoryManager.Account.FindByConditionAsync(acc => acc.ApplicationId == applicationId, false);
            foreach (var account in accounts)
            {
                account.Password = _passwordService.Decrypt(account.Password);
            }
            var accountsDto = _mapper.Map<IEnumerable<AccountDto>>(accounts);

            return accountsDto;
        }

        public async Task UpdateAccountForApplication(Guid applicationId, Guid id, AccountForCreationDto accountDto)
        {
            var acc = await _repositoryManager.Account.GetAccountById(applicationId, id, tracking: true);
            if (acc != null)
            {
                _mapper.Map(accountDto, acc);
                await _repositoryManager.SaveAsync();
            }
        }
    }
}
