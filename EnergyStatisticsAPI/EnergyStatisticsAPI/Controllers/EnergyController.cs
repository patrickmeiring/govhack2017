using EnergyDataProvider;
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
		private static List<SolarHotWaterRegion> SolarHotWaterRegions;

		private string Path(string path)
		{
			return System.Web.HttpContext.Current.Server.MapPath("../Content/" + path);
		}

		EnergyController()
		{
			SolarHotWaterRegions = ComputeSolarHotWaterRegions();
		}

		private List<SolarHotWaterRegion> ComputeSolarHotWaterRegions()
		{
			var SolarHotWaterInstallationsService = new CSVDataProvider<SolarHotWaterInstallation, SolarHotWaterInstallationMap>(Path("solar-hot-water.csv"));
			var DwellingsByPostcodeService = new CSVDataProvider<DwellingsByPostcode, DwellingsByPostcodeMap>(Path("dwellings-by-postcode.csv"));
			var QldDistricts = new CSVDataProvider<QldDistrict, QldDistrictMap>(Path("qld-districts.csv"));

			var ret = QldDistricts.MappedData.GroupBy(x => x.Region).Select(x => new SolarHotWaterRegion()
			{
				Region = x.Key
			}).ToList();

			var installationsByPostCode = SolarHotWaterInstallationsService.MappedData.GroupBy(x => x.Postcode).Select(group => new
			{
				Postcode = group.Key,
				Count = group.Count()
			}).OrderBy(x => x.Postcode).ToList();

			foreach (var district in QldDistricts.MappedData)
			{
				var region = ret.Find(x => x.Region == district.Region);

				var installation = installationsByPostCode.Find(x => x.Postcode == district.Postcode);
				if (installation != null)
					region.Installations += installation.Count;

				var dwelling = DwellingsByPostcodeService.MappedData.Find(x => x.Postcode == district.Postcode);
				if (dwelling != null)
					region.Dwellings += dwelling.Dwellings;
			}

			foreach (var region in ret)
			{
				region.AverageInstallations = ((double)region.Installations / (double)region.Dwellings);
			}

			return ret;
		}

		[HttpGet]
		public List<SolarHotWaterRegion> SolarHotWaterByRegion()
		{
			return SolarHotWaterRegions;
		}
	}
}
