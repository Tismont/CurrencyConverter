import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { TouchableOpacity, Text } from 'react-native';
import ConverterScreen from './src/screens/ConverterScreen';
import StatsScreen from './src/screens/StatsScreen';

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
                <Text
                  style={{
                    marginRight: 12,
                    color: '#4C276F',
                    fontWeight: '600',
                  }}
                >
                  Stats
                </Text>
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
