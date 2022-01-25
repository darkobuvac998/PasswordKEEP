using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entities.Models
{
    public class AccountHistory
    {
        [Column("AccountHistoryId")]
        [Key]
        public Guid Id { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public DateTime VersionFrom { get; set; }
        public DateTime VersionTo { get; set; }
        [ForeignKey(nameof(Account))]
        public Guid AccountId { get; set; }
        public Account Account { get; set; }
    }
}
