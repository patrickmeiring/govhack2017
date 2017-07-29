using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace EnergyStatisticsAPI.Controllers
{
	[RoutePrefix("energy")]
	public class EnergyController : ApiController
	{	
		[HttpGet]
		public List<String> Get()
		{
			return new List<string>() { "Test1", "Test2" };
		}
	}
}
