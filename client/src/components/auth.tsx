import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode'

function Auth(){
    return(
        <div>
            <GoogleOAuthProvider clientId="593109207682-iujto6mb7vt95l1ppn6hh21qjf45b85j.apps.googleusercontent.com">
                <GoogleLogin
                    onSuccess={credentialResponse => {
                        var token = credentialResponse.credential
                        if (token !== undefined) {
                            var decoded = jwtDecode(token)
                            console.log(decoded);
                        } else {
                            console.log('Credentials undefined')
                        }
                    }}
                    onError={() => {
                        console.log('Login Failed');
                    }}
                />;
            </GoogleOAuthProvider>
        </div>
    );

}

export default Auth