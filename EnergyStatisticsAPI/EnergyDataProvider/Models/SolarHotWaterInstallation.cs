using System;
using System.Collections.Generic;
using System.Text;

namespace EnergyDataProvider.Models
{
	public class SolarHotWaterInstallation
	{
		public string Postcode { get; set; }
		public string Technology { get; set; }
		public string TankCapacity { get; set; }
		public string Booster { get; set; }
		public string Collector { get; set; }
		public string CollectorCircuit { get; set; }
		public string Configuration { get; set; }
	}
}
