using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entities.DataTransferObjects
{
    public class AccountForCreationDto
    {
        [Required(ErrorMessage = "Username for account is required.")]
        public string Username { get; set; }
        [Required(ErrorMessage = "Password required")]
        public string Password { get; set; }
    }
}
