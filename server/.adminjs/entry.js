AdminJS.UserComponents = {}
AdminJS.env.REACT_APP_CUSTOM_VARIABLE = "http://localhost:9000"
import Version from '../src/top-bar'
AdminJS.UserComponents.Version = Version
import PasswordEditComponent from '../node_modules/@adminjs/passwords/build/components/PasswordEditComponent'
AdminJS.UserComponents.PasswordEditComponent = PasswordEditComponent