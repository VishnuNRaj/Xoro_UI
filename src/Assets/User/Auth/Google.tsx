import { GoogleLogin, GoogleOAuthProvider, useGoogleOneTapLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { googleConfig } from '@/Configs/googleConfig';

interface Props {
    socialMedia: Function;
}

function GoogleAuth({ socialMedia }: Props) {
    useGoogleOneTapLogin({
        onSuccess: (credentialResponse: any) => handleResponse(credentialResponse),
        onError: () => {
            console.log('Login Failed');
        },
        auto_select: true,
        use_fedcm_for_prompt: true,
    });

    const handleResponse = (response: any) => {
        if (response.credential) {
            const userData = jwtDecode(response.credential) as {
                email: string;
                name: string;
                sub: string | number;
                picture: string;
            };

            if (userData) {
                socialMedia({
                    type: 'Google',
                    user: {
                        Email: userData.email,
                        Name: userData.name,
                        Password: userData.sub,
                        Profile: userData.picture,
                    },
                });
            }
        }
    };

    return (
        <div>
            <GoogleLogin
                onSuccess={handleResponse}
                size="medium"
                theme="filled_black"
                logo_alignment="center"
                text="continue_with"
                shape="pill"
                type="icon"
                ux_mode="popup"
            />
        </div>
    );
};

export default function Google({ socialMedia }: Props) {
    return (
        <GoogleOAuthProvider clientId={googleConfig.CliendID}>
            <GoogleAuth socialMedia={socialMedia} />
        </GoogleOAuthProvider>
    );
};

