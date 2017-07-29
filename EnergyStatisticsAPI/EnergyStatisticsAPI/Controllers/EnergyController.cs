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
		private static CSVDataProvider<SolarHotWaterInstallation, SolarHotWaterInstallationMap> SolarHotWaterInstallationsService;
		private static CSVDataProvider<DwellingsByPostcode, DwellingsByPostcodeMap> DwellingsByPostcodeService;
		private static List<Tuple<string, CSVDataProvider<AERDebt, AERDebtMap>>> AERDebtService;

		private string Path(string path)
		{
			return System.Web.HttpContext.Current.Server.MapPath("../Content/" + path);
		}

		EnergyController()
		{
			SolarHotWaterInstallationsService = new CSVDataProvider<SolarHotWaterInstallation, SolarHotWaterInstallationMap>(Path("solar-hot-water.csv"));
			DwellingsByPostcodeService = new CSVDataProvider<DwellingsByPostcode, DwellingsByPostcodeMap>(Path("dwellings-by-postcode.csv"));
			SolarHotWaterRegions = ComputeSolarHotWaterRegions();

			LoadAERData();
		}



		private void LoadAERData()
		{
			var aerFiles = new List<string>()
			{
				"act.csv",
				"nsw.csv",
				"qld.csv",
				"sa.csv",
				"tas.csv"
			};

			AERDebtService = CSVDataProvider<AERDebt, AERDebtMap>.LoadMultipleFromDirectory(Path("../Content/debt"), aerFiles);
		}

		private List<SolarHotWaterRegion> ComputeSolarHotWaterRegions()
		{

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

			foreach (var district in QldDistricts.MappedData.GroupBy(x => x.Postcode).ToList())
			{
				var region = ret.Find(x => x.Region == district.First().Region);

				var installation = installationsByPostCode.Find(x => x.Postcode == district.First().Postcode);
				if (installation != null)
					region.Installations += installation.Count;

				var dwelling = DwellingsByPostcodeService.MappedData.Find(x => x.Postcode == district.First().Postcode);
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
		public SolarHotWaterPostcode SolarHotWaterByRegion(string postcode)
		{
			var ret = new SolarHotWaterPostcode();
			ret.Installations = SolarHotWaterInstallationsService.MappedData.Where(x => x.Postcode == postcode).Count();

			if (DwellingsByPostcodeService.MappedData.Find(x => x.Postcode == postcode) != null)
			{
				ret.Dwellings = DwellingsByPostcodeService.MappedData.Find(x => x.Postcode == postcode).Dwellings;
				ret.AverageInstallations = ((double)ret.Installations / (double)ret.Dwellings);
			}

			ret.Regions = SolarHotWaterRegions;

			return ret;
		}

		[HttpGet]
		public List<Tuple<string, List<AERDebt>>> AERDebt()
		{
			return AERDebtService.Select(x => Tuple.Create(x.Item1, x.Item2.MappedData.ToList())).ToList();
		}
	}
}
