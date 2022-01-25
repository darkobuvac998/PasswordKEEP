using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entities.Models
{
    public class Application
    {
        [Column(name: "ApplicationId")]
        public Guid Id { get; set; }
        [Required(ErrorMessage = "Application name is required")]
        [MaxLength(40, ErrorMessage = "Maximum length for application name is 40 characters.")]
        public string Name { get; set; }
        [MaxLength(256, ErrorMessage = "Maximum length for url is 256 characters.")]
        public string Url { get; set; }

        public ICollection<Account> Accounts;

        [ForeignKey(nameof(User))]
        public string UserId { get; set; }
        public User User { get; set; }
    }
}
