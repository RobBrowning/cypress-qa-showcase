// Runs before every spec file. Plugins that add commands or hooks register here.
import { register as registerCypressGrep } from '@cypress/grep';
import 'cypress-axe';
import 'cypress-mochawesome-reporter/register';
import './commands';

registerCypressGrep();
