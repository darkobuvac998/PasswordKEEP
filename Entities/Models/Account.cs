using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entities.Models
{
    public class Account
    {
        [Column("AccountId")]
        public Guid Id { get; set; }
        [Required(ErrorMessage = "Username is required for accont.")]
        public string Username { get; set; }
        [Required(ErrorMessage = "Password is required")]
        public string Password { get; set; }
        public DateTime LastModified { get; set; }

        [ForeignKey(nameof(Application))]
        public Guid ApplicationId { get; set; }
        public Application Application { get; set; }

        public ICollection<AccountHistory> AccountHistories { get; set; }
    }
}
