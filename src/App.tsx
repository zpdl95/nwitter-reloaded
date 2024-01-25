import { useEffect, useState } from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { createGlobalStyle } from 'styled-components';
import reset from 'styled-reset';
import { auth } from './api/firebase';
import { Layout, LoadingScreen, ProtectedRoute } from './components/index';
import {
  Home,
  Login,
  Main,
  Profile,
  Root,
  Signup,
  PostTweetForm,
  EditTweetForm,
} from './routes';

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
              children: [
                {
                  path: 'post',
                  element: <PostTweetForm />,
                },
                {
                  path: 'edit',
                  element: <EditTweetForm />,
                },
              ],
            },
            {
              path: 'profile',
              element: <Profile />,
              children: [
                {
                  path: 'post',
                  element: <PostTweetForm />,
                },
                {
                  path: 'edit',
                  element: <EditTweetForm />,
                },
              ],
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
    --accent-color-50:#B711FF50;
    --shadow-color:#A487AE;
    --shadow-l-color:hsl(284.61538461538464, 19.40298507462687%, 75.58823529411765%);
    --shadow-d-color:hsl(284.61538461538464, 19.40298507462687%, 50.58823529411765%);
    --shadow-d-color-30:hsla(284.61538461538464, 19.40298507462687%, 50.58823529411765%, 0.3);
  }

html,body
{
  width:100%;
  height:100%;
  overflow-x: hidden;
}

  body
  {
    background-color:var(--main-color);
    color:var(--font-color);
    font-family:system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }

  :where(img,video){
    max-width:100%;
    height:auto;
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
