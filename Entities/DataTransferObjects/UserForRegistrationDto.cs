using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entities.DataTransferObjects
{
    public class UserForRegistrationDto
    {
        [Required(ErrorMessage = "First name is required field.")]
        public string FirstName { get; set; }
        [Required(ErrorMessage = "Last name is required field.")]
        public string LastName { get; set; }
        [Required(ErrorMessage = "User name is required field.")]
        public string UserName { get; set; }
        [Required(ErrorMessage = "Password is required field.")]
        public string Password { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public ICollection<string> Roles { get; set; }
    }
}
