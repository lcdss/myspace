import React, { useRef, useEffect } from 'react';

interface GooglePickerProps {
  clientId: string;
  developerKey: string;
  scope: string | string[];
  viewId: string | string[];
  origin: string;
  multiselect: boolean;
  navHidden: boolean;
}

const GOOGLE_SDK_URL = 'https://apis.google.com/js/api.js';

const GooglePicker = ({
  clientId,
  developerKey,
  scope,
  multiselect,
  navHidden,
  origin,
  viewId,
}: GooglePickerProps) => {
  const pickerApiLoaded = useRef<boolean>(false);
  const oauthToken = useRef<string>('');

  const onAuthApiLoad = () => {
    const authBtn = document.getElementById('g-auth-btn') as HTMLButtonElement;

    if (!authBtn) {
      return;
    }

    authBtn.disabled = false;
    authBtn.addEventListener('click', function() {
      gapi.auth2
        .init({
          client_id: clientId,
        })
        .then((googleAuth: any) => {
          googleAuth
            .signIn({ scope: Array.isArray(scope) ? scope.join(' ') : scope })
            .then((result: any) => {
              handleAuthResult(result.getAuthResponse());
            });
        });
    });
  };

  const onPickerApiLoad = () => {
    pickerApiLoaded.current = true;
    createPicker();
  };

  const handleAuthResult = (authResult: any) => {
    if (authResult && !authResult.error) {
      oauthToken.current = authResult.access_token;
      createPicker();
    }
  };

  const createPicker = () => {
    if (pickerApiLoaded.current && oauthToken.current) {
      const picker = new google.picker.PickerBuilder();

      if (viewId) {
        Array(viewId)
          .flat()
          .forEach(view => {
            // @ts-ignore
            const googleView = google.picker.ViewId[view];
            picker.addView(googleView);
          });
      }

      if (origin) {
        picker.setOrigin(origin);
      }

      if (navHidden) {
        picker.enableFeature(window.google.picker.Feature.NAV_HIDDEN);
      }

      if (multiselect) {
        picker.enableFeature(window.google.picker.Feature.MULTISELECT_ENABLED);
      }

      picker
        .setOAuthToken(oauthToken.current)
        .setDeveloperKey(developerKey)
        .setCallback(pickerCallback)
        .build()
        .setVisible(true);
    }
  };

  const pickerCallback = (data: any) => {
    let url = 'nothing';
    if (data[google.picker.Response.ACTION] === google.picker.Action.PICKED) {
      const doc = data[google.picker.Response.DOCUMENTS][0];
      url = doc[google.picker.Document.URL];
    }
    const message = 'You picked: ' + url;

    const resultEl = document.getElementById('result');

    if (resultEl) {
      resultEl.innerHTML = message;
    }
  };

  useEffect(() => {
    if (!document.getElementById('g-api')) {
      const script = document.createElement('script');
      script.id = 'g-api';
      script.src = GOOGLE_SDK_URL;
      script.onload = () => {
        gapi.load('auth2', onAuthApiLoad);
        gapi.load('picker', onPickerApiLoad);
      };

      document.head.appendChild(script);
    }
  }, []);

  return (
    <>
      <button id="g-auth-btn" type="button">
        Authenticate with Google
      </button>

      <div id="result"></div>
    </>
  );
};

GooglePicker.defaultProps = {
  clientId: process.env.REACT_APP_GOOGLE_OAUTH2_CLIENT_ID,
  developerKey: process.env.REACT_APP_GOOGLE_API_KEY,
  origin: process.env.REACT_APP_BASE_URL,
  navHidden: false,
  multiselect: false,
  viewId: 'DOCS',
} as Partial<GooglePickerProps>;

export default GooglePicker;
