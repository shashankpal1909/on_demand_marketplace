import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { useMemo } from "react";
import { RouterProvider } from "react-router-dom";

import { useAppSelector } from "@/app/hooks";

import { selectThemeMode } from "@/features/theme/slice";

import { router } from "@/router";

const App = () => {
  const mode = useAppSelector(selectThemeMode);

  const theme = useMemo(() => {
    const themeOptions = {
      palette: {
        mode: mode as "dark" | "light",
        primary: {
          main: "#2374AB",
        },
        secondary: {
          main: "#AB2346",
        },
      },
      typography: {
        fontFamily: "Inter",
      },
      props: {
        MuiButton: {
          size: "small",
        },
        MuiButtonGroup: {
          size: "small",
        },
        MuiCheckbox: {
          size: "small",
        },
        MuiFab: {
          size: "small",
        },
        MuiFormControl: {
          margin: "dense",
          size: "small",
        },
        MuiFormHelperText: {
          margin: "dense",
        },
        MuiIconButton: {
          size: "small",
        },
        MuiInputBase: {
          margin: "dense",
        },
        MuiInputLabel: {
          margin: "dense",
        },
        MuiRadio: {
          size: "small",
        },
        MuiSwitch: {
          size: "small",
        },
        MuiTextField: {
          margin: "dense",
          size: "small",
        },
        MuiList: {
          dense: true,
        },
        MuiMenuItem: {
          dense: true,
        },
        MuiTable: {
          size: "small",
        },
        MuiTooltip: {
          arrow: true,
        },
        MuiAppBar: {
          color: "transparent",
        },
      },
      components: {
        MuiSwitch: {
          styleOverrides: {
            root: {
              width: 46,
              height: 27,
              padding: 0,
              margin: 8,
            },
            switchBase: {
              padding: 1,
              "&$checked, &$colorPrimary$checked, &$colorSecondary$checked": {
                transform: "translateX(16px)",
                color: "#fff",
                "& + $track": {
                  opacity: 1,
                  border: "none",
                },
              },
            },
            thumb: {
              width: 24,
              height: 24,
            },
            track: {
              borderRadius: 13,
              border: "1px solid #bdbdbd",
              backgroundColor: "#fafafa",
              opacity: 1,
              transition:
                "background-color 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,border 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
            },
          },
        },
        MuiButtonBase: {
          defaultProps: {
            disableRipple: true,
          },
        },
        MuiCssBaseline: {
          styleOverrides: {
            body: {
              scrollbarWidth: "thin",
              scrollbarColor: "#6b6b6b #2b2b2b",
              "&::-webkit-scrollbar, & *::-webkit-scrollbar": {
                backgroundColor: "#2b2b2b",
              },
              "&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb": {
                borderRadius: 8,
                backgroundColor: "#6b6b6b",
                minHeight: 24,
                border: "3px solid #2b2b2b",
              },
              "&::-webkit-scrollbar-thumb:focus, & *::-webkit-scrollbar-thumb:focus":
                {
                  backgroundColor: "#959595",
                },
              "&::-webkit-scrollbar-thumb:active, & *::-webkit-scrollbar-thumb:active":
                {
                  backgroundColor: "#959595",
                },
              "&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover":
                {
                  backgroundColor: "#959595",
                },
              "&::-webkit-scrollbar-corner, & *::-webkit-scrollbar-corner": {
                backgroundColor: "#2b2b2b",
              },
              "*::-webkit-scrollbar": {
                width: "4px",
                height: "4px",
              },
            },
          },
        },
      },
      shape: {
        borderRadius: 8,
      },
      spacing: 8,
    };
    return createTheme(themeOptions);
  }, [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RouterProvider router={router} />
    </ThemeProvider>
  );
};

export default App;
