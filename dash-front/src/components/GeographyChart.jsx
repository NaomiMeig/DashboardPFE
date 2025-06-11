import { useTheme } from "@mui/material";
import { ResponsiveChoropleth } from "@nivo/geo";
import { geoFeatures } from "../data/mockGeoFeatures";
import { tokens } from "../theme";

// 🔧 Fonction pour normaliser les noms de pays
const normalizeCountryName = (name) => {
  if (!name) return '';
  return name.trim().toLowerCase().replace(/[^a-z]/g, '');
};

// 🌍 Dictionnaire pays -> code ISO (avec clés normalisées)
const countryNameToISO = {
  "france": "FRA",
  "germany": "DEU",
  "unitedstates": "USA",
  "usa": "USA",
  "us": "USA",
  "canada": "CAN",
  "brazil": "BRA",
  "brasil": "BRA",
  "china": "CHN",
  "india": "IND",
  "russia": "RUS",
  "russianfederation": "RUS",
  "japan": "JPN",
  "unitedkingdom": "GBR",
  "uk": "GBR",
  "greatbritain": "GBR",
  "spain": "ESP",
  "italy": "ITA",
  "australia": "AUS",
  "mexico": "MEX",
  "portugal": "PRT"
};

const GeographyChart = ({ data, countryKey, valueKey, isDashboard = false }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  if (!data || data.length === 0 || !countryKey || !valueKey) {
    return <div>No data available for geography chart</div>;
  }

  // 🔄 Préparation des données pour la carte
  const geoData = data
    .map(item => {
      const rawCountry = item[countryKey];
      if (!rawCountry) return null;

      const normalized = normalizeCountryName(rawCountry);
      const id = countryNameToISO[normalized] || normalized;

      const value = parseFloat(item[valueKey].toString().replace(',', '.'));
      if (isNaN(value)) return null;

      return { id, value };
    })
    .filter(item => item !== null && item.id && !isNaN(item.value));

  if (geoData.length === 0) {
    return <div>No valid geographic data available</div>;
  }

  return (
    <ResponsiveChoropleth
      data={geoData}
      features={geoFeatures.features}
      theme={{
        axis: {
          domain: { line: { stroke: colors.grey[100] } },
          legend: { text: { fill: colors.grey[100] } },
          ticks: {
            line: { stroke: colors.grey[100], strokeWidth: 1 },
            text: { fill: colors.grey[100] }
          },
        },
        legends: { text: { fill: colors.grey[100] } },
      }}
      margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
      domain={[0, Math.max(...geoData.map(d => d.value))]}
      colors="blues"
      unknownColor="#666666"
      label="properties.name"
      valueFormat=".2s"
      projectionScale={isDashboard ? 40 : 150}
      projectionTranslation={isDashboard ? [0.49, 0.6] : [0.5, 0.5]}
      projectionRotation={[0, 0, 0]}
      borderWidth={1.5}
      borderColor="#ffffff"
      legends={
        !isDashboard
          ? [
              {
                anchor: "bottom-left",
                direction: "column",
                justify: true,
                translateX: 20,
                translateY: -100,
                itemsSpacing: 0,
                itemWidth: 94,
                itemHeight: 18,
                itemDirection: "left-to-right",
                itemTextColor: colors.grey[100],
                itemOpacity: 0.85,
                symbolSize: 18,
                effects: [
                  {
                    on: "hover",
                    style: {
                      itemTextColor: "#ffffff",
                      itemOpacity: 1,
                    },
                  },
                ],
              },
            ]
          : undefined
      }
    />
  );
};

export default GeographyChart;
