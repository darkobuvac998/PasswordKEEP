using System;

namespace Entities.DataTransferObjects
{
    public class AccountDto
    {
        public Guid Id { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public Guid ApplicationId { get; set; }
        public DateTime LastModified { get; set; }
    }
}
