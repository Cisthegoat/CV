import React, { useContext } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { DataContext } from '../context/DataContext';
import { LineChart } from 'react-native-chart-kit';

const ExpenseChart = () => {
  const { pendingBills } = useContext(DataContext);
  
  // Process data for charting - last 6 weeks of expenses
  const getWeeklyExpenseData = () => {
    // Create array of the last 6 weeks (0 = current week)
    const weeks = Array.from({ length: 6 }, (_, i) => i);
    
    // Get expenses for each week
    const weeklyData = weeks.map(weekOffset => {
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - (weekOffset * 7));
      weekStart.setHours(0, 0, 0, 0);
      weekStart.setDate(weekStart.getDate() - weekStart.getDay()); // Set to start of week (Sunday)
      
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      weekEnd.setHours(23, 59, 59, 999);
      
      // Find expenses created in this week
      const weekExpenses = pendingBills.filter(bill => {
        const billDate = new Date(bill.timestamp || bill.dueDate); // Fallback to dueDate if timestamp missing
        return billDate >= weekStart && billDate <= weekEnd;
      });
      
      // Sum expenses
      const total = weekExpenses.reduce((sum, bill) => sum + bill.amount, 0);
      
      return {
        week: weekOffset === 0 
          ? 'This Week' 
          : weekOffset === 1 
            ? 'Last Week' 
            : `${weekOffset} Weeks Ago`,
        total
      };
    }).reverse(); // Reverse to show oldest first
    
    return weeklyData;
  };
  
  const weeklyData = getWeeklyExpenseData();
  
  // Format data for the chart
  const chartData = {
    labels: weeklyData.map(data => data.week.substring(0, 4)), // Truncate labels
    datasets: [
      {
        data: weeklyData.map(data => data.total),
        color: (opacity = 1) => `rgba(94, 162, 239, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Spending Trends</Text>
      
      <LineChart
        data={chartData}
        width={Dimensions.get('window').width - 30}
        height={180}
        chartConfig={{
          backgroundColor: '#FFF',
          backgroundGradientFrom: '#FFF',
          backgroundGradientTo: '#FFF',
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(94, 162, 239, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: '4',
            strokeWidth: '2',
            stroke: '#5EA2EF',
          },
          propsForBackgroundLines: {
            strokeDasharray: '5, 5',
            stroke: '#EBEBEB',
          },
        }}
        bezier
        style={styles.chart}
      />
      
      <View style={styles.legendContainer}>
        {weeklyData.map((data, index) => (
          <View key={index} style={styles.legendItem}>
            <Text style={styles.legendLabel}>{data.week}</Text>
            <Text style={styles.legendValue}>${data.total.toFixed(0)}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 10,
  },
  legendContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  legendItem: {
    width: '30%',
    marginBottom: 8,
  },
  legendLabel: {
    fontSize: 12,
    color: '#666',
  },
  legendValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default ExpenseChart;
