import 'react-native-gesture-handler';
import { AppRegistry } from 'react-native';
import AppRoot from './src/app/index';
import { name as appName } from './app.json';
import './global.css';

AppRegistry.registerComponent(appName, () => AppRoot);
