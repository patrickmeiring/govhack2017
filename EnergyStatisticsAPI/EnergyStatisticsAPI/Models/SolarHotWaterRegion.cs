using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace EnergyStatisticsAPI.Models
{
	public class SolarHotWaterRegion
	{
		public string Region { get; set; }
		public int Dwellings { get; set; }
		public int Installations { get; set; }
		public double AverageInstallations { get; set; }
	}
}