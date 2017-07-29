using EnergyDataProvider.Providers;
using EnergyDataProvider.Models;
using EnergyDataProvider.Mappings;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using EnergyStatisticsAPI.Models;

namespace EnergyStatisticsAPI.Controllers
{
	[RoutePrefix("energy")]
	public class EnergyController : ApiController
	{
		EnergyController()
		{
			string path = System.Web.HttpContext.Current.Server.MapPath("../Content/solar-hot-water.csv");
			new SolarHotWaterInstallationsService(path);
		}

		[HttpGet]
		public List<SolarHotWaterInstallationsPerPostCode> Get()
		{
			return SolarHotWaterInstallationsService.SolarHotWaterInstallations.GroupBy(x => x.Postcode).Select(group => new SolarHotWaterInstallationsPerPostCode
			 {
				Postcode = group.Key,
				Count = group.Count()
			}).OrderBy(x => x.Postcode).ToList();
		}
	}
}
