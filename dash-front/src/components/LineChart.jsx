import { ResponsiveLine } from "@nivo/line";
import { useTheme } from "@mui/material";
import { tokens } from "../theme";

const LineChart = ({ 
  data, 
  xAxisKey, 
  yAxisKey, 
  isDashboard = false,
  multipleSeries = false,
  seriesKeys = []
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // Vérifications complètes des données
  if (!data || !Array.isArray(data) || data.length === 0 || !xAxisKey || !yAxisKey) {
    return <div style={{ color: colors.grey[100], padding: '20px' }}>Aucune donnée disponible</div>;
  }

  // Vérifie que les clés existent dans le premier élément
  const firstItem = data[0];
  if (!firstItem || !(xAxisKey in firstItem)) {
    return <div style={{ color: colors.grey[100], padding: '20px' }}>Configuration d'axe invalide</div>;
  }

  // Formatage des données
  const formatData = () => {
    if (multipleSeries && seriesKeys.length > 0) {
      return seriesKeys.filter(key => key in firstItem).map(key => ({
        id: key,
        color: colors.greenAccent[500 + (seriesKeys.indexOf(key) * 200)],
        data: data.map(item => ({
          x: item[xAxisKey],
          y: !isNaN(parseFloat(item[key])) ? parseFloat(item[key]) : 0
        })).filter(point => point.x !== undefined && !isNaN(point.y))
      }));
    }
    return [{
      id: yAxisKey,
      color: colors.greenAccent[500],
      data: data.map(item => ({
        x: item[xAxisKey],
        y: !isNaN(parseFloat(item[yAxisKey])) ? parseFloat(item[yAxisKey]) : 0
      })).filter(point => point.x !== undefined && !isNaN(point.y))
    }];
  };

  const chartData = formatData();

  return (
    <ResponsiveLine
      data={chartData}
      margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
      xScale={{ type: 'point' }}
      yScale={{
        type: 'linear',
        min: 'auto',
        max: 'auto',
        stacked: false,
        reverse: false,
      }}
      curve="monotoneX"
      axisBottom={{
        orient: 'bottom',
        tickSize: 5,
        tickPadding: 5,
        tickRotation: isDashboard ? -45 : 0,
        legend: xAxisKey,
        legendOffset: 36,
        legendPosition: 'middle',
      }}
      axisLeft={{
        orient: 'left',
        tickValues: 5,
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: multipleSeries ? 'Valeurs' : yAxisKey,
        legendOffset: -40,
        legendPosition: 'middle',
      }}
      pointSize={isDashboard ? 6 : 8}
      pointColor={{ theme: 'background' }}
      pointBorderWidth={2}
      pointBorderColor={{ from: 'serieColor' }}
      useMesh={true}
      theme={{
        axis: {
          domain: { line: { stroke: colors.grey[100] } },
          legend: { text: { fill: colors.grey[100] } },
          ticks: {
            line: { stroke: colors.grey[100], strokeWidth: 1 },
            text: { fill: colors.grey[100] },
          },
        },
        tooltip: {
          container: {
            background: colors.primary[400],
            color: colors.grey[100],
          }
        }
      }}
      colors={d => d.color}
      enableArea={isDashboard}
      areaOpacity={0.1}
      legends={multipleSeries ? [
        {
          anchor: 'bottom-right',
          direction: 'column',
          justify: false,
          translateX: 100,
          translateY: 0,
          itemsSpacing: 0,
          itemDirection: 'left-to-right',
          itemWidth: 80,
          itemHeight: 20,
          itemOpacity: 0.75,
          symbolSize: 12,
          symbolShape: 'circle',
        }
      ] : undefined}
    />
  );
};

export default LineChart;
