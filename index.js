import { registerRootComponent } from 'expo';
// Initialize Firebase before anything else
import './app/config/firebase';
import App from './app/App';

registerRootComponent(App);