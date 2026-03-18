import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { TouchableOpacity } from 'react-native';
import ConverterScreen from './src/screens/ConverterScreen';
import StatsScreen from './src/screens/StatsScreen';
import { BarChart } from 'lucide-react-native';
import { COLORS } from './src/theme/colors';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Converter"
          component={ConverterScreen}
          options={({ navigation }) => ({
            title: 'Purple Currency Converter',
            headerRight: () => (
              <TouchableOpacity onPress={() => navigation.navigate('Stats')}>
                <BarChart
                  size={22}
                  color={COLORS.purple}
                  style={{ marginRight: 12 }}
                />
              </TouchableOpacity>
            ),
          })}
        />

        <Stack.Screen
          name="Stats"
          component={StatsScreen}
          options={{ title: 'Statistics' }}
        />
      </Stack.Navigator>

      <StatusBar style="auto" />
    </NavigationContainer>
  );
}
