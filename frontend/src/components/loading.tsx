import { useTheme } from "./theme-provider";

function LoadingComponent() {
  const { theme } = useTheme();

  let finalTheme = theme;

  if (theme === "system") {
    finalTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  return (
    <div className="flex flex-grow justify-center items-center">
      <svg
        width="100"
        height="100"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 200 200"
      >
        <circle
          fill={finalTheme === "dark" ? "#FFFFFF" : "#000000"}
          stroke={finalTheme === "dark" ? "#FFFFFF" : "#000000"}
          strokeWidth="8"
          r="15"
          cx="40"
          cy="65"
        >
          <animate
            attributeName="cy"
            calcMode="spline"
            dur="1"
            values="65;135;65;"
            keySplines=".5 0 .5 1;.5 0 .5 1"
            repeatCount="indefinite"
            begin="-.4"
          ></animate>
        </circle>
        <circle
          fill={finalTheme === "dark" ? "#FFFFFF" : "#000000"}
          stroke={finalTheme === "dark" ? "#FFFFFF" : "#000000"}
          strokeWidth="8"
          r="15"
          cx="100"
          cy="65"
        >
          <animate
            attributeName="cy"
            calcMode="spline"
            dur="1"
            values="65;135;65;"
            keySplines=".5 0 .5 1;.5 0 .5 1"
            repeatCount="indefinite"
            begin="-.2"
          ></animate>
        </circle>
        <circle
          fill={finalTheme === "dark" ? "#FFFFFF" : "#000000"}
          stroke={finalTheme === "dark" ? "#FFFFFF" : "#000000"}
          strokeWidth="8"
          r="15"
          cx="160"
          cy="65"
        >
          <animate
            attributeName="cy"
            calcMode="spline"
            dur="1"
            values="65;135;65;"
            keySplines=".5 0 .5 1;.5 0 .5 1"
            repeatCount="indefinite"
            begin="0"
          ></animate>
        </circle>
      </svg>
    </div>
  );
}

export default LoadingComponent;
