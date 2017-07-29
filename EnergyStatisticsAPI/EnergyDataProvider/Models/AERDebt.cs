using System;
using System.Collections.Generic;
using System.Text;

namespace EnergyDataProvider.Models
{
	public class AERDebt
	{
		public string Quarter { get; set; }
		public int ResidentialElectricityCustomersWithDebt { get; set; }
		public int AverageResidentialElectricityDebt { get; set; }
		public int ResidentialGasCustomersWithDebt { get; set; }
		public int AverageResidentialGasDebt { get; set; }
		public int SmallBusinessElectricityCustomersWithDebt { get; set; }
		public int AverageSmallBusinessElectricityDebt { get; set; }
		public int SmallBusinessGasCustomersWithDebt { get; set; }
		public int AverageSmallBusinessGasDebt { get; set; }
	}
}