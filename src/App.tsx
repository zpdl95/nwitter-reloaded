import { useEffect, useState } from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { createGlobalStyle } from 'styled-components';
import reset from 'styled-reset';
import { auth } from './api/firebase';
import Home from './routes/home';
import Login from './routes/login';
import Signup from './routes/signup';
import Main from './routes/main';
import Root from './routes/root';
import LoadingScreen from './components/loading-screen';
import ProtectedRoute from './components/protected-route';
import Layout from './components/layout';

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <Root />,
      children: [
        {
          path: '',
          element: <Home />,
          children: [
            {
              path: 'login',
              element: <Login />,
            },
            {
              path: 'signup',
              element: <Signup />,
            },
          ],
        },
        {
          path: 'main',
          element: (
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          ),
          children: [
            {
              path: '',
              element: <Main />,
            },
          ],
        },
      ],
    },
  ],
  {
    basename: import.meta.env.BASE_URL,
  }
);

const GlobalStyles = createGlobalStyle`
  ${reset};
  *
  {
    box-sizing:border-box;
    margin:0;
    padding:0;

    /* ColorSpace (#B711FF)base Discreet Palette */
    --main-color:#3C2944;
    --font-color:#FFF7FF;
    --accent-color:#B711FF;
    --shadow-color:#A487AE;
  }
  body
  {
    background-color:var(--main-color);
    color:var(--font-color);
    font-family:system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }
`;

function App() {
  const [isLoading, setLoading] = useState(true);
  const init = async () => {
    // wait for firebase
    await auth.authStateReady();
    setLoading(false);
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <>
      <GlobalStyles />
      {isLoading ? <LoadingScreen /> : <RouterProvider router={router} />}
    </>
  );
}

export default App;
