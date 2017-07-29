using EnergyDataProvider.Mappings;
using EnergyDataProvider.Models;
using CsvHelper;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EnergyDataProvider.Providers
{
	public class SolarHotWaterInstallationsService
	{
		static public List<SolarHotWaterInstallation> SolarHotWaterInstallations { get; private set; }

		public SolarHotWaterInstallationsService(string location = "")
		{
			if (File.Exists(location))
			{
				var SolarHotWaterInstallationsCSV = new CsvReader(File.OpenText(location));
				SolarHotWaterInstallationsCSV.Configuration.RegisterClassMap<SolarHotWaterInstallationMap>();
				SolarHotWaterInstallations = SolarHotWaterInstallationsCSV.GetRecords<SolarHotWaterInstallation>().ToList();
			}
		}
	}
}
