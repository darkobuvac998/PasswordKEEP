using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entities.DataTransferObjects
{
    public class ApplicationForCreationDto
    {
        [Required(ErrorMessage = "Applicaiton name is required!")]
        public string Name { get; set; }
        [MaxLength(256)]
        public string Url { get; set; }
    }
}
