import { ResponsivePie } from "@nivo/pie";
import { tokens } from "../theme";
import { useTheme } from "@mui/material";

const PieChart = ({ data, idKey, valueKey, labelKey }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  if (!data || !Array.isArray(data) || data.length === 0 || !idKey || !valueKey) {
    return <div style={{ color: colors.grey[100], padding: '20px' }}>Aucune donnée disponible</div>;
  }

  const firstItem = data[0];
  if (!firstItem || !(idKey in firstItem) || !(valueKey in firstItem)) {
    return <div style={{ color: colors.grey[100], padding: '20px' }}>Configuration invalide</div>;
  }

  const pieData = data
    .map(item => ({
      id: item[idKey],
      label: labelKey && item[labelKey] ? item[labelKey] : item[idKey],
      value: !isNaN(parseFloat(item[valueKey])) ? parseFloat(item[valueKey]) : 0
    }))
    .filter(item => item.value > 0);

  if (pieData.length === 0) {
    return <div style={{ color: colors.grey[100], padding: '20px' }}>Aucune donnée valide</div>;
  }

  return (
    <ResponsivePie
      data={pieData}
      margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
      innerRadius={0.5}
      padAngle={0.7}
      cornerRadius={3}
      colors={{ scheme: 'nivo' }}
      borderWidth={1}
      borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
      arcLinkLabelsSkipAngle={10}
      arcLinkLabelsTextColor={colors.grey[100]}
      arcLinkLabelsThickness={2}
      arcLabelsSkipAngle={10}
      theme={{
        tooltip: {
          container: {
            background: colors.primary[400],
            color: colors.grey[100],
          }
        }
      }}
      legends={[
        {
          anchor: 'bottom',
          direction: 'row',
          justify: false,
          translateX: 0,
          translateY: 56,
          itemsSpacing: 0,
          itemWidth: 100,
          itemHeight: 18,
          itemTextColor: colors.grey[100],
          itemDirection: 'left-to-right',
          itemOpacity: 1,
          symbolSize: 18,
          symbolShape: 'circle',
          effects: [
            { on: 'hover', style: { itemTextColor: colors.greenAccent[500] } },
          ],
        },
      ]}
    />
  );
};

export default PieChart;