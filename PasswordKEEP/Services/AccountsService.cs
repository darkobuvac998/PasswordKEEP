using AutoMapper;
using Contracts;
using Entities.DataTransferObjects;
using Entities.Models;
using Entities.ResultModel;
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

        public async Task<ServiceResult<AccountDto>> CreateAccountForApplication(Guid applicationId, AccountForCreationDto accountDto)
        {
            var app = await _repositoryManager.Application.FindApplicationAsync(applicationId, false);
            if (app != null)
            {
                var account = _mapper.Map<Account>(accountDto);
                account.ApplicationId = app.Id;
                account.LastModified = DateTime.Now;
                if (accountDto.GeneratePassword == true)
                {
                    var password = _passwordService.GeneratePassword(accountDto.PasswordLength);
                    account.Password = password;
                }
                account.Password = _passwordService.Encrypt(account.Password);
                _repositoryManager.Account.Create(account);
                await _repositoryManager.SaveAsync();
                account.Password = _passwordService.Decrypt(account.Password);
                var appDto = _mapper.Map<AccountDto>(account);
                return new ServiceResult<AccountDto> { Succeded = true, Result = appDto };
            }
            else
            {
                _logger.Error($"Application with id: {applicationId} doesn't exit in database.");
                return new ServiceResult<AccountDto> { Succeded = false, Result = null };
            }
        }

        public async Task DeleteAccountForApplication(Guid applicationId, Guid id)
        {
            var account = await _repositoryManager.Account.GetAccountById(applicationId, id, true);
            if (account != null)
            {
                _repositoryManager.Account.Delete(account);
                return;
            }
            else
            { return; }
        }

        public async Task DeleteAccountForApplication(Account account)
        {
            if (account != null)
            {
                _repositoryManager.Account.Delete(account);
                await _repositoryManager.SaveAsync();
                return;
            }
        }

        public async Task<ServiceResult<AccountDto>> GetAccountByIdForApplication(Guid applicationId, Guid accountId, bool trackChanges)
        {
            var account = await _repositoryManager.Account.FindByConditionAsync(acc => acc.ApplicationId == applicationId && acc.Id == accountId, trackChanges);
            var accEntity = account.FirstOrDefault();
            accEntity.Password = _passwordService.Decrypt(accEntity.Password);
            var accountDto = _mapper.Map<AccountDto>(accEntity);

            return new ServiceResult<AccountDto> { Succeded = true, Result = accountDto };
        }

        public async Task<ServiceResult<IEnumerable<AccountDto>>> GetAccountsForApplicationAsync(Guid applicationId)
        {
            var accounts = await _repositoryManager.Account.FindByConditionAsync(acc => acc.ApplicationId == applicationId, false);
            foreach (var account in accounts)
            {
                account.Password = _passwordService.Decrypt(account.Password);
            }
            var accountsDto = _mapper.Map<IEnumerable<AccountDto>>(accounts);

            return new ServiceResult<IEnumerable<AccountDto>> { Succeded = true, Result = accountsDto };
        }

        public async Task<ServiceResult<AccountDto>> UpdateAccountForApplication(Guid applicationId, Guid id, AccountForCreationDto accountDto)
        {
            var acc = await _repositoryManager.Account.GetAccountById(applicationId, id, tracking: true);
            if (acc != null)
            {
                _mapper.Map(accountDto, acc);
                acc.Password = _passwordService.Encrypt(acc.Password);
                acc.LastModified = DateTime.Now;
                await _repositoryManager.SaveAsync();
                acc.Password = _passwordService.Decrypt(acc.Password);

                var accountToReturn = _mapper.Map<AccountDto>(acc);
                return new ServiceResult<AccountDto> { Succeded = true, Result = accountToReturn };
            }
            else
            {
                return new ServiceResult<AccountDto> { Succeded = false, Result = null };
            }
        }
    }
}
